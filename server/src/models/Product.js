import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, min: 0 },
  colors: [{ type: String }],
  sizes: [{ type: String }],
  stock: { type: Number, required: true, min: 0, default: 0 },
  featured: { type: Boolean, default: false },
  images: [{ type: String, required: true }],
  customDesigns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CustomDesign' }],
  tags: [{ type: String }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
