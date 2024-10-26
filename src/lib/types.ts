import { JWTPayload } from "jose";

export interface CustomJWTPayload extends JWTPayload {
  user: {
    id_user: number;
    role: "Admin" | "Cashier" | "Manager";
  };
}

export type User = {
  id_user: string;
  nama_user: string;
  password: string;
  role: Role;
  username: string;
};
export type Transaksi = {
  id_transaksi: number;
  tgl_transaksi: string;
  nama_pelanggan: string;
  status: string;
  total_harga: number;
  Detail_Transaksi: Detail_Transaksi[];
  User: User; // Add the User interface here
};
export interface Detail_Transaksi extends Transaksi {
  Menu: Menu;
  jumlah: number;
  total_harga: number;
}
export type Menu = {
  id_menu: number;
  nama_menu: string;
  jenis: Jenis; // Assuming `Jenis` is an enum or another type
  deskripsi: string;
  gambar?: string; // Representing the LONGBLOB as a base64 string or URL if required
  harga: number;
  date_added: string | Date;
}
export enum Jenis {
  Food = "Food",
  Drinks = "Drinks",
  // Add more as needed
}
export type Meja = {
  id_meja: number;
  nomor_meja: string;
};
export type Role = {
  role: "Admin" | "Cashier" | "Manager";
};
