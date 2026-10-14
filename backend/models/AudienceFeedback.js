import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    platform: { type: String, default: 'youtube' },
    authorName: { type: String, required: true },
    authorAvatar: { type: String, default: '' },
    content: { type: String, required: true },
    sentiment: { type: String, default: 'question' },
    isQuestion: { type: Boolean, default: false },
    isContentRequest: { type: Boolean, default: false },
    sourceUrl: { type: String, default: '' },
    upvotes: { type: Number, default: 0 },
    extractedTopic: { type: String, default: '' },
    convertedToIdea: { type: Boolean, default: false },
    convertedIdeaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea', default: null },
    convertedToIdeaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea', default: null },
    status: { type: String, default: 'new' },
  },
  { timestamps: true }
);

export default mongoose.model('AudienceFeedback', feedbackSchema);
