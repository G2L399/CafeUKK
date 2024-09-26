// types.ts (or within the API file)
import { User as NextAuthUser } from 'next-auth';

interface User extends NextAuthUser {
  id: string;
  username: string;
  role: 'admin' | 'Cashier' | 'manajer';
}

export default User;

export interface MenuItem {
    id_menu: number;
    nama_menu: string;
    jenis: 'makanan' | 'minuman';
    deskripsi?: string;
    gambar?: string;
    harga: number;
  }
  