import mongoose from 'mongoose';

const externalSourceSchema = new mongoose.Schema(
  {
    sourceId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    platform: {
      type: String,
      
      required: true,
    },
    summary: { type: String, default: '' },
    author: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    publishedAt: { type: Date, default: Date.now },
    metrics: {
      upvotes: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
      commentsCount: { type: Number, default: 0 },
      sentimentScore: { type: Number, default: 0 },
    },
    topicTags: { type: [String], default: [] },
    isSaved: { type: Boolean, default: false },
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isIgnored: { type: Boolean, default: false },
    ignoredBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model('ExternalSource', externalSourceSchema);
