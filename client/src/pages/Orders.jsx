import { useEffect, useState } from 'react';
import { PackageCheck, ShoppingBag } from 'lucide-react';
import { api } from '../api.js';

export default function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  useEffect(() => { if (user) api.getOrders().then(setOrders).catch(() => setOrders([])); }, [user]);
  if (!user) return <div className="empty-state"><ShoppingBag /><h2>Sign in to view orders</h2><a className="button primary" href="/login">Log in</a></div>;
  return <div className="orders-page"><div className="page-title"><span className="eyebrow">Your account</span><h1>Order history</h1></div>{orders.length === 0 ? <div className="empty-state"><PackageCheck /><h2>No orders yet</h2><p>Your placed orders will appear here.</p></div> : <div className="orders-list">{orders.map(order => <article key={order._id}><div><span>Order #{order._id.slice(-6).toUpperCase()}</span><h3>{order.items.map(i => i.name).join(', ')}</h3><p>{new Date(order.createdAt).toLocaleDateString()}</p></div><div className="order-status"><strong>£{order.total}</strong><span>{order.status}</span></div></article>)}</div>}</div>;
}
