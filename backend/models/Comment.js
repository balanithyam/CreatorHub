import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
    versionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ContentVersion', required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    commentType: {
      type: String,
      default: 'video_timestamp',
    },
    timestampSec: { type: Number, default: null },
    timestampSeconds: { type: Number, default: null },
    spatialCoord: {
      xPercent: Number,
      yPercent: Number,
      boxWidth: Number,
      boxHeight: Number,
    },
    textSelection: {
      selectedText: String,
      startIndex: Number,
      endIndex: Number,
    },
    body: { type: String, default: '' },
    content: { type: String, default: '' },
    status: { type: String, default: 'open' },
    resolved: { type: Boolean, default: false },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date },
    parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

commentSchema.pre('save', function (next) {
  if (!this.body && this.content) this.body = this.content;
  if (!this.content && this.body) this.content = this.body;
  if (this.timestampSeconds && !this.timestampSec) this.timestampSec = this.timestampSeconds;
  if (this.timestampSec && !this.timestampSeconds) this.timestampSeconds = this.timestampSec;
  next();
});

export default mongoose.model('Comment', commentSchema);
