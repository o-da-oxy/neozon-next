'use client';

import { useEffect, useState } from 'react';

interface Order {
  id: string;
  userId: string;
  productId: number;
  quantity: number;
  status: 'placed' | 'shipped' | 'delivered';
  createdAt: string;
  updatedAt: string;
}

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
};

const ManagementPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Record<number, Product>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      const response = await fetch('/api/management/orders', {
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

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (
    orderId: string,
    newStatus: 'placed' | 'shipped' | 'delivered',
  ) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Вы не авторизованы');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/management/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Не удалось изменить статус заказа');
        return;
      }
      fetchOrders();
    } catch (e) {
      console.error(e);
      setError('Произошла ошибка при изменении статуса заказа');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Загрузка заказов...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (orders.length === 0) {
    return <div>Нет заказов</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Управление заказами</h1>
      <table className="border-gray-300 min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border-gray-300 border p-2">ID заказа</th>
            <th className="border-gray-300 border p-2">ID пользователя</th>
            <th className="border-gray-300 border p-2">Товар</th>
            <th className="border-gray-300 border p-2">Количество</th>
            <th className="border-gray-300 border p-2">Статус</th>
            <th className="border-gray-300 border p-2">Дата создания</th>
            <th className="border-gray-300 border p-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const product = products[order.productId];
            return (
              <tr key={order.id} className="border-gray-200 border-b">
                <td className="border-gray-300 border p-2">{order.id}</td>
                <td className="border-gray-300 border p-2">{order.userId}</td>
                <td className="border-gray-300 border p-2">
                  {product ? (
                    <div>
                      <p className="font-semibold">{product.title}</p>
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-16 w-16 object-contain"
                      />
                      <p className="text-gray-600">Цена: ${product.price}</p>
                    </div>
                  ) : (
                    'Товар не найден'
                  )}
                </td>
                <td className="border-gray-300 border p-2">{order.quantity}</td>
                <td className="border-gray-300 border p-2">{order.status}</td>
                <td className="border-gray-300 border p-2">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="border-gray-300 border p-2">
                  <div className="flex space-x-2">
                    {order.status === 'placed' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'shipped')}
                        className="rounded bg-ozonBlue px-2 py-1 text-white disabled:opacity-50"
                        disabled={loading}
                      >
                        Отправить
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'delivered')}
                        className="rounded bg-green-500 px-2 py-1 text-white disabled:opacity-50"
                        disabled={loading}
                      >
                        Доставлен
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ManagementPage;
