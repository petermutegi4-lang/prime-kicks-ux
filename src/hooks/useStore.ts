import { StorageService } from '../lib/storage';
import { SalesReport, Product as ProductType, Order as OrderType } from '../types';
import { useState, useEffect } from 'react';

export const useStore = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [orders, setOrders] = useState<OrderType[]>([]);

  const refreshData = () => {
    setProducts(StorageService.getProducts());
    setOrders(StorageService.getOrders());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const getSalesReport = (): SalesReport => {
    const totalSales = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const totalProfit = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, order) => {
        const orderProfit = order.items.reduce((itemSum, item) => {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            const profitPerItem = product.sellingPrice - product.buyingPrice;
            return itemSum + (profitPerItem * item.quantity);
          }
          return itemSum;
        }, 0);
        return sum + orderProfit;
      }, 0);

    const lowStockCount = products.filter(p => p.stockQuantity <= p.lowStockThreshold).length;

    return {
      totalSales,
      totalProfit,
      totalOrders: orders.length,
      lowStockCount
    };
  };

  return {
    products,
    orders,
    refreshData,
    getSalesReport,
    addProduct: (p: ProductType) => { StorageService.addProduct(p); refreshData(); },
    updateProduct: (p: ProductType) => { StorageService.updateProduct(p); refreshData(); },
    deleteProduct: (id: string) => { StorageService.deleteProduct(id); refreshData(); },
    addOrder: (o: OrderType) => { StorageService.addOrder(o); refreshData(); },
    updateOrder: (o: OrderType) => { StorageService.updateOrder(o); refreshData(); }
  };
};