'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [menuItems, setMenuItems] = useState<{ href: string; label: string }[]>([]);
  const [authItems, setAuthItems] = useState<{ href: string; label: string }[]>([]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        let newMenuItems: { href: string; label: string }[] = [];
        let newAuthItems: { href: string; label: string }[] = [];
        if (!token) {
          newMenuItems = [];
          newAuthItems = [
            { href: '/login', label: 'Вход' },
            { href: '/signup', label: 'Регистрация' },
          ];
          setMenuItems(newMenuItems);
          setAuthItems(newAuthItems);
          return;
        }

        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();

          if (data.user.email === 'admin@mail.ru') {
            newMenuItems = [
              { href: '/profile', label: 'Профиль' },
              { href: '/management', label: 'Управление заказами' },
            ];
          } else {
            newMenuItems = [
              { href: '/profile', label: 'Профиль' },
              { href: '/catalog', label: 'Каталог' },
              { href: '/orders', label: 'Мои заказы' },
              { href: '/cart', label: 'Корзина' },
            ];
          }
          newAuthItems = [{ href: '#', label: 'Выход' }];
        } else if (response.status === 401) {
          handleLogout();
          return;
        } else {
          newMenuItems = [];
          newAuthItems = [
            { href: '/login', label: 'Вход' },
            { href: '/signup', label: 'Регистрация' },
          ];
        }
        setMenuItems(newMenuItems);
        setAuthItems(newAuthItems);
      } catch (error) {
        setMenuItems([]);
        setAuthItems([
          { href: '/login', label: 'Вход' },
          { href: '/signup', label: 'Регистрация' },
        ]);
      }
    };
    checkAuth();
  }, []);

  return (
    <header className="mb-2 flex items-center justify-between bg-white bg-opacity-60 px-4 py-4">
      <Link href="/" className="flex items-center">
        <Image src="/simple_icon.png" alt="NeOzon logo" width={50} height={50} className="mr-4" />
        <div>
          <h1 className="text-2xl font-bold">NeOzon</h1>
          <h2 className="leading-4">
            Система управления заказами
            <br />и доставкой товаров
          </h2>
        </div>
      </Link>
      <nav className="flex">
        <ul className="flex space-x-4">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link href={item.href} className="hover:text-ozonBlue">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <nav className="flex">
        <ul className="flex space-x-4">
          {authItems.map((item) => (
            <li key={item.label}>
              {item.label === 'Выход' ? (
                <button onClick={handleLogout} className="hover:text-ozonBlue">
                  {item.label}
                </button>
              ) : (
                <Link href={item.href} className="hover:text-ozonBlue">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
