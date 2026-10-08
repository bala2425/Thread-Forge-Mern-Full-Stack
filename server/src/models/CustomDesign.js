import mongoose from 'mongoose';

const customDesignSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['text', 'image', 'logo'], required: true },
  content: { type: mongoose.Schema.Types.Mixed },
  preview: String,
  active: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  position: { x: Number, y: Number },
  scale: { type: Number, default: 1 }
}, { timestamps: true });

export default mongoose.model('CustomDesign', customDesignSchema);
