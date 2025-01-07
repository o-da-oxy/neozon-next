'use client';

import { useEffect, useState } from 'react';

export default function Profile() {
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }
        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setEmail(data.user.email);
        } else if (response.status === 401) {
          handleLogout();
          return;
        } else {
          setError('Failed to fetch profile data');
        }
      } catch (e) {
        console.error(e);
        setError('Something went wrong');
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div>
      <h1 className="text-center text-2xl font-bold">Данные профиля</h1>
      {error ? <p>{error}</p> : <p className="ml-3 font-bold">Email: {email ? email : '...'}</p>}
    </div>
  );
}
