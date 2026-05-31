import React from 'react';
import { useStore } from '../hooks/useStore';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Package, MapPin, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const CustomerOrders = () => {
  const { orders } = useStore();
  const { user } = useAuth();

  const myOrders = orders.filter(o => o.customerId === user?.id || (o.customerPhone === user?.phone && user?.phone));

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900">My Orders</h1>
          <p className="text-slate-500">Track and manage your recent purchases</p>
        </div>

        <div className="space-y-6">
          {myOrders.length > 0 ? (
            myOrders.reverse().map((order) => (
              <div key={order.id} className="bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order ID</p>
                      <p className="font-extrabold text-slate-900 text-lg">#{order.id.slice(-6)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                      <p className="font-medium text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
                      <p className="font-extrabold text-black">KES {order.totalAmount.toLocaleString()}</p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase border ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700 border-green-200' : 
                      order.status === 'pending' ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                      'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {order.status}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-4 border-t first:border-0 border-slate-50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900 font-bold">
                            <Package size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{item.productName}</p>
                            <p className="text-xs text-slate-500">Size: {item.size} • Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-bold text-slate-900">KES {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500 flex-1">
                      <MapPin size={14} />
                      <span className="capitalize">{order.deliveryType}: {order.deliveryAddress || 'Store Pickup'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Smartphone size={14} />
                      <span className="uppercase">{order.paymentMethod} Payment</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed">
              <ShoppingBag size={48} className="mx-auto text-slate-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-900">No orders yet</h3>
              <p className="text-slate-500 mt-2 mb-8">When you buy shoes, they will appear here.</p>
              <Link to="/">
                <button className="bg-black text-white px-8 py-3 rounded-full font-bold">Start Shopping</button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerOrders;