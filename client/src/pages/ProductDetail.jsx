import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, Heart, Minus, Plus, ShoppingBag } from 'lucide-react';
import { products } from '../data.js';
import { api } from '../api.js';

export default function ProductDetail({ cart, updateCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(products.find(p => p._id === id) || products[0]);
  const [size, setSize] = useState('M');
  const [color, setColor] = useState(product.colors?.[0] || 'Black');
  const [quantity, setQuantity] = useState(1);
  useEffect(() => { const load = async () => { try { setProduct(await api.getProduct(id)); } catch {} }; load(); }, [id]);
  const addToCart = () => { const next = [...cart, { product: product._id, name: product.name, price: product.price, image: product.images[0], quantity, size, color }]; updateCart(next); };
  return <div className="product-detail"><div className="detail-image"><img src={product.images[0]} alt={product.name} /><button className="wish"><Heart size={20} /></button></div><div className="detail-copy"><span className="eyebrow">{product.category}</span><h1>{product.name}</h1><div className="rating"><span>★★★★★</span> 4.9 · 128 reviews</div><div className="price-row"><strong>£{product.price}</strong>{product.compareAtPrice && <del>£{product.compareAtPrice}</del>}</div><p>{product.description}</p><div className="option-group"><label>Colour</label><div className="swatches">{product.colors?.map(c => <button key={c} className={color === c ? 'active' : ''} onClick={() => setColor(c)} title={c}><span style={{ background: c.toLowerCase() }} /></button>)}</div></div><div className="option-group"><label>Size</label><div className="size-options">{product.sizes?.map(s => <button key={s} className={size === s ? 'active' : ''} onClick={() => setSize(s)}>{s}</button>)}</div></div><div className="purchase-row"><div className="quantity"><button onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus size={15} /></button><span>{quantity}</span><button onClick={() => setQuantity(q => q + 1)}><Plus size={15} /></button></div><button className="button primary add-cart" onClick={addToCart}><ShoppingBag size={18} /> Add to cart</button></div><Link className="button secondary full" to="/customise">Customise this shirt</Link><ul className="feature-list"><li><Check size={16} /> Premium cotton blend</li><li><Check size={16} /> Easy 30-day returns</li><li><Check size={16} /> Full design preview</li></ul></div></div>;
}
