import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Truck, 
  MapPin,
  ShoppingBag,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { useStore } from '../hooks/useStore';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import { toast } from 'sonner';

const CartPage = () => {
  const navigate = useNavigate();
  const { addOrder, products } = useStore();
  const { user } = useAuth();
  
  // Mock cart items since we're simulating
  const [cartItems, setCartItems] = useState([
    {
      productId: 'p1',
      productName: 'Air Max Pro',
      quantity: 1,
      price: 12000,
      size: '42'
    }
  ]);

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'cash'>('mpesa');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryType === 'delivery' ? 500 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (deliveryType === 'delivery' && !address) {
      toast.error('Please enter delivery address');
      return;
    }
    if (!phone) {
      toast.error('Please enter phone number');
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const order = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        customerId: user?.id,
        customerName: user?.name || 'Guest Customer',
        customerPhone: phone,
        items: cartItems,
        totalAmount: total,
        status: 'pending' as const,
        paymentMethod,
        deliveryType,
        deliveryAddress: address,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      addOrder(order);
      setIsProcessing(false);
      setIsSuccess(true);
      toast.success('Order placed successfully!');
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Order Confirmed!</h1>
          <p className="text-slate-500 mb-10 text-lg">
            Thank you for shopping with Prime Kicks. Your order has been placed and our team will contact you shortly for delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/')} className="bg-black text-white px-8 rounded-2xl h-14">
              Continue Shopping
            </Button>
            <Button variant="outline" onClick={() => navigate('/my-orders')} className="px-8 rounded-2xl h-14">
              View My Orders
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-12 flex items-center gap-4">
          <ShoppingBag size={32} /> Your Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border p-6">
              {cartItems.length > 0 ? (
                <div className="space-y-8">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-6 pb-8 border-b last:border-0 last:pb-0">
                      <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden border">
                        <img 
                          src={products.find(p => p.id === item.productId)?.images[0]} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-slate-900">{item.productName}</h3>
                          <button 
                            onClick={() => setCartItems([])}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="text-slate-500 text-sm mb-4">Size: {item.size} • Qty: {item.quantity}</p>
                        <div className="flex justify-between items-center">
                          <p className="font-extrabold text-black">KES {item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBag size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-500">Your cart is empty</p>
                  <Button onClick={() => navigate('/')} variant="link">Go shopping</Button>
                </div>
              )}
            </div>

            {/* Delivery & Payment Details */}
            <div className="bg-white rounded-3xl border p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-8 border-l-4 border-black pl-4">Delivery & Payment</h2>
              <form onSubmit={handleCheckout} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label className="text-slate-900 font-bold">Delivery Option</Label>
                      <RadioGroup value={deliveryType} onValueChange={(v: any) => setDeliveryType(v)} className="grid grid-cols-2 gap-4">
                        <div className={`flex items-center space-x-2 border-2 rounded-2xl p-4 cursor-pointer transition-all ${deliveryType === 'delivery' ? 'border-black bg-slate-50' : 'border-slate-100'}`}>
                          <RadioGroupItem value="delivery" id="delivery" />
                          <Label htmlFor="delivery" className="flex items-center gap-2 cursor-pointer">
                            <Truck size={18} /> Home Delivery
                          </Label>
                        </div>
                        <div className={`flex items-center space-x-2 border-2 rounded-2xl p-4 cursor-pointer transition-all ${deliveryType === 'pickup' ? 'border-black bg-slate-50' : 'border-slate-100'}`}>
                          <RadioGroupItem value="pickup" id="pickup" />
                          <Label htmlFor="pickup" className="flex items-center gap-2 cursor-pointer">
                            <MapPin size={18} /> Store Pickup
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (M-Pesa)</Label>
                      <Input 
                        id="phone" 
                        placeholder="0700 123 456" 
                        className="h-12 rounded-xl"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label className="text-slate-900 font-bold">Payment Method</Label>
                      <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)} className="grid grid-cols-2 gap-4">
                        <div className={`flex items-center space-x-2 border-2 rounded-2xl p-4 cursor-pointer transition-all ${paymentMethod === 'mpesa' ? 'border-black bg-slate-50' : 'border-slate-100'}`}>
                          <RadioGroupItem value="mpesa" id="mpesa" />
                          <Label htmlFor="mpesa" className="flex items-center gap-2 cursor-pointer">
                            <Smartphone size={18} /> M-Pesa
                          </Label>
                        </div>
                        <div className={`flex items-center space-x-2 border-2 rounded-2xl p-4 cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-black bg-slate-50' : 'border-slate-100'}`}>
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                            <CreditCard size={18} /> Cash
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {deliveryType === 'delivery' && (
                      <div className="space-y-2">
                        <Label htmlFor="address">Delivery Address</Label>
                        <Input 
                          id="address" 
                          placeholder="Apartment, Street, City" 
                          className="h-12 rounded-xl"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 text-white rounded-3xl p-8 sticky top-24 shadow-xl">
              <h2 className="text-xl font-bold mb-8">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Delivery Fee</span>
                  <span>KES {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-extrabold text-orange-500">KES {total.toLocaleString()}</span>
                </div>
              </div>

              <Button 
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || isProcessing}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl h-16 font-bold text-lg"
              >
                {isProcessing ? 'Processing...' : `Place Order (KES ${total.toLocaleString()})`}
              </Button>
              
              <p className="mt-6 text-[10px] text-slate-500 text-center uppercase tracking-widest">
                Secure SSL Encrypted Checkout
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;