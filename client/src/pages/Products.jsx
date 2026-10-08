import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { products as fallback } from '../data.js';
import { api } from '../api.js';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(fallback);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try { const result = await api.getProducts({ search: searchParams.get('search'), category: searchParams.get('category') }); setProducts(result.products); }
      catch { setProducts(fallback.filter(p => !searchParams.get('search') || p.name.toLowerCase().includes(searchParams.get('search').toLowerCase()))); }
    };
    load();
  }, [searchParams]);

  const update = key => event => setSearchParams({ ...Object.fromEntries(searchParams), [key]: event.target.value });
  return <div className="catalog-page"><section className="catalog-hero"><span className="eyebrow">The collection</span><h1>Made for <em>every story.</em></h1><p>Explore modern essentials designed to look and feel like you.</p></section><div className="catalog-layout"><aside className={filtersOpen ? 'filters open' : 'filters'}><h3><SlidersHorizontal size={18} /> Filters</h3><label>Category<select onChange={update('category')}><option value="">All</option><option value="T-Shirts">T-Shirts</option><option value="Graphic">Graphic</option><option value="Color">Color</option></select></label><label>Price<input type="range" min="20" max="50" defaultValue="50" /></label><button className="button dark" onClick={() => setSearchParams({})}>Clear filters</button></aside><div><div className="catalog-toolbar"><span>{products.length} products</span><form onSubmit={e => { e.preventDefault(); setSearchParams({ ...Object.fromEntries(searchParams), search: document.querySelector('#catalog-search').value }); }}><Search size={17} /><input id="catalog-search" defaultValue={searchParams.get('search') || ''} placeholder="Search products" /></form><button className="filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)}>Filters</button></div><div className="product-grid catalog-grid">{products.map(product => <ProductCard key={product._id} product={product} />)}</div></div></div></div>;
}

function ProductCard({ product }) { return <article className="product-card"><Link to={`/products/${product._id}`}><div className="product-image"><img src={product.images[0]} alt={product.name} /><span className="product-badge">{product.featured ? 'BESTSELLER' : 'NEW'}</span></div><div className="product-info"><div><span>{product.category}</span><h3>{product.name}</h3></div><strong>£{product.price}</strong></div></Link></article>; }
