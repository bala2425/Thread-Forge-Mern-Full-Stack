import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Admin({ user }) {
  const [tab, setTab] = useState('overview');
  const [dashboard, setDashboard] = useState({});
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    api.getDashboard().then(setDashboard).catch(() => {});
    api.getAdminOrders().then(setOrders).catch(() => {});
    api.getAdminCustomers().then(setCustomers).catch(() => {});
    api.getAdminInventory().then(setInventory).catch(() => {});
  }, [user]);

  if (!user || user.role !== 'admin') return <div className="empty-state"><h2>Admin access required</h2><p>Log in with an administrator account to continue.</p></div>;

  return <div className="admin-page">
    <div className="page-title"><span className="eyebrow">Administration</span><h1>Store dashboard</h1></div>
    <div className="admin-tabs">{['overview', 'orders', 'customers', 'inventory'].map(item => <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item}</button>)}</div>
    {tab === 'overview' && <div className="admin-panel"><h2>Sales overview</h2><div className="metric-grid"><div><span>Revenue</span><strong>£{dashboard.revenue || 0}</strong></div><div><span>Orders</span><strong>{dashboard.orders || 0}</strong></div><div><span>Products</span><strong>{dashboard.products || 0}</strong></div><div><span>Customers</span><strong>{dashboard.customers || 0}</strong></div></div><h3>Recent orders</h3><div className="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead><tbody>{dashboard.recentOrders?.map(order => <tr key={order._id}><td>{order._id.slice(-6).toUpperCase()}</td><td>{order.user?.name || 'Customer'}</td><td>£{order.total}</td><td>{order.status}</td></tr>)}</tbody></table></div></div>}
    {tab === 'orders' && <div className="admin-panel"><h2>Orders</h2><div className="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map(order => <tr key={order._id}><td>{order._id.slice(-6).toUpperCase()}</td><td>{order.user?.name || 'Customer'}</td><td>£{order.total}</td><td>{order.status}</td></tr>)}</tbody></table></div></div>}
    {tab === 'customers' && <div className="admin-panel"><h2>Customers</h2><div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>{customers.map(customer => <tr key={customer._id}><td>{customer.name}</td><td>{customer.email}</td><td>{customer.role}</td></tr>)}</tbody></table></div></div>}
    {tab === 'inventory' && <div className="admin-panel"><h2>Inventory</h2><div className="table-wrap"><table><thead><tr><th>Product</th><th>Stock</th><th>Status</th></tr></thead><tbody>{inventory.map(item => <tr key={item._id}><td>{item.name}</td><td>{item.stock}</td><td>{item.status}</td></tr>)}</tbody></table></div></div>}
  </div>;
}
