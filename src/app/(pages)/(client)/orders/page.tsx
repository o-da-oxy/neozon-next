'use client';

import { useEffect, useState } from 'react';

interface Order {
  id: string;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  status: 'in_cart' | 'placed' | 'shipped' | 'delivered';
}

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Record<number, Product>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Вы не авторизованы');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/orders/my', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || 'Не удалось загрузить заказы');
          setLoading(false);
          return;
        }
        const ordersData = (await response.json()) as Order[];
        setOrders(ordersData);
        const productIds = ordersData.map((item) => item.productId);
        const productsData = await Promise.all(
          productIds.map(async (productId) => {
            const productResponse = await fetch(`https://fakestoreapi.com/products/${productId}`, {
              cache: 'force-cache',
            });
            if (!productResponse.ok) {
              return null;
            }
            return (await productResponse.json()) as Product;
          }),
        );
        const productsRecord = productsData.reduce(
          (acc, product) => {
            if (product) {
              acc[product.id] = product;
            }
            return acc;
          },
          {} as Record<number, Product>,
        );

        setProducts(productsRecord);
      } catch (e) {
        console.error(e);
        setError('Произошла ошибка при загрузке заказов');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Загрузка заказов...</div>;
  }
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center">У вас нет заказов.</div>;
  }

  const ordersByStatus = orders.reduce(
    (acc, order) => {
      if (!acc[order.status]) {
        acc[order.status] = [];
      }
      acc[order.status].push(order);
      return acc;
    },
    {} as Record<Order['status'], Order[]>,
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Мои заказы</h1>
      {Object.entries(ordersByStatus).map(([status, orders]) => {
        return (
          <div key={status} className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">
              {status === 'placed'
                ? 'Оформленные заказы'
                : status === 'shipped'
                  ? 'Заказы в доставке'
                  : status === 'delivered'
                    ? 'Доставленные заказы'
                    : 'В корзине'}
            </h2>
            {orders.map((order) => {
              const product = products[order.productId];
              if (!product) {
                return null;
              }
              return (
                <div
                  key={order.id}
                  className="border-gray-200 mb-2 flex items-center border-b pb-2"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="mr-4 h-16 w-16 object-contain"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{product.title}</h3>
                    <p className="text-gray-600">Цена: ${product.price}</p>
                    <p className="text-gray-600">Кол-во: {order.quantity}</p>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
