import { User, Product, Order, UserRole } from '../types';

const STORAGE_KEYS = {
  USERS: 'pk_users',
  PRODUCTS: 'pk_products',
  ORDERS: 'pk_orders',
  CURRENT_USER: 'pk_current_user',
};

const defaultAdmin: User = {
  id: 'admin-1',
  name: 'Prime Kicks Admin',
  email: 'primekickske@gmail.com',
  password: '252436/Pm',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

const initialProducts: Product[] = [
  {
    id: 'p1',
    name: 'Air Max Pro',
    brand: 'Nike',
    description: 'Ultra comfortable running shoes with air cushion technology.',
    buyingPrice: 50,
    sellingPrice: 120,
    stockQuantity: 15,
    lowStockThreshold: 5,
    sizes: ['40', '41', '42', '43', '44'],
    colors: ['White', 'Black'],
    images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/56fbb33b-5c09-48cd-95e7-d262601f33d2/shoe1-9ae8db6f-1780218240419.webp'],
    category: 'Running',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    name: 'Classic Leather',
    brand: 'Prime',
    description: 'Elegant formal shoes for business and formal events.',
    buyingPrice: 40,
    sellingPrice: 95,
    stockQuantity: 8,
    lowStockThreshold: 3,
    sizes: ['39', '40', '41', '42'],
    colors: ['Brown', 'Black'],
    images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/56fbb33b-5c09-48cd-95e7-d262601f33d2/shoe2-7c57b1fe-1780218242534.webp'],
    category: 'Formal',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p3',
    name: 'Volt Runner',
    brand: 'Speed',
    description: 'High performance track shoes with superior grip.',
    buyingPrice: 60,
    sellingPrice: 150,
    stockQuantity: 4,
    lowStockThreshold: 5,
    sizes: ['42', '43', '44', '45'],
    colors: ['Neon Green', 'Blue'],
    images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/56fbb33b-5c09-48cd-95e7-d262601f33d2/shoe3-b8c4c689-1780218241033.webp'],
    category: 'Sport',
    createdAt: new Date().toISOString(),
  }
];

export const StorageService = {
  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([defaultAdmin]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    }
  },

  // Auth
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },

  addUser: (user: User) => {
    const users = StorageService.getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  // Products
  getProducts: (): Product[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  },

  saveProducts: (products: Product[]) => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  addProduct: (product: Product) => {
    const products = StorageService.getProducts();
    products.push(product);
    StorageService.saveProducts(products);
  },

  updateProduct: (product: Product) => {
    const products = StorageService.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      products[index] = product;
      StorageService.saveProducts(products);
    }
  },

  deleteProduct: (id: string) => {
    const products = StorageService.getProducts();
    StorageService.saveProducts(products.filter(p => p.id !== id));
  },

  // Orders
  getOrders: (): Order[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  },

  addOrder: (order: Order) => {
    const orders = StorageService.getOrders();
    orders.push(order);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    
    // Update stock
    const products = StorageService.getProducts();
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        product.stockQuantity -= item.quantity;
      }
    });
    StorageService.saveProducts(products);
  },

  updateOrder: (order: Order) => {
    const orders = StorageService.getOrders();
    const index = orders.findIndex(o => o.id === order.id);
    if (index !== -1) {
      orders[index] = order;
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }
  }
};