import React, { useState } from 'react';
import { useStore } from '../../hooks/useStore';
import { 
  Search, 
  Filter, 
  Eye, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Printer,
  ShoppingBag,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Order, OrderStatus } from '../../types';
import { toast } from 'sonner';

const OrdersPage = () => {
  const { orders, updateOrder } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusUpdate = (order: Order, status: OrderStatus) => {
    updateOrder({ ...order, status, updatedAt: new Date().toISOString() });
    toast.success(`Order status updated to ${status}`);
    if (selectedOrder?.id === order.id) {
      setSelectedOrder({ ...order, status, updatedAt: new Date().toISOString() });
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'picked_up': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'reserved': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handlePrintReceipt = (order: Order) => {
    // In a real app, this would generate a PDF. For now, we'll simulate it with a print-friendly view
    window.print();
  };

  const handleWhatsAppNotify = (order: Order) => {
    const message = `Hello ${order.customerName}, this is Prime Kicks. Your order #${order.id.slice(-6)} status is now: ${order.status.toUpperCase()}. Thank you for shopping with us!`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${order.customerPhone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Order Management</h2>
          <p className="text-slate-500">Track and process customer orders</p>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Search by customer or order ID..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter size={18} /> Filter Status
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 font-bold text-slate-400 text-xs uppercase">Order Info</th>
                <th className="px-6 py-4 font-bold text-slate-400 text-xs uppercase">Customer</th>
                <th className="px-6 py-4 font-bold text-slate-400 text-xs uppercase text-right">Amount</th>
                <th className="px-6 py-4 font-bold text-slate-400 text-xs uppercase">Payment</th>
                <th className="px-6 py-4 font-bold text-slate-400 text-xs uppercase">Status</th>
                <th className="px-6 py-4 font-bold text-slate-400 text-xs uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 text-sm">#{order.id.slice(-6)}</p>
                    <p className="text-[10px] text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{order.customerName}</p>
                    <p className="text-xs text-slate-500">{order.customerPhone}</p>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-black">
                    KES {order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="capitalize text-[10px]">
                      {order.paymentMethod} • {order.deliveryType}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => { setSelectedOrder(order); setIsDetailsOpen(true); }}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-green-600"
                        onClick={() => handleWhatsAppNotify(order)}
                      >
                        <MessageCircle size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-400 italic">
                    <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
                <div>
                  <DialogTitle className="text-2xl font-extrabold">Order #{selectedOrder.id.slice(-6)}</DialogTitle>
                  <p className="text-sm text-slate-500">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                <div>
                  <h4 className="font-bold text-slate-900 mb-4 border-l-4 border-black pl-3">Customer Information</h4>
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl">
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-sm">Name:</span>
                      <span className="font-medium text-slate-900">{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-sm">Phone:</span>
                      <span className="font-medium text-slate-900">{selectedOrder.customerPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-sm">Payment:</span>
                      <span className="font-medium text-slate-900 uppercase">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-sm">Delivery:</span>
                      <span className="font-medium text-slate-900 capitalize">{selectedOrder.deliveryType}</span>
                    </div>
                    {selectedOrder.deliveryAddress && (
                      <div className="pt-2 border-t">
                        <span className="text-slate-500 text-sm block mb-1">Address:</span>
                        <span className="text-slate-900 text-sm">{selectedOrder.deliveryAddress}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-4 border-l-4 border-black pl-3">Order Items</h4>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white border p-3 rounded-xl shadow-sm">
                        <div className="flex gap-3 items-center">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-xs">
                            {item.productName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{item.productName}</p>
                            <p className="text-xs text-slate-500">Size: {item.size} • Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-bold text-black text-sm">KES {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-dashed flex justify-between items-center">
                      <span className="font-bold text-slate-900">Total Amount:</span>
                      <span className="text-xl font-extrabold text-black">KES {selectedOrder.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-6 border-t">
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white flex-1"
                  onClick={() => handleStatusUpdate(selectedOrder, 'delivered')}
                  disabled={selectedOrder.status === 'delivered'}
                >
                  <CheckCircle2 size={18} className="mr-2" /> Mark Delivered
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handlePrintReceipt(selectedOrder)}
                >
                  <Printer size={18} className="mr-2" /> Print Receipt
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-red-600 hover:bg-red-50 flex-1"
                  onClick={() => handleStatusUpdate(selectedOrder, 'cancelled')}
                  disabled={selectedOrder.status === 'cancelled' || selectedOrder.status === 'delivered'}
                >
                  <XCircle size={18} className="mr-2" /> Cancel Order
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Simple Card wrapper since I'm using it but didn't import from a pre-made local component
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-3xl border ${className}`}>{children}</div>
);
const CardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);
const CardHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-6 pb-0 ${className}`}>{children}</div>
);
const CardTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <h3 className={`font-bold ${className}`}>{children}</h3>
);

export default OrdersPage;