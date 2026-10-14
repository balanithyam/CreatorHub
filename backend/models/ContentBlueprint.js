import mongoose from 'mongoose';

const blueprintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    hook: { type: String, required: true },
    targetAudience: { type: String, default: '' },
    platform: {
      type: String,
      
      default: 'youtube',
    },
    contentFormat: {
      type: String,
      
      default: 'longform_video',
    },
    tone: { type: String, default: 'Authoritative & Engaging' },
    objective: { type: String, default: '' },
    cta: { type: String, default: '' },
    keywords: { type: [String], default: [] },
    referencesList: [{ title: String, url: String, note: String }],
    productionRequirements: {
      bRollNotes: { type: String, default: '' },
      graphicsNeeded: { type: String, default: '' },
      audioRequirements: { type: String, default: '' },
      estimatedDurationMinutes: { type: Number, default: 10 },
      deadline: { type: Date },
    },
    attachedResearchIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Research' }],
    ideaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedProducerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      
      default: 'draft',
    },
    versionNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('ContentBlueprint', blueprintSchema);
