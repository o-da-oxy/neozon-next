'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CartItem {
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

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Record<number, Product>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCartData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Вы не авторизованы');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Не удалось загрузить корзину');
        setLoading(false);
        return;
      }
      const cartData = (await response.json()) as CartItem[];
      setCartItems(cartData);
      const productIds = cartData.map((item) => item.productId);
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
      setError('Произошла ошибка при загрузке корзины');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Вы не авторизованы');
        return;
      }
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Не удалось оформить заказ');
        return;
      }
      setCartItems([]);
      fetchCartData();
    } catch (e) {
      console.error(e);
      setError('Произошла ошибка при оформлении заказа');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (loading) {
    return <div>Загрузка корзины...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center">
        Ваша корзина пуста.{' '}
        <Link href="/catalog" className="text-ozonBlue">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Корзина</h1>
      {cartItems.map((item) => {
        const product = products[item.productId];
        if (!product) {
          return null;
        }
        return (
          <div
            key={item.productId}
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
              <p className="text-gray-600">Кол-во: {item.quantity}</p>
            </div>
          </div>
        );
      })}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleCheckout}
          className="rounded bg-ozonBlue px-4 py-2 text-white disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Оформляем...' : 'Оформить заказ'}
        </button>
      </div>
    </div>
  );
}
