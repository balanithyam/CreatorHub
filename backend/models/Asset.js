import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    originalName: { type: String, required: true },
    fileType: {
      type: String,
      
      required: true,
    },
    mimeType: { type: String, default: '' },
    size: { type: Number, default: 0 },
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    tags: { type: [String], default: [] },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    blueprintId: { type: mongoose.Schema.Types.ObjectId, ref: 'ContentBlueprint' },
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content' },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Asset', assetSchema);
