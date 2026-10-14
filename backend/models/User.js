import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: function () { return !this.googleId; } },
    role: {
      type: String,
      enum: ['ADMIN', 'CREATOR', 'PRODUCER', 'CURATOR', 'EDITOR'],
      default: 'CREATOR',
      required: true,
    },
    googleId: { type: String, default: null },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    bio: { type: String, default: '' },
    apiKey: { type: String, default: null },
    preferences: {
      preferredPlatforms: { type: [String], default: ['youtube', 'tiktok', 'instagram', 'newsletter'] },
      notificationsEnabled: { type: Boolean, default: true },
      theme: { type: String, default: 'studio-light' },
      language: { type: String, default: 'en' },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
