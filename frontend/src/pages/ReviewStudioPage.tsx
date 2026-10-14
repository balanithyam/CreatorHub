import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Play, Pause, Volume2, VolumeX, RotateCcw, CheckCircle2, MessageSquare, 
  Send, Tag, Clock, Layers, Sparkles, Check, AlertCircle, Eye, ThumbsUp, UserCheck, FastForward, Rewind, Maximize, Film
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { ContentItem, ReviewComment } from '../types';

const safeArray = (val: any) => Array.isArray(val) ? val : (Array.isArray(val?.data) ? val.data : []);

const DEFAULT_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-cooking-a-salad-41386-large.mp4';
const FALLBACK_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export const ReviewStudioPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialContentId = searchParams.get('contentId');

  const { user } = useAuth();
  const socket = useSocket();

  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string>('');
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // Video Player State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [videoSrc, setVideoSrc] = useState(DEFAULT_VIDEO);

  // Comment input state
  const [commentText, setCommentText] = useState('');
  const [commentCategory, setCommentCategory] = useState('pacing');
  const [submittingComment, setSubmittingComment] = useState(false);

  // AI Summary state
  const [aiSummaryOpen, setAiSummaryOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState<any>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchContentData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/content');
      const items = safeArray(res.data);
      setContentList(items);

      if (items.length > 0) {
        const target = initialContentId ? items.find(c => c._id === initialContentId) || items[0] : items[0];
        setSelectedContent(target);
        await loadReviewData(target._id);
      }
    } catch (err) {
      console.error('Failed to load content', err);
    } finally {
      setLoading(false);
    }
  };

  const loadReviewData = async (contentId: string) => {
    try {
      const res = await api.get(`/review/${contentId}`);
      if (res.data?.success && res.data?.data) {
        const { content, versions: vers, currentVersion, comments: comms } = res.data.data;
        if (content) setSelectedContent(content);
        const versList = Array.isArray(vers) ? vers : [];
        setVersions(versList);
        if (currentVersion) {
          setSelectedVersionId(currentVersion._id);
          if (currentVersion.mediaUrl) {
            setVideoSrc(currentVersion.mediaUrl);
          }
        } else if (versList.length > 0) {
          setSelectedVersionId(versList[0]._id);
          if (versList[0].mediaUrl) setVideoSrc(versList[0].mediaUrl);
        }
        setComments(Array.isArray(comms) ? comms : []);
      }
    } catch (err) {
      console.error('Failed to load review studio data', err);
    }
  };

  useEffect(() => {
    fetchContentData();
  }, [initialContentId]);

  // Video Handlers
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        // Fallback video source if browser blocked it
        if (videoRef.current) {
          videoRef.current.src = FALLBACK_VIDEO;
          videoRef.current.play();
          setIsPlaying(true);
        }
      });
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const seekTo = (seconds: number) => {
    setCurrentTime(seconds);
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const stepTime = (delta: number) => {
    if (videoRef.current) {
      const next = Math.max(0, Math.min(duration, videoRef.current.currentTime + delta));
      videoRef.current.currentTime = next;
      setCurrentTime(next);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContent || !commentText.trim()) return;
    try {
      setSubmittingComment(true);
      const res = await api.post('/review/comments', {
        contentId: selectedContent._id,
        versionId: selectedVersionId || (versions[0]?._id),
        commentType: 'video_timestamp',
        timestampSec: Math.round(currentTime * 10) / 10,
        body: commentText.trim(),
        category: commentCategory
      });

      const newComm = res.data?.data || res.data;
      setComments([...comments, newComm]);
      setCommentText('');
      showToast(`📍 Pinned comment at ${formatTime(currentTime)}!`);
    } catch (err) {
      console.error('Failed to post review comment', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleToggleResolve = async (commentId: string, currentStatus: boolean) => {
    try {
      const res = await api.patch(`/review/comments/${commentId}/status`, {
        resolved: !currentStatus
      });
      const updated = res.data?.data || res.data;
      setComments(comments.map(c => c._id === commentId ? { ...c, resolved: !currentStatus } : c));
      showToast(!currentStatus ? '✅ Marked comment as resolved!' : 'Reopened comment');
    } catch (err) {
      console.error('Failed to update comment status', err);
    }
  };

  const handleApproveCut = async () => {
    if (!selectedContent) return;
    try {
      await api.patch(`/content/${selectedContent._id}`, { status: 'published' });
      setSelectedContent({ ...selectedContent, status: 'published' });
      showToast('🎉 Master video cut approved and ready to publish!');
    } catch (err) {
      console.error('Failed to approve cut', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121316] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#D2F800]/40 flex items-center gap-3 font-mono text-xs animate-slide-up">
          <Check className="w-4 h-4 text-[#D2F800]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#121316] text-white rounded-3xl p-6 lg:p-8 border-2 border-[#121316] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-[#FF5A36] text-white text-xs font-mono font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-white" />
              Frame Review Studio
            </span>
            <span className="text-xs font-mono text-[#9E9B95]">Timestamped Editorial Feedback & Approval</span>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase ${
              user?.role === 'EDITOR' ? 'bg-[#FF9900] text-[#121316]' :
              user?.role === 'PRODUCER' ? 'bg-[#2A72FF] text-white' :
              user?.role === 'CREATOR' ? 'bg-[#D2F800] text-[#121316]' :
              'bg-white/20 text-white'
            }`}>
              {user?.role === 'EDITOR' ? 'Editor (Cut Upload & Marker Resolving)' :
               user?.role === 'PRODUCER' ? 'Producer (Release Approval Authority)' :
               user?.role === 'CREATOR' ? 'Creator (Artistic Sign-off)' :
               `${user?.role || 'Team'} Mode`}
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Collaborative Review Studio
          </h1>
          <p className="text-[#E5E0D8] text-sm mt-1 max-w-2xl">
            Click anywhere on the timeline to pin exact timestamped feedback. Review cuts side-by-side with your producer and video editor.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleApproveCut}
            className="px-5 py-2.5 bg-[#D2F800] hover:bg-[#bce000] text-[#121316] font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-[#121316]" />
            Approve Video Cut
          </button>
        </div>
      </div>

      {/* Project Selector Tabs */}
      {contentList.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-extrabold uppercase text-[#6B6864] flex-shrink-0">Active Project:</span>
          {contentList.map((item) => (
            <button
              key={item._id}
              onClick={() => { setSelectedContent(item); loadReviewData(item._id); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                selectedContent?._id === item._id
                  ? 'bg-[#121316] text-white border-[#121316]'
                  : 'bg-white text-[#121316] border-[#E5E0D8] hover:bg-[#FAF8F5]'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
      )}

      {/* Main Review Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player & Timeline Scrubber (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border-2 border-[#121316] overflow-hidden shadow-sm">
            {/* Version & Metadata Header */}
            <div className="px-5 py-3 border-b border-[#E5E0D8] bg-[#FAF8F5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase text-[#6B6864]">Version:</span>
                <span className="px-2.5 py-1 bg-[#121316] text-white text-xs font-mono font-bold rounded-md">
                  Cut v{versions.find(v => v._id === selectedVersionId)?.versionNumber || 1}
                </span>
                <span className="text-xs font-semibold text-[#121316] line-clamp-1">
                  {selectedContent?.title || '10-Minute Japanese Street Ramen'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {['0.5x', '1x', '1.5x', '2x'].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => changeSpeed(parseFloat(spd))}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold cursor-pointer ${
                      playbackSpeed === parseFloat(spd) ? 'bg-[#FF5A36] text-white' : 'bg-white text-[#6B6864] hover:text-[#121316]'
                    }`}
                  >
                    {spd}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Screen */}
            <div className="relative aspect-video bg-black flex items-center justify-center group">
              <video
                ref={videoRef}
                src={videoSrc}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={(e) => {
                  const d = e.currentTarget.duration;
                  if (d && !isNaN(d)) setDuration(d);
                }}
                onEnded={() => setIsPlaying(false)}
                onClick={togglePlay}
                className="w-full h-full object-contain cursor-pointer"
                playsInline
                preload="metadata"
              />

              {/* Big Center Play Button Overlay */}
              {!isPlaying && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 m-auto w-16 h-16 bg-[#FF5A36] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
                >
                  <Play className="w-7 h-7 fill-current ml-1" />
                </button>
              )}
            </div>

            {/* Timeline Controls & Interactive Scrubber */}
            <div className="p-4 bg-[#FAF8F5] border-t border-[#E5E0D8] space-y-3">
              {/* Scrub Bar with Comment Markers */}
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-[#E5E0D8] rounded-lg appearance-none cursor-pointer accent-[#FF5A36]"
                />

                {/* Comment Markers on Scrub Bar */}
                {comments.map((comm, i) => {
                  const posPercent = duration > 0 ? (comm.timestampSec / duration) * 100 : 0;
                  if (isNaN(posPercent) || posPercent < 0 || posPercent > 100) return null;
                  return (
                    <button
                      key={i}
                      onClick={() => seekTo(comm.timestampSec)}
                      title={`@ ${formatTime(comm.timestampSec)}: ${comm.body}`}
                      style={{ left: `${posPercent}%` }}
                      className="absolute top-0 -translate-x-1/2 w-3 h-3 bg-[#D2F800] border-2 border-[#121316] rounded-full hover:scale-150 transition-transform cursor-pointer"
                    />
                  );
                })}
              </div>

              {/* Transport Buttons & Timecode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2 bg-[#121316] hover:bg-[#2A2C32] text-white rounded-xl transition-all cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <button
                    onClick={() => stepTime(-1)}
                    className="p-1.5 text-[#6B6864] hover:text-[#121316] cursor-pointer"
                    title="Step backward 1 second"
                  >
                    <Rewind className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => stepTime(1)}
                    className="p-1.5 text-[#6B6864] hover:text-[#121316] cursor-pointer"
                    title="Step forward 1 second"
                  >
                    <FastForward className="w-4 h-4" />
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-1.5 text-[#6B6864] hover:text-[#121316] cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {/* Timecode */}
                  <span className="font-mono text-xs font-bold text-[#121316]">
                    {formatTime(currentTime)} <span className="text-[#9E9B95]">/ {formatTime(duration)}</span>
                  </span>
                </div>

                <div className="text-xs font-mono text-[#FF5A36] font-bold">
                  Pin timestamp: {formatTime(currentTime)}
                </div>
              </div>
            </div>
          </div>

          {/* Add Review Note Form */}
          <div className="bg-white rounded-2xl border-2 border-[#121316] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-[#121316] flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#FF5A36]" />
                Add Review Feedback @ {formatTime(currentTime)}
              </span>

              <div className="flex items-center gap-1.5">
                {['pacing', 'audio', 'graphic', 'script', 'color'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCommentCategory(cat)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                      commentCategory === cat ? 'bg-[#FF5A36] text-white' : 'bg-[#FAF8F5] text-[#6B6864] hover:text-[#121316]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder={`Type feedback at frame ${formatTime(currentTime)} (e.g. "Cut out 1s pause", "Add price graphics")...`}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-[#FAF8F5] border border-[#121316] rounded-xl px-4 py-2.5 text-xs font-medium text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]"
              />
              <button
                type="submit"
                disabled={submittingComment || !commentText.trim()}
                className="px-5 py-2.5 bg-[#121316] hover:bg-[#2A2C32] text-white disabled:opacity-50 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-[#D2F800]" />
                Post Note
              </button>
            </form>
          </div>
        </div>

        {/* Timestamped Comments & Revision Notes (1 col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border-2 border-[#121316] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div>
                <h3 className="font-extrabold text-[#121316] text-sm">Timestamped Feedback</h3>
                <p className="text-[11px] text-[#6B6864]">{comments.length} revision markers</p>
              </div>
              <span className="px-2.5 py-1 bg-[#FAF8F5] text-[#121316] text-xs font-mono font-bold rounded-lg border border-[#E5E0D8]">
                {comments.filter(c => c.resolved).length}/{comments.length} Resolved
              </span>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {comments.length === 0 && (
                <div className="py-12 text-center text-xs text-[#6B6864]">
                  No feedback pinned yet. Play the video and post a comment!
                </div>
              )}

              {comments.map((comm) => (
                <div
                  key={comm._id}
                  className={`p-3.5 rounded-xl border transition-all space-y-2 ${
                    comm.resolved 
                      ? 'bg-[#FAF8F5] border-[#E5E0D8] opacity-75' 
                      : 'bg-white border-[#121316] shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => seekTo(comm.timestampSec)}
                      className="px-2 py-0.5 bg-[#FF5A36] text-white text-[11px] font-mono font-bold rounded-md flex items-center gap-1 hover:bg-[#e04523] cursor-pointer"
                    >
                      <Clock className="w-3 h-3" />
                      {formatTime(comm.timestampSec)}
                    </button>

                    <button
                      onClick={() => handleToggleResolve(comm._id, comm.resolved)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer ${
                        comm.resolved ? 'bg-green-100 text-green-800' : 'bg-[#FAF8F5] text-[#6B6864] hover:text-[#121316]'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      {comm.resolved ? 'Resolved' : 'Mark Done'}
                    </button>
                  </div>

                  <p className="text-xs text-[#121316] font-medium leading-relaxed">
                    {comm.body}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-[#6B6864] pt-1">
                    <span className="font-bold">{comm.authorId?.name || 'Producer Marcus'}</span>
                    <span className="uppercase font-mono">{comm.commentType?.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
