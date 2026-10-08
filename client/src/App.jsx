import { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Customise from './pages/customiseFlow.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/checkoutFlow.jsx';
import Orders from './pages/Orders.jsx';
import Admin from './pages/adminPanel.jsx';
import Profile from './pages/Profile.jsx';
import Auth from './pages/Auth.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('threadforge-user');
    if (saved) setUser(JSON.parse(saved));
    const savedCart = localStorage.getItem('threadforge-cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const updateCart = value => {
    setCart(value);
    localStorage.setItem('threadforge-cart', JSON.stringify(value));
  };

  const logout = () => {
    localStorage.removeItem('threadforge-user');
    localStorage.removeItem('threadforge-token');
    setUser(null); navigate('/');
  };

  const submitSearch = event => {
    event.preventDefault();
    navigate(`/products?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/">THREAD<span>FORGE</span></Link>
        <nav className={menuOpen ? 'main-nav open' : 'main-nav'}>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/products" onClick={() => setMenuOpen(false)}>Shop</NavLink>
          <NavLink to="/customise" onClick={() => setMenuOpen(false)}>Customise</NavLink>
          <NavLink to="/orders" onClick={() => setMenuOpen(false)}>Orders</NavLink>
          {user?.role === 'admin' && <NavLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</NavLink>}
        </nav>
        <div className="header-actions">
          <form className="header-search" onSubmit={submitSearch}><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search" aria-label="Search products" /></form>
          <Link className="icon-button" to={user ? '/account' : '/login'} aria-label="Account"><UserRound size={20} /></Link>
          <Link className="icon-button cart-button" to="/cart" aria-label="Cart"><ShoppingBag size={20} /><span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span></Link>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home cart={cart} updateCart={updateCart} />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail cart={cart} updateCart={updateCart} />} />
          <Route path="/customise" element={<Customise cart={cart} updateCart={updateCart} user={user} />} />
          <Route path="/cart" element={<Cart cart={cart} updateCart={updateCart} />} />
          <Route path="/checkout" element={<Checkout cart={cart} updateCart={updateCart} user={user} setUser={setUser} />} />
          <Route path="/orders" element={<Orders user={user} />} />
          <Route path="/account" element={<Profile user={user} />} />
          <Route path="/admin" element={<Admin user={user} />} />
          <Route path="/login" element={<Auth mode="login" setUser={setUser} />} />
          <Route path="/register" element={<Auth mode="register" setUser={setUser} />} />
          <Route path="/logout" element={<div className="account-page"><h1>Signed out</h1><button className="button dark" onClick={logout}>Return home</button></div>} />
        </Routes>
      </main>
      <footer><div className="brand">THREAD<span>FORGE</span></div><p>Made for people who wear their ideas.</p><p>© 2026 ThreadForge</p></footer>
    </div>
  );
}
