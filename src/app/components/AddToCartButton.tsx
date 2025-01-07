'use client';

import React, { useState } from 'react';

interface Props {
  productId: number;
  price: number;
}

export default function AddToCartButton({ productId, price }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const addToCart = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Вы не авторизованы');
        return;
      }
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: productId, quantity: 1 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Не удалось добавить товар в корзину');
        return;
      } else if (response.status === 401) {
        handleLogout();
        return;
      }
      setSuccess(true);
    } catch (e) {
      console.error(e);
      setError('Произошла ошибка при добавлении товара');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className="mt-2 rounded bg-ozonBlue px-4 py-2 text-white disabled:opacity-50"
        onClick={addToCart}
        disabled={loading || success}
      >
        {loading ? 'Добавляем...' : success ? 'В корзине!' : 'В корзину'}
      </button>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
