import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { Lock, Mail, ArrowLeft, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Login successful!');
        // Navigation is handled by AppRoutes based on user role
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Image/Branding */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/56fbb33b-5c09-48cd-95e7-d262601f33d2/shoe4-9ead48dd-1780218243098.webp" 
            alt="Shoes Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-white max-w-md">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8">
            <span className="text-black font-bold text-3xl italic">P</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-4">Welcome Back to Prime Kicks</h1>
          <p className="text-slate-300 text-lg">
            Manage your footwear inventory, process orders, and track your business performance with ease.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-black mb-8 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
          
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Login</h2>
            <p className="text-slate-500">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="primekickske@gmail.com" 
                  className="pl-10"
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="#" className="text-sm text-slate-500 hover:text-black">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10"
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-black text-white py-6" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : 'Login to Account'}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-slate-500">
              Don't have an account? {' '}'
              <Link to="/signup" className="text-black font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>

          <div className="mt-8 p-4 bg-slate-50 rounded-lg border text-sm text-slate-600">
            <p className="font-bold mb-1">Demo Access:</p>
            <p>Admin: primekickske@gmail.com / 252436/Pm</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;