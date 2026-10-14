import mongoose from 'mongoose';

const researchSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, default: '' },
    sourceName: { type: String, default: 'Web Source' },
    sourceType: {
      type: String,
      default: 'article',
    },
    summary: { type: String, default: '' },
    keyPoints: { type: [String], default: [] },
    discussionInsights: { type: [String], default: [] },
    rawContent: { type: String, default: '' },
    notes: { type: String, default: '' },
    tags: { type: [String], default: [] },
    talkingPoints: { type: [String], default: [] },
    audienceQuotes: { type: [String], default: [] },
    counterarguments: { type: [String], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    attachedIdeaIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }],
    attachedToIdeaIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }],
    sourceRef: { type: mongoose.Schema.Types.ObjectId, ref: 'ExternalSource' },
  },
  { timestamps: true }
);

export default mongoose.model('Research', researchSchema);
