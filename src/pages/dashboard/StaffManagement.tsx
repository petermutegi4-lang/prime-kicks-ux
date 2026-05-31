import React, { useState } from 'react';
import { useStore } from '../../hooks/useStore';
import { useAuth } from '../../context/AuthContext';
import { 
  UserPlus, 
  Search, 
  Trash2, 
  Shield, 
  Mail, 
  Phone,
  UserCheck,
  UserX
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '../../components/ui/dialog';
import { StorageService } from '../../lib/storage';
import { toast } from 'sonner';
import { User } from '../../types';

const StaffManagement = () => {
  const [users, setUsers] = useState<User[]>(StorageService.getUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'staff' as const
  });

  const staff = users.filter(u => 
    (u.role === 'staff' || u.role === 'admin') && 
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    StorageService.addUser(newUser);
    setUsers(StorageService.getUsers());
    setIsAddOpen(false);
    setFormData({ name: '', email: '', phone: '', password: '', role: 'staff' });
    toast.success('Staff account created');
  };

  const handleDeleteStaff = (id: string) => {
    if (id === 'admin-1') {
      toast.error('Cannot delete the primary admin account');
      return;
    }
    
    if (confirm('Are you sure you want to remove this staff member?')) {
      const allUsers = StorageService.getUsers().filter(u => u.id !== id);
      localStorage.setItem('pk_users', JSON.stringify(allUsers));
      setUsers(allUsers);
      toast.success('Staff member removed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Staff Management</h2>
          <p className="text-slate-500">Manage administrator and sales staff accounts</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white rounded-full">
              <UserPlus size={18} className="mr-2" /> Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Staff Account</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddStaff} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="sname">Full Name</Label>
                <Input id="sname" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semail">Email Address</Label>
                <Input id="semail" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sphone">Phone Number</Label>
                <Input id="sphone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spass">Password</Label>
                <Input id="spass" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="srole">Role</Label>
                <select 
                  id="srole" 
                  className="w-full h-10 px-3 py-2 bg-white border rounded-md text-sm"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as any})}
                >
                  <option value="staff">Staff (Sales & Orders)</option>
                  <option value="admin">Admin (Full Control)</option>
                </select>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-black text-white">Create Account</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Search staff by name or email..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <div key={member.id} className="bg-white rounded-3xl border p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-lg">
                {member.name.charAt(0)}
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                member.role === 'admin' ? 'bg-black text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {member.role}
              </div>
            </div>
            
            <h3 className="font-bold text-slate-900 text-lg mb-4">{member.name}</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Mail size={14} />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Phone size={14} />
                <span>{member.phone || 'No phone set'}</span>
              </div>
            </div>

            <div className="pt-6 border-t flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-medium">Joined {new Date(member.createdAt).toLocaleDateString()}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600 hover:bg-red-50 h-8"
                onClick={() => handleDeleteStaff(member.id)}
              >
                <Trash2 size={14} className="mr-2" /> Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-3xl border ${className}`}>{children}</div>
);
const CardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export default StaffManagement;