code = r"""import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Play, Pause, Volume2, VolumeX, RotateCcw, CheckCircle2, MessageSquare, 
  Send, Tag, Clock, Layers, Sparkles, Check, AlertCircle, Eye, ThumbsUp, UserCheck
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { ContentItem, ReviewComment } from '../types';

export const ReviewStudioPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialContentId = searchParams.get('contentId');
  const initialVersion = searchParams.get('version');

  const { user } = useAuth();
  const socket = useSocket();

  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [selectedVersionNum, setSelectedVersionNum] = useState<number>(1);
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [loading, setLoading] = useState(true);

  // Video State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Comment input state
  const [commentText, setCommentText] = useState('');
  const [commentCategory, setCommentCategory] = useState<'PACING' | 'AUDIO' | 'GRAPHIC' | 'SCRIPT' | 'COLOR'>('PACING');
  const [toast, setToast] = useState<string | null>(null);

  const safeArray = (val: any) => Array.isArray(val) ? val : (Array.isArray(val?.data) ? val.data : []);

  const fetchContentData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/content');
      const items = safeArray(res.data);
      setContentList(items);
      if (items.length > 0) {
        const found = initialContentId 
          ? items.find((c: ContentItem) => c._id === initialContentId) || items[0]
          : items[0];
        setSelectedContent(found);
        setSelectedVersionNum(initialVersion ? parseInt(initialVersion, 10) : (found.versions?.length || 1));
      }
    } catch (err) {
      console.error('Failed to load review items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContentData();
  }, [initialContentId, initialVersion]);

  const fetchComments = async (contentId: string) => {
    try {
      const res = await api.get(`/review/${contentId}`);
      setComments(safeArray(res.data));
    } catch (err) {
      console.error('Failed to load comments', err);
    }
  };

  useEffect(() => {
    if (selectedContent) {
      fetchComments(selectedContent._id);
    }
  }, [selectedContent]);

  useEffect(() => {
    if (!socket || !selectedContent) return;

    socket.emit('join_content', selectedContent._id);

    socket.on('new_comment', (newComment: ReviewComment) => {
      setComments((prev) => [newComment, ...safeArray(prev)]);
      showToast(`New comment from ${newComment.author?.name || 'collaborator'}`);
    });

    socket.on('comment_updated', (updated: ReviewComment) => {
      setComments((prev) => safeArray(prev).map(c => c._id === updated._id ? updated : c));
    });

    return () => {
      socket.emit('leave_content', selectedContent._id);
      socket.off('new_comment');
      socket.off('comment_updated');
    };
  }, [socket, selectedContent]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleJumpToTimestamp = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setCurrentTime(seconds);
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContent || !commentText.trim()) return;
    try {
      const payload = {
        contentId: selectedContent._id,
        versionNumber: selectedVersionNum,
        timestampSeconds: Math.floor(currentTime),
        text: commentText.trim(),
        category: commentCategory
      };

      const res = await api.post('/review', payload);
      setComments([res.data?.data || res.data, ...safeArray(comments)]);
      setCommentText('');
      showToast(`Added review note at ${formatTime(Math.floor(currentTime))}`);
    } catch (err) {
      console.error('Failed to post comment', err);
    }
  };

  const handleToggleResolveComment = async (commentId: string, currentStatus: boolean) => {
    try {
      const res = await api.patch(`/review/${commentId}`, {
        resolved: !currentStatus
      });
      const updated = res.data?.data || res.data;
      setComments(safeArray(comments).map(c => c._id === commentId ? updated : c));
      showToast(currentStatus ? 'Comment marked as open' : 'Comment marked resolved!');
    } catch (err) {
      console.error('Failed to toggle comment', err);
    }
  };

  const handleApproveCut = async () => {
    if (!selectedContent) return;
    try {
      const res = await api.patch(`/content/${selectedContent._id}`, {
        status: 'PUBLISHED'
      });
      const updated = res.data?.data || res.data;
      setSelectedContent(updated);
      setContentList(safeArray(contentList).map(c => c._id === selectedContent._id ? updated : c));
      showToast('🎉 Master Cut Approved & Marked Ready for Publishing!');
    } catch (err) {
      console.error('Failed to approve cut', err);
    }
  };

  const currentComments = safeArray(comments);
  const currentVersions = selectedContent?.versions || [{ versionNumber: 1 }];
  const currentVersionObj = currentVersions.find(v => v.versionNumber === selectedVersionNum);
  const mediaUrl = currentVersionObj?.mediaUrl || 
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121316] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#D2F800]/40 flex items-center gap-3 font-mono text-xs animate-slide-up">
          <Check className="w-4 h-4 text-[#D2F800]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#121316] text-white rounded-3xl p-6 lg:p-8 border border-gray-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-[#FF5A36] text-white text-xs font-mono font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 fill-white" />
              Frame Review Studio
            </span>
            <span className="text-xs font-mono text-gray-400">Timestamped Editorial Feedback & Approval</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            {selectedContent?.title || 'Collaborative Review Studio'}
          </h1>
          <p className="text-gray-300 text-sm mt-1 max-w-2xl">
            Click anywhere on the timeline to pin exact timestamped feedback. Review cuts side-by-side with your producer.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleApproveCut}
            className="px-5 py-2.5 bg-[#D2F800] hover:bg-lime-400 text-[#121316] font-black rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <ThumbsUp className="w-4 h-4" />
            Approve & Sign Off Cut
          </button>
        </div>
      </div>

      {/* Main Review Studio Workspace: Video Player + Comments Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8 Cols: Video Player & Timeline */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border-2 border-[#121316]/10 shadow-sm space-y-4">
          
          {/* Version Switcher Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#121316] uppercase">Version:</span>
              <div className="flex items-center gap-1">
                {currentVersions.map((v) => (
                  <button
                    key={v.versionNumber}
                    onClick={() => setSelectedVersionNum(v.versionNumber)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      selectedVersionNum === v.versionNumber
                        ? 'bg-[#121316] text-white shadow-sm'
                        : 'bg-[#FAF8F5] text-[#6B6864] hover:text-[#121316]'
                    }`}
                  >
                    Cut v{v.versionNumber}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs font-mono text-[#6B6864]">
              Format: <strong className="text-[#121316]">{selectedContent?.format || selectedContent?.type || 'YOUTUBE_LONG'}</strong>
            </span>
          </div>

          {/* Video Container */}
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video flex items-center justify-center group">
            <video
              ref={videoRef}
              src={mediaUrl}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-contain cursor-pointer"
              onClick={handlePlayPause}
            />

            {!isPlaying && (
              <button
                onClick={handlePlayPause}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#FF5A36]/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
              >
                <Play className="w-8 h-8 fill-white ml-1" />
              </button>
            )}
          </div>

          {/* Custom Controls Bar */}
          <div className="bg-[#FAF8F5] rounded-2xl p-4 border-2 border-[#121316]/10 space-y-3">
            <div className="relative flex items-center">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#FF5A36]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayPause}
                  className="p-2 bg-[#121316] text-white rounded-xl hover:bg-[#FF5A36] transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                <button
                  onClick={() => handleJumpToTimestamp(0)}
                  className="p-2 bg-gray-200 text-[#121316] rounded-xl hover:bg-gray-300 cursor-pointer"
                  title="Restart"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = !isMuted;
                      setIsMuted(!isMuted);
                    }
                  }}
                  className="p-2 bg-gray-200 text-[#121316] rounded-xl hover:bg-gray-300 cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <span className="text-xs font-mono font-bold text-[#121316]">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#6B6864]">
                  Pin timestamp: <strong className="text-[#FF5A36] font-bold">{formatTime(currentTime)}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Add Timestamped Comment Box */}
          <form onSubmit={handleAddComment} className="bg-[#FAF8F5] rounded-2xl p-4 border-2 border-[#121316]/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-[#121316] flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#FF5A36]" />
                Add Review Feedback at {formatTime(currentTime)}
              </span>

              <div className="flex items-center gap-1">
                {(['PACING', 'AUDIO', 'GRAPHIC', 'SCRIPT', 'COLOR'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCommentCategory(cat)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      commentCategory === cat
                        ? 'bg-[#FF5A36] text-white shadow-sm'
                        : 'bg-white text-[#6B6864] hover:text-[#121316] border border-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder={`Leave feedback for v${selectedVersionNum} at ${formatTime(currentTime)} (e.g. Trim 2s silence, add subtitle)...`}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-4 py-2 bg-white border-2 border-[#121316]/10 rounded-xl text-xs focus:outline-none focus:border-[#FF5A36]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#121316] hover:bg-[#FF5A36] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Post Note
              </button>
            </div>
          </form>

        </div>

        {/* Right 4 Cols: Review Comments Feed */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border-2 border-[#121316]/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-xs uppercase font-mono text-[#121316]">Timeline Review Notes</h3>
              <p className="text-[10px] text-[#6B6864] font-mono">Click timestamp to jump to frame</p>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#D2F800]/40 text-[#121316] rounded-full">
              {currentComments.filter(c => c.resolved).length}/{currentComments.length} resolved
            </span>
          </div>

          <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
            {currentComments.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-[#121316]/20 rounded-2xl text-xs text-[#6B6864] font-mono">
                No review comments yet. Scrub the video and add your thoughts!
              </div>
            ) : (
              currentComments.map((comment) => (
                <div
                  key={comment._id}
                  className={`p-4 rounded-2xl border-2 transition-all space-y-2 ${
                    comment.resolved
                      ? 'bg-[#FAF8F5]/60 border-gray-200 opacity-60'
                      : 'bg-[#FAF8F5] border-[#121316]/20 hover:border-[#121316] shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleJumpToTimestamp(comment.timestampSeconds || comment.timestampSec || 0)}
                      className="px-2 py-0.5 bg-[#121316] text-[#D2F800] rounded text-[11px] font-mono font-bold flex items-center gap-1 hover:bg-[#FF5A36] hover:text-white transition-colors cursor-pointer"
                    >
                      <Clock className="w-3 h-3" />
                      {formatTime(comment.timestampSeconds || comment.timestampSec || 0)}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono px-2 py-0.5 bg-gray-200 text-[#121316] rounded font-bold uppercase">
                        {comment.category || comment.type || 'NOTE'}
                      </span>
                      <button
                        onClick={() => handleToggleResolveComment(comment._id, comment.resolved)}
                        className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                          comment.resolved
                            ? 'text-[#28A745] hover:text-green-700'
                            : 'text-gray-400 hover:text-[#28A745]'
                        }`}
                        title={comment.resolved ? 'Mark unresolved' : 'Mark resolved'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#121316] font-medium leading-relaxed">
                    {comment.text || comment.body}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-[#6B6864] border-t border-gray-200">
                    <span>{comment.author?.name || 'Reviewer'}</span>
                    <span>v{comment.versionNumber || 1}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
"""

with open(r'D:\CreatorHub\frontend\src\pages\ReviewStudioPage.tsx', 'w', encoding='utf-8') as f:
    f.write(code.strip())

print("Updated ReviewStudioPage.tsx!")
