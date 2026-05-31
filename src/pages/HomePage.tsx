import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Smartphone, 
  Truck, 
  Search,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useStore } from '../hooks/useStore';
import Navbar from '../components/layout/Navbar';
import { Product } from '../types';

const HomePage = () => {
  const { products } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', 'Running', 'Formal', 'Sport', 'Casual'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-32">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/56fbb33b-5c09-48cd-95e7-d262601f33d2/shoe4-9ead48dd-1780218243098.webp" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-orange-500 font-bold tracking-widest text-sm mb-4">NEW COLLECTION 2025</h2>
            <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight">
              STEP INTO <br />
              <span className="text-orange-500">PRIME</span> EXCELLENCE
            </h1>
            <p className="text-lg text-slate-300 mb-10 max-w-lg">
              Discover the ultimate fusion of comfort, style, and performance. Premium kicks for the modern trendsetter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-black hover:bg-slate-100 px-8 rounded-full font-bold">
                SHOP NOW
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 rounded-full font-bold">
                VIEW COLLECTIONS
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                <Truck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Fast Delivery</h4>
                <p className="text-xs text-slate-500">Countrywide delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Secure Payments</h4>
                <p className="text-xs text-slate-500">M-Pesa & Cash on delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
                <Smartphone size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">App Tracking</h4>
                <p className="text-xs text-slate-500">Track your order</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                <TrendingUp size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Prime Quality</h4>
                <p className="text-xs text-slate-500">100% Original shoes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">Featured Products</h2>
              <p className="text-slate-500">Pick your favorite kicks from our latest arrivals</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search shoes..."
                  className="pl-10 pr-4 py-2 bg-white border rounded-full w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-black"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex bg-white border rounded-full p-1 overflow-x-auto">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-1 text-sm rounded-full transition-colors whitespace-nowrap ${
                      category === cat ? 'bg-black text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className="group bg-white rounded-3xl overflow-hidden border hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-square relative overflow-hidden bg-slate-100">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.stockQuantity <= product.lowStockThreshold && (
                    <span className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                      LIMITED STOCK
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button className="bg-white text-black hover:bg-slate-100 rounded-full font-bold">
                      View Details
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">{product.brand}</p>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-extrabold text-black">KES {product.sellingPrice.toLocaleString()}</span>
                    <div className="flex gap-1">
                      {product.sizes.slice(0, 3).map(s => (
                        <span key={s} className="text-[10px] bg-slate-100 px-2 py-1 rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed">
              <Search size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-900">No shoes found</h3>
              <p className="text-slate-500">Try adjusting your search or filters</p>
              <Button 
                variant="outline" 
                className="mt-6 rounded-full"
                onClick={() => { setSearchTerm(''); setCategory('All'); }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-black font-bold text-xl italic">P</div>
                <span className="text-2xl font-bold tracking-tight">PRIME KICKS</span>
              </div>
              <p className="text-slate-400 mb-8 max-w-md">
                Prime Kicks is your number one destination for premium footwear. We provide authentic, high-quality shoes for every occasion, from high-performance athletic gear to elegant formal wear.
              </p>
              <div className="flex gap-4">
                {/* Social icons would go here */}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Shop</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Register</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg">Contact Us</h4>
              <ul className="space-y-4 text-slate-400">
                <li>Nairobi, Kenya</li>
                <li>+254 700 123 456</li>
                <li>info@primekicks.com</li>
                <li>WhatsApp Support Available</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-20 pt-8 text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Prime Kicks. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;