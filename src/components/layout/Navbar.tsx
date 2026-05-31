import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl italic">P</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-black to-slate-600">
                PRIME KICKS
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 hover:text-black font-medium">Home</Link>
            <div className="relative group">
              <button className="text-slate-600 hover:text-black font-medium flex items-center gap-1">
                Shop <Menu size={14} />
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="p-2 text-slate-600 hover:text-black relative">
                <ShoppingCart size={22} />
                <Badge className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full p-0">
                  0
                </Badge>
              </Link>
              
              {user ? (
                <div className="flex items-center gap-4 border-l pl-4">
                  {user.role !== 'customer' && (
                    <Link to="/dashboard">
                      <Button variant="outline" size="sm">Dashboard</Button>
                    </Link>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
                      {user.name.charAt(0)}
                    </div>
                    <button onClick={logout} className="text-slate-600 hover:text-red-600">
                      <LogOut size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="default" className="bg-black text-white rounded-full px-6">Login</Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-4">
          <Link to="/" className="block text-slate-600 font-medium py-2">Home</Link>
          <Link to="/cart" className="flex items-center gap-2 text-slate-600 font-medium py-2">
            <ShoppingCart size={20} /> Cart
          </Link>
          {user ? (
            <>
              {user.role !== 'customer' && (
                <Link to="/dashboard" className="block text-slate-600 font-medium py-2">Dashboard</Link>
              )}
              <button onClick={logout} className="flex items-center gap-2 text-red-600 font-medium py-2 w-full text-left">
                <LogOut size={20} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="block">
              <Button variant="default" className="w-full bg-black">Login</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;