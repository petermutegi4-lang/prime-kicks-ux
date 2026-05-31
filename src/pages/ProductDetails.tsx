import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Truck, 
  ShieldCheck, 
  Clock, 
  Check,
  MessageCircle,
  Plus,
  Minus,
  Star
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useStore } from '../hooks/useStore';
import { Product } from '../types';
import Navbar from '../components/layout/Navbar';
import { toast } from 'sonner';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      const found = products.find(p => p.id === id);
      if (found) {
        setProduct(found);
      }
    }
  }, [id, products]);

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
    // In a real app, we'd add to a cart state
    toast.success(`${product.name} added to cart!`);
    navigate('/cart');
  };

  const handleOrderWhatsApp = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    const message = `Hello Prime Kicks, I want to order: ${product.name} (Size: ${selectedSize}, Qty: ${quantity}). Product URL: ${window.location.href}`;
    window.open(`https://wa.me/254700123456?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-slate-100 border">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-slate-100 border cursor-pointer hover:border-black transition-colors">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-8">
              <Badge className="bg-orange-100 text-orange-600 border-none mb-4 px-3 py-1 uppercase tracking-wider text-[10px] font-bold">
                {product.category}
              </Badge>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{product.name}</h1>
              <p className="text-lg text-slate-500 font-medium mb-4">{product.brand}</p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex text-orange-400">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={18} fill="currentColor" />)}
                </div>
                <span className="text-sm text-slate-500">(4.8 • 120 reviews)</span>
              </div>

              <div className="text-3xl font-extrabold text-black">
                KES {product.sellingPrice.toLocaleString()}
              </div>
            </div>

            <div className="space-y-8 mb-10">
              {/* Sizes */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900">Select Size</h3>
                  <button className="text-sm text-slate-500 underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-bold transition-all ${
                        selectedSize === size 
                          ? 'border-black bg-black text-white' 
                          : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">Quantity</h3>
                <div className="flex items-center w-32 border-2 border-slate-100 rounded-2xl p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-xl"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="flex-1 text-center font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-xl"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
              <Button 
                onClick={handleAddToCart}
                className="h-16 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-3"
              >
                <ShoppingCart size={20} /> Add to Cart
              </Button>
              <Button 
                onClick={handleOrderWhatsApp}
                className="h-16 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3"
              >
                <MessageCircle size={20} /> Order via WhatsApp
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t">
              <div className="text-center">
                <div className="w-10 h-10 bg-slate-50 text-slate-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Truck size={18} />
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Fast Delivery</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-slate-50 text-slate-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck size={18} />
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Authentic</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-slate-50 text-slate-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock size={18} />
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-20 max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Product Description</h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            {product.description}
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 text-slate-700">
              <div className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center">
                <Check size={12} />
              </div>
              <span>Premium quality materials for long-lasting wear</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <div className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center">
                <Check size={12} />
              </div>
              <span>Ergonomic design for maximum comfort</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <div className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center">
                <Check size={12} />
              </div>
              <span>Available in multiple colors and sizes</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;