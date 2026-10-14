import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    actionType: {
      type: String,
      
      required: true,
    },
    entityType: {
      type: String,
      
      required: true,
    },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    entityTitle: { type: String, required: true },
    description: { type: String, required: true },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model('Activity', activitySchema);
