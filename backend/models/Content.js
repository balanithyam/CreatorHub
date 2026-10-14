import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    blueprintId: { type: mongoose.Schema.Types.ObjectId, ref: 'ContentBlueprint' },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    producerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    platform: {
      type: String,
      
      default: 'youtube',
    },
    format: {
      type: String,
      
      default: 'video',
    },
    currentVersionNumber: { type: Number, default: 1 },
    status: {
      type: String,
      
      default: 'in_production',
    },
    parentContentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', default: null },
    derivativeType: {
      type: String,
      
      default: 'original',
    },
    reuseNotes: { type: String, default: '' },
    reusableSections: [
      {
        title: String,
        content: String,
        originalAssetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' },
        timestampRange: String,
      },
    ],
    tags: { type: [String], default: [] },
    publishedUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Content', contentSchema);
