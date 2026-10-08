import { ArrowRight, CheckCircle2, Palette, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../data.js';

export default function Home() {
  return <>
    <section className="hero">
      <div className="hero-copy"><span className="eyebrow"><Sparkles size={15} /> Your story. Worn.</span><h1>Wear your <em>ideas.</em></h1><p>Design a t-shirt that is unmistakably yours. Premium fabrics, effortless customisation and delivery made simple.</p><div className="hero-actions"><Link className="button primary" to="/products">Shop collection <ArrowRight size={18} /></Link><Link className="text-link" to="/customise">Start designing</Link></div><div className="trust-row"><span><CheckCircle2 size={16} /> Secure checkout</span><span><CheckCircle2 size={16} /> Easy returns</span></div></div>
      <div className="hero-visual"><div className="hero-card"><img src={products[0].images[0]} alt="Customised t-shirt" /><div className="floating-label"><Palette size={17} /> Design Studio</div></div></div>
    </section>
    <section className="section featured-section"><div className="section-heading"><div><span className="eyebrow">Made to be yours</span><h2>Fresh from the studio</h2></div><Link className="text-link" to="/products">View all <ArrowRight size={16} /></Link></div><div className="product-grid">{products.map(product => <ProductCard key={product._id} product={product} />)}</div></section>
    <section className="custom-banner"><div><span className="eyebrow">The customiser</span><h2>Design it in <em>minutes.</em></h2><p>Choose a shirt, add text or artwork, tune every detail and preview your creation before you add it to your cart.</p><Link className="button light" to="/customise">Open customiser <ArrowRight size={18} /></Link></div><div className="design-preview"><div className="shirt-shape"><span>YOUR<br />MARK</span></div><div className="preview-controls"><span>Position</span><span>Scale</span><span>Colour</span></div></div></section>
    <section className="benefits"><article><span><Star /></span><h3>Premium quality</h3><p>High-grade fabrics selected for softness and durability.</p></article><article><span><Palette /></span><h3>Design your way</h3><p>Preview every detail before you order.</p></article><article><span><ShieldCheck /></span><h3>Secure payments</h3><p>Protected checkout and simple order tracking.</p></article></section>
  </>;
}

function ProductCard({ product }) {
  return <article className="product-card"><Link to={`/products/${product._id}`}><div className="product-image"><img src={product.images[0]} alt={product.name} /><span className="product-badge">NEW</span></div><div className="product-info"><div><span>{product.category}</span><h3>{product.name}</h3></div><strong>£{product.price}</strong></div></Link></article>;
}
