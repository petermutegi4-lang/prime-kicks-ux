import React, { useState } from 'react';
import { useStore } from '../../hooks/useStore';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  AlertCircle,
  Package,
  ArrowUpDown,
  Download
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
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import { Product } from '../../types';

const InventoryPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const isAdmin = user?.role === 'admin';

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    brand: '',
    description: '',
    buyingPrice: 0,
    sellingPrice: 0,
    stockQuantity: 0,
    lowStockThreshold: 5,
    sizes: [],
    colors: [],
    category: 'Running',
    images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/56fbb33b-5c09-48cd-95e7-d262601f33d2/shoe1-9ae8db6f-1780218240419.webp']
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id.includes('Price') || id.includes('Quantity') || id.includes('Threshold') 
        ? parseFloat(value) 
        : value
    }));
  };

  const handleSizeChange = (size: string) => {
    setFormData(prev => {
      const sizes = prev.sizes || [];
      if (sizes.includes(size)) {
        return { ...prev, sizes: sizes.filter(s => s !== size) };
      }
      return { ...prev, sizes: [...sizes, size] };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error('Only admins can manage inventory');
      return;
    }

    if (editingProduct) {
      updateProduct({ ...editingProduct, ...formData } as Product);
      toast.success('Product updated successfully');
    } else {
      const newProduct: Product = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      } as Product;
      addProduct(newProduct);
      toast.success('Product added successfully');
    }
    
    setIsAddDialogOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '', brand: '', description: '', buyingPrice: 0, sellingPrice: 0,
      stockQuantity: 0, lowStockThreshold: 5, sizes: [], colors: [], category: 'Running',
      images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/56fbb33b-5c09-48cd-95e7-d262601f33d2/shoe1-9ae8db6f-1780218240419.webp']
    });
  };

  const handleEdit = (product: Product) => {
    if (!isAdmin) return;
    setEditingProduct(product);
    setFormData(product);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!isAdmin) return;
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      toast.success('Product deleted');
    }
  };

  const availableSizes = ['38', '39', '40', '41', '42', '43', '44', '45'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Inventory</h2>
          <p className="text-slate-500">Manage your shoe stock and pricing</p>
        </div>
        {isAdmin && (
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-full">
              <Download size={18} className="mr-2" /> Export
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) { setEditingProduct(null); setFormData({}); }
            }}>
              <DialogTrigger asChild>
                <Button className="bg-black text-white rounded-full">
                  <Plus size={18} className="mr-2" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Shoe'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input id="name" value={formData.name || ''} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input id="brand" value={formData.brand || ''} onChange={handleInputChange} required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description || ''} onChange={handleInputChange} />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="buyingPrice">Buying Price (KES)</Label>
                      <Input id="buyingPrice" type="number" value={formData.buyingPrice || 0} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sellingPrice">Selling Price (KES)</Label>
                      <Input id="sellingPrice" type="number" value={formData.sellingPrice || 0} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select 
                        id="category" 
                        className="w-full h-10 px-3 py-2 bg-white border rounded-md text-sm"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
                      >
                        <option>Running</option>
                        <option>Formal</option>
                        <option>Sport</option>
                        <option>Casual</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stockQuantity">Stock Quantity</Label>
                      <Input id="stockQuantity" type="number" value={formData.stockQuantity || 0} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lowStockThreshold">Low Stock Alert (at)</Label>
                      <Input id="lowStockThreshold" type="number" value={formData.lowStockThreshold || 5} onChange={handleInputChange} required />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Available Sizes</Label>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeChange(size)}
                          className={`w-10 h-10 rounded-lg border flex items-center justify-center text-sm font-medium transition-colors ${
                            formData.sizes?.includes(size) 
                              ? 'bg-black text-white border-black' 
                              : 'bg-white text-slate-600 hover:border-black'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-black text-white">
                      {editingProduct ? 'Update Product' : 'Add to Inventory'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Filters & Search */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Search products..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon"><Filter size={18} /></Button>
              <Button variant="outline" size="icon"><ArrowUpDown size={18} /></Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="border-none shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 font-bold text-slate-400 text-xs uppercase">Product</th>
                <th className="px-6 py-4 font-bold text-slate-400 text-xs uppercase text-right">Buying</th>
                <th className="px-6 py-4 font-bold text-slate-400 text-xs uppercase text-right">Selling</th>
                <th className="px-6 py-4 font-bold text-slate-400 text-xs uppercase text-right">Stock</th>
                <th className="px-6 py-4 font-bold text-slate-400 text-xs uppercase">Status</th>
                {isAdmin && <th className="px-6 py-4 font-bold text-slate-400 text-xs uppercase text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border">
                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.brand} • {product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-slate-600">
                      {isAdmin ? `KES ${product.buyingPrice.toLocaleString()}` : '***'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-black">
                      KES {product.sellingPrice.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-sm font-bold ${product.stockQuantity <= product.lowStockThreshold ? 'text-red-600' : 'text-slate-900'}`}>
                      {product.stockQuantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {product.stockQuantity <= product.lowStockThreshold ? (
                      <span className="flex items-center gap-1 text-red-600 text-[10px] font-bold uppercase bg-red-50 px-2 py-1 rounded-full w-fit">
                        <AlertCircle size={10} /> Low Stock
                      </span>
                    ) : (
                      <span className="text-green-600 text-[10px] font-bold uppercase bg-green-50 px-2 py-1 rounded-full w-fit">
                        In Stock
                      </span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-black"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-red-600"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-400 italic">
                    <Package size={48} className="mx-auto mb-4 opacity-20" />
                    No products found in inventory
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// Simple Card wrapper
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-3xl border ${className}`}>{children}</div>
);
const CardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export default InventoryPage;