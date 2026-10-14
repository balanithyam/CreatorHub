import mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    summary: { type: String, default: '' },
    stage: {
      type: String,
      
      default: 'inbox',
      index: true,
    },
    tags: { type: [String], default: [] },
    priority: {
      type: String,
      
      default: 'medium',
    },
    targetFormat: {
      type: String,
      
      default: 'video',
    },
    notes: { type: String, default: '' },
    aiRefinements: {
      suggestedAngles: [String],
      targetAudienceInsights: String,
      potentialHooks: [String],
    },
    attachedResearchIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Research' }],
    sourceRef: { type: mongoose.Schema.Types.ObjectId, ref: 'ExternalSource' },
    audienceFeedbackRef: { type: mongoose.Schema.Types.ObjectId, ref: 'AudienceFeedback' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    order: { type: Number, default: 0 },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Idea', ideaSchema);
