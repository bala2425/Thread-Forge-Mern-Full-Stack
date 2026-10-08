import { useEffect, useMemo, useState } from 'react';
import { ImagePlus, Move, Plus, Type, Upload, X } from 'lucide-react';
import { products as fallbackProducts } from '../data.js';
import { api } from '../api.js';

export default function CustomiseFlow({ cart, updateCart, user }) {
  const [products, setProducts] = useState(fallbackProducts);
  const [template, setTemplate] = useState(fallbackProducts[0]);
  const [designText, setDesignText] = useState('YOUR MARK');
  const [designColor, setDesignColor] = useState('#f2c14e');
  const [designs, setDesigns] = useState([]);
  const [preview, setPreview] = useState({ x: 50, y: 42, scale: 1 });
  const [size, setSize] = useState('M');
  const [color, setColor] = useState(template.colors[0]);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => { api.getProducts().then(result => setProducts(result.products)).catch(() => {}); }, []);
  useEffect(() => { setColor(template.colors?.[0] || 'Black'); setSize(template.sizes?.[0] || 'M'); }, [template]);
  const selectedDesign = useMemo(() => ({ text: designText, color: designColor, x: preview.x, y: preview.y, scale: preview.scale }), [designText, designColor, preview]);

  const addDesign = () => {
    if (!designText.trim()) return setUploadMessage('Enter text before adding the design.');
    setDesigns(current => [...current, { id: Date.now(), ...selectedDesign }]);
    setUploadMessage('Design added to the preview.');
  };

  const uploadImage = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const result = await api.uploadImage(file);
      setDesigns(current => [...current, { id: Date.now(), type: 'image', image: result.url, x: 50, y: 42, scale: 1 }]);
      setUploadMessage('Image uploaded and added to the design.');
    } catch (error) { setUploadMessage(error.message); }
  };

  const addToCart = () => {
    if (!user && !window.localStorage.getItem('threadforge-user')) return setUploadMessage('Sign in before placing an order.');
    updateCart([...cart, { product: template._id, name: `${template.name} custom`, price: template.price, image: template.images[0], quantity: 1, size, color, custom: { designs, selectedDesign } }]);
    setUploadMessage('Custom design added to your cart.');
  };

  return <div className="customiser-page"><section className="customiser-heading"><span className="eyebrow">Design studio</span><h1>Make it <em>your own.</em></h1><p>Choose a base, add your artwork, then preview the result before ordering.</p></section><div className="customiser-grid"><aside className="design-tools"><h3>1. Choose a shirt</h3><div className="template-list">{products.map(item => <button key={item._id} className={template._id === item._id ? 'active' : ''} onClick={() => setTemplate(item)}><img src={item.images[0]} alt={item.name} /><span>{item.name}</span></button>)}</div><h3>2. Add artwork</h3><div className="tool-grid"><label><Type /> Text<input type="file" hidden onClick={() => document.getElementById('design-text')?.focus()} /></label><label><ImagePlus /> Image<input type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={uploadImage} /></label><label><Upload /> Upload<input type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={uploadImage} /></label></div><textarea id="design-text" value={designText} maxLength="40" onChange={event => setDesignText(event.target.value)} /><input type="color" value={designColor} onChange={event => setDesignColor(event.target.value)} /><div className="option-group"><label>Size</label><div className="size-options">{template.sizes?.map(option => <button key={option} className={size === option ? 'active' : ''} onClick={() => setSize(option)}>{option}</button>)}</div></div><button className="button dark" onClick={addDesign}><Plus size={17} /> Add design</button>{designs.map(item => <div className="design-chip" key={item.id}><span>{item.type === 'image' ? 'Uploaded artwork' : item.text}</span><button onClick={() => setDesigns(current => current.filter(design => design.id !== item.id))}><X size={15} /></button></div>)}{uploadMessage && <p className="form-message">{uploadMessage}</p>}</aside><main className="design-canvas"><div className="canvas-toolbar"><span><Move size={16} /> Position and scale controls</span><span>Live preview</span></div><div className="shirt-canvas"><img src={template.images[0]} alt={`${template.name} preview`} /><div className="design-overlay" style={{ left: `${preview.x}%`, top: `${preview.y}%`, transform: `translate(-50%, -50%) scale(${preview.scale})`, color: designColor }}>{designText}</div>{designs.filter(item => item.type === 'image').map(item => <img key={item.id} className="uploaded-design" src={item.image} alt="Custom artwork" style={{ left: `${item.x}%`, top: `${item.y}%`, transform: `translate(-50%, -50%) scale(${item.scale})` }} />)}</div><div className="canvas-controls"><label>Position X <input type="range" min="25" max="75" value={preview.x} onChange={event => setPreview({ ...preview, x: Number(event.target.value) })} /></label><label>Position Y <input type="range" min="20" max="65" value={preview.y} onChange={event => setPreview({ ...preview, y: Number(event.target.value) })} /></label><label>Scale <input type="range" min="0.6" max="2.5" step="0.1" value={preview.scale} onChange={event => setPreview({ ...preview, scale: Number(event.target.value) })} /></label></div><div className="custom-summary"><h3>Custom order</h3><p>{template.name} · {size} · {color}</p><strong>£{template.price}</strong><button className="button primary" onClick={addToCart}>Add custom design to cart</button></div></main></div></div>;
}
