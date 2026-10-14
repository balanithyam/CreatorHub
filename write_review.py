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

  const fetchContentData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/content');
      setContentList(res.data);
      if (res.data.length > 0) {
        const found = initialContentId 
          ? res.data.find((c: ContentItem) => c._id === initialContentId) || res.data[0]
          : res.data[0];
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

  // Fetch comments when content changes
  const fetchComments = async (contentId: string) => {
    try {
      const res = await api.get(`/review/${contentId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Failed to load comments', err);
    }
  };

  useEffect(() => {
    if (selectedContent) {
      fetchComments(selectedContent._id);
    }
  }, [selectedContent]);

  // Real-time socket events
  useEffect(() => {
    if (!socket || !selectedContent) return;

    socket.emit('join_content', selectedContent._id);

    socket.on('new_comment', (newComment: ReviewComment) => {
      setComments((prev) => [newComment, ...prev]);
      showToast(`New comment from ${newComment.author?.name || 'collaborator'}`);
    });

    socket.on('comment_updated', (updated: ReviewComment) => {
      setComments((prev) => prev.map(c => c._id === updated._id ? updated : c));
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
      setComments([res.data, ...comments]);
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
      setComments(comments.map(c => c._id === commentId ? res.data : c));
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
      setSelectedContent(res.data);
      setContentList(contentList.map(c => c._id === selectedContent._id ? res.data : c));
      showToast('🎉 Master Cut Approved & Marked Ready for Publishing!');
    } catch (err) {
      console.error('Failed to approve cut', err);
    }
  };

  // Find active media URL for selected version
  const currentVersionObj = selectedContent?.versions?.find(v => v.versionNumber === selectedVersionNum);
  const mediaUrl = currentVersionObj?.mediaUrl || 
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-lime-400/40 flex items-center gap-3 font-mono text-xs animate-slide-up">
          <Check className="w-4 h-4 text-lime-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-charcoal-900 text-white rounded-3xl p-6 lg:p-8 border border-charcoal-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-coral-500 text-white text-xs font-mono font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 fill-white" />
              Frame Review Studio
            </span>
            <span className="text-xs font-mono text-charcoal-400">Timestamped Editorial Feedback & Approval</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            {selectedContent?.title || 'Collaborative Review Studio'}
          </h1>
          <p className="text-charcoal-300 text-sm mt-1 max-w-2xl">
            Click anywhere on the timeline to pin exact timestamped feedback. Review cuts side-by-side with your producer.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleApproveCut}
            className="px-5 py-2.5 bg-lime-400 hover:bg-lime-500 text-charcoal-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
          >
            <ThumbsUp className="w-4 h-4" />
            Approve & Sign Off Cut
          </button>
        </div>
      </div>

      {/* Main Review Studio Workspace: Video Player + Comments Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8 Cols: Video Player & Timeline */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-charcoal-200/90 shadow-sm space-y-4">
          
          {/* Version Switcher Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-charcoal-600 uppercase">Version:</span>
              <div className="flex items-center gap-1">
                {(selectedContent?.versions || [{ versionNumber: 1 }]).map((v) => (
                  <button
                    key={v.versionNumber}
                    onClick={() => setSelectedVersionNum(v.versionNumber)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedVersionNum === v.versionNumber
                        ? 'bg-charcoal-900 text-white shadow-sm'
                        : 'bg-sand-50 text-charcoal-600 hover:text-charcoal-900'
                    }`}
                  >
                    Cut v{v.versionNumber}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs font-mono text-charcoal-500">
              Format: <strong className="text-charcoal-900">{selectedContent?.format || 'YOUTUBE_LONG'}</strong>
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

            {/* Big Play Overlay if paused */}
            {!isPlaying && (
              <button
                onClick={handlePlayPause}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-coral-500/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
              >
                <Play className="w-8 h-8 fill-white ml-1" />
              </button>
            )}
          </div>

          {/* Custom Controls Bar */}
          <div className="bg-sand-50 rounded-2xl p-4 border border-charcoal-200/80 space-y-3">
            {/* Timeline Scrub */}
            <div className="relative flex items-center">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-charcoal-200 rounded-lg appearance-none cursor-pointer accent-coral-500"
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayPause}
                  className="p-2 bg-charcoal-900 text-white rounded-xl hover:bg-coral-500 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                <button
                  onClick={() => handleJumpToTimestamp(0)}
                  className="p-2 bg-sand-200 text-charcoal-800 rounded-xl hover:bg-sand-300"
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
                  className="p-2 bg-sand-200 text-charcoal-800 rounded-xl hover:bg-sand-300"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <span className="text-xs font-mono font-bold text-charcoal-800">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-charcoal-500">
                  Pin timestamp: <strong className="text-coral-600 font-bold">{formatTime(currentTime)}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Add Timestamped Comment Box */}
          <form onSubmit={handleAddComment} className="bg-sand-50/80 rounded-2xl p-4 border border-charcoal-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-charcoal-800 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-coral-500" />
                Add Review Feedback at {formatTime(currentTime)}
              </span>

              {/* Category selector */}
              <div className="flex items-center gap-1">
                {(['PACING', 'AUDIO', 'GRAPHIC', 'SCRIPT', 'COLOR'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCommentCategory(cat)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                      commentCategory === cat
                        ? 'bg-coral-500 text-white shadow-sm'
                        : 'bg-white text-charcoal-600 hover:text-charcoal-900 border border-charcoal-200'
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
                className="flex-1 px-4 py-2 bg-white border border-charcoal-200 rounded-xl text-xs focus:ring-2 focus:ring-coral-500 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-charcoal-900 hover:bg-coral-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Post Note
              </button>
            </div>
          </form>

        </div>

        {/* Right 4 Cols: Review Comments Feed */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-charcoal-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-100">
            <div>
              <h3 className="font-bold text-xs uppercase font-mono text-charcoal-800">Timeline Review Notes</h3>
              <p className="text-[10px] text-charcoal-400 font-mono">Click timestamp to jump to frame</p>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-lime-100 text-lime-900 rounded-full">
              {comments.filter(c => c.resolved).length}/{comments.length} resolved
            </span>
          </div>

          <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
            {comments.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-charcoal-200 rounded-2xl text-xs text-charcoal-500 font-mono">
                No review comments yet. Scrub the video and add your thoughts!
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className={`p-4 rounded-2xl border transition-all space-y-2 ${
                    comment.resolved
                      ? 'bg-sand-50/50 border-charcoal-200/60 opacity-60'
                      : 'bg-sand-50 border-charcoal-200/90 hover:border-charcoal-400 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleJumpToTimestamp(comment.timestampSeconds || 0)}
                      className="px-2 py-0.5 bg-charcoal-900 text-lime-400 rounded text-[11px] font-mono font-bold flex items-center gap-1 hover:bg-coral-500 hover:text-white transition-colors"
                    >
                      <Clock className="w-3 h-3" />
                      {formatTime(comment.timestampSeconds || 0)}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono px-2 py-0.5 bg-charcoal-200 text-charcoal-800 rounded font-bold">
                        {comment.category}
                      </span>
                      <button
                        onClick={() => handleToggleResolveComment(comment._id, comment.resolved)}
                        className={`p-1 rounded text-xs transition-colors ${
                          comment.resolved
                            ? 'text-lime-600 hover:text-lime-700'
                            : 'text-charcoal-400 hover:text-lime-600'
                        }`}
                        title={comment.resolved ? 'Mark unresolved' : 'Mark resolved'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-charcoal-900 font-medium leading-relaxed">
                    {comment.text}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-charcoal-400 border-t border-charcoal-200/60">
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
print("Wrote ReviewStudioPage.tsx successfully!")
