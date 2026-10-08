import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/Product.js';

const products = [
  { name: 'Classic Cotton Tee', slug: 'classic-cotton-tee', category: 'T-Shirts', description: 'Breathable premium cotton tee with a relaxed everyday fit.', price: 24, compareAtPrice: 29, colors: ['White', 'Black', 'Navy'], sizes: ['S', 'M', 'L', 'XL'], stock: 30, featured: true, images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85'], tags: ['cotton', 'classic'], status: 'active' },
  { name: 'CHALK Oversized Tee', slug: 'chalk-oversized-tee', category: 'T-Shirts', description: 'Soft oversized tee with a modern drop-shoulder silhouette.', price: 32, colors: ['Black', 'Stone'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], stock: 24, featured: true, images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=85'], tags: ['oversized', 'modern'], status: 'active' },
  { name: 'Midnight Graphic Tee', slug: 'midnight-graphic-tee', category: 'Graphic', description: 'Premium graphic tee designed for expressive, comfortable wear.', price: 38, colors: ['Black', 'Charcoal'], sizes: ['M', 'L', 'XL'], stock: 18, featured: true, images: ['https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=85'], tags: ['graphic', 'limited'], status: 'active' },
  { name: 'Sunset Color Tee', slug: 'sunset-color-tee', category: 'Color', description: 'Vibrant color-block tee made for bright everyday styling.', price: 29, colors: ['Terracotta', 'Cream'], sizes: ['S', 'M', 'L', 'XL'], stock: 22, featured: false, images: ['https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=85'], tags: ['color', 'summer'], status: 'active' }
];

await mongoose.connect(process.env.MONGODB_URI);
for (const product of products) {
  await Product.findOneAndUpdate({ slug: product.slug }, product, { upsert: true, new: true });
}
console.log(`Seeded ${products.length} products.`);
mongoose.disconnect();
