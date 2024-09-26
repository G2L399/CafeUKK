"use client"
// app/page.tsx

import { useEffect, useState } from 'react';
import { MenuItem } from '@/app/types';

export default function HomePage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: MenuItem[] = await response.json();
        setMenuItems(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <div>
      <h1>Menu Items</h1>
      {error && <p>Error: {error}</p>}
      <ul>
        {menuItems.map(item => (
          <li key={item.id_menu}>
            <h2>{item.nama_menu}</h2>
            <p>Type: {item.jenis}</p>
            <p>Price: {item.harga}</p>
            {item.deskripsi && <p>Description: {item.deskripsi}</p>}
            {item.gambar && <img src={item.gambar} alt={item.nama_menu} />}
          </li>
        ))}
      </ul>
    </div>
  );
}
