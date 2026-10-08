import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  minOrderValue: { type: Number, default: 0, min: 0 },
  maxUses: { type: Number, min: 1 },
  usedCount: { type: Number, default: 0, min: 0 },
  active: { type: Boolean, default: true },
  expiresAt: Date
}, { timestamps: true });

export default mongoose.model('Coupon', couponSchema);
