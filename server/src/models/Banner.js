import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  actionLabel: { type: String, default: 'Shop now' },
  actionUrl: { type: String, default: '/products' },
  active: { type: Boolean, default: true },
  position: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Banner', bannerSchema);
