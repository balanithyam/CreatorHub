import mongoose from 'mongoose';

const versionSchema = new mongoose.Schema(
  {
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
    versionNumber: { type: Number, required: true },
    title: { type: String, default: '' },
    notes: { type: String, default: '' },
    mediaUrl: { type: String, required: true },
    mediaType: {
      type: String,
      
      required: true,
    },
    mediaPublicId: { type: String, default: '' },
    durationSeconds: { type: Number, default: 0 },
    fileSize: { type: Number, default: 0 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    checklist: [
      {
        id: String,
        label: String,
        completed: { type: Boolean, default: false },
        completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    isCurrent: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('ContentVersion', versionSchema);
