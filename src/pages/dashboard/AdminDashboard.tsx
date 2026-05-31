import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useStore } from '../../hooks/useStore';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';

const AdminDashboard = () => {
  const { products, orders, getSalesReport } = useStore();
  const { user } = useAuth();
  const reports = getSalesReport();

  // Mock data for charts
  const salesData = [
    { name: 'Mon', sales: 4000, profit: 2400 },
    { name: 'Tue', sales: 3000, profit: 1398 },
    { name: 'Wed', sales: 2000, profit: 9800 },
    { name: 'Thu', sales: 2780, profit: 3908 },
    { name: 'Fri', sales: 1890, profit: 4800 },
    { name: 'Sat', sales: 2390, profit: 3800 },
    { name: 'Sun', sales: 3490, profit: 4300 },
  ];

  const categoryData = [
    { name: 'Running', value: 400 },
    { name: 'Formal', value: 300 },
    { name: 'Sport', value: 300 },
    { name: 'Casual', value: 200 },
  ];

  const COLORS = ['#000000', '#6366f1', '#f59e0b', '#10b981'];

  const stats = [
    {
      title: 'Total Revenue',
      value: `KES ${reports.totalSales.toLocaleString()}`,
      icon: DollarSign,
      trend: '+12.5%',
      trendUp: true,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Total Profit',
      value: `KES ${reports.totalProfit.toLocaleString()}`,
      icon: TrendingUp,
      trend: '+8.2%',
      trendUp: true,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Total Orders',
      value: reports.totalOrders.toString(),
      icon: ShoppingCart,
      trend: '+24.1%',
      trendUp: true,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Stock Items',
      value: products.length.toString(),
      icon: Package,
      trend: '-2',
      trendUp: false,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500">Welcome back, {user?.name}. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full">Download Report</Button>
          <Button className="bg-black text-white rounded-full">Create New Order</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div className={`flex items-center text-xs font-bold ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trendUp ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Revenue & Profit Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="sales" fill="#000000" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Categories & Alerts */}
        <div className="space-y-8">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Sales by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Low Stock Alerts */}
          <Card className="border-none shadow-sm bg-orange-50 border-orange-100">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-orange-700">
                <AlertTriangle size={20} />
                <CardTitle className="text-lg font-bold">Stock Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.filter(p => p.stockQuantity <= p.lowStockThreshold).map(product => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{product.name}</p>
                      <p className="text-xs text-orange-600 font-medium">{product.stockQuantity} items left</p>
                    </div>
                    <Button size="sm" variant="outline" className="h-8 border-orange-200 text-orange-700 hover:bg-orange-100">
                      Restock
                    </Button>
                  </div>
                ))}
                {reports.lowStockCount === 0 && (
                  <p className="text-sm text-slate-500 italic py-2 text-center">All stock levels are healthy</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Orders Table */}
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
          <Button variant="ghost" size="sm" className="text-slate-500">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-100">
                  <th className="pb-4 font-bold text-slate-400 text-xs uppercase">Order ID</th>
                  <th className="pb-4 font-bold text-slate-400 text-xs uppercase">Customer</th>
                  <th className="pb-4 font-bold text-slate-400 text-xs uppercase">Products</th>
                  <th className="pb-4 font-bold text-slate-400 text-xs uppercase">Amount</th>
                  <th className="pb-4 font-bold text-slate-400 text-xs uppercase">Status</th>
                  <th className="pb-4 font-bold text-slate-400 text-xs uppercase text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 text-sm font-bold text-slate-900">#{order.id.slice(-6)}</td>
                    <td className="py-4 text-sm text-slate-600">{order.customerName}</td>
                    <td className="py-4 text-sm text-slate-600">{order.items.length} items</td>
                    <td className="py-4 text-sm font-bold text-black">KES {order.totalAmount.toLocaleString()}</td>
                    <td className="py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                        order.status === 'pending' ? 'bg-orange-100 text-orange-700' : 
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-slate-500 text-right flex items-center justify-end gap-1">
                      <Clock size={14} />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 italic">No orders recorded yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;