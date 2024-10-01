"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Input,
  Select,
  SelectItem,
  Spacer,
} from "@nextui-org/react";
import { Minus, Plus, X } from "lucide-react";

interface Menu {
  id_menu: number;
  nama_menu: string;
  jenis: "Food" | "Beverage";
  deskripsi: string;
  gambar?: string | null;
  harga: number;
  date_added?: string | Date;
}
interface Meja {
  id_meja: number;
  nomor_meja: string;
}
interface CartItem extends Menu {
  quantity: number;
  total_harga: number;
}

const formatter = new Intl.NumberFormat("en-EN", {
  style: "currency",
  currency: "IDR",
  notation: "compact",
});

export default function TransactionUI() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [mejas, setmejas] = useState<Meja[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [CartQuery, setCartQuery] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [idmeja, setIdmeja] = useState<number>(0);
  const filteredMenus = menus.filter(
    (menu) =>
      menu.nama_menu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      menu.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      menu.jenis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCart = cart.filter(
    (item) =>
      item.nama_menu.toLowerCase().includes(CartQuery.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(CartQuery.toLowerCase()) ||
      item.jenis.toLowerCase().includes(CartQuery.toLowerCase())
  );
  const fetchMeja = async () => {
    try {
      const response = await axios.get("/api/cashier/transaction/getMeja");
      setmejas(response.data.Meja);
    } catch (error) {
      console.error("Error fetching meja:", error);
    }
  };
  useEffect(() => {
    fetchMenus();
    fetchMeja();
  }, []);

  useEffect(() => {
    console.log(cart);
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (cart.length == 0 && storedCart.length > 0) {
      setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
    } else {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const fetchMenus = async () => {
    try {
      const response = await axios.get("/api/cashier/transaction/getMenu");
      setMenus(response.data.Menu);
      console.log(menus);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching menus:", error.message);
        console.error(error);
        if (error instanceof AxiosError) {
          if (error.response?.data.redirectUrl) {
            console.log(error.response.data.redirectUrl);
            window.location.href = "/" + error.response?.data.redirectUrl;
          }
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const renderImage = (base64String?: string) => {
    if (!base64String) return undefined;
    return `data:image/jpeg;base64,${base64String}`;
  };

  const addToCart = (menu: Menu) => {
    const existingItem = cart.find((item) => item.id_menu === menu.id_menu);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id_menu === menu.id_menu
            ? {
                ...item,
                quantity: item.quantity + 1,
                total_harga: item.harga * (item.quantity + 1),
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          harga: menu.harga,
          id_menu: menu.id_menu,
          jenis: menu.jenis,
          deskripsi: menu.deskripsi,
          nama_menu: menu.nama_menu,
          quantity: 1,
          total_harga: menu.harga,
        },
      ]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id_menu !== id));
    localStorage.setItem(
      "cart",
      JSON.stringify(cart.filter((item) => item.id_menu !== id))
    );
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart(
      cart
        .map((item) =>
          item.id_menu === id
            ? { ...item, quantity, total_harga: item.harga * quantity }
            : item
        )
        .filter((item) => {
          if (item.id_menu === id && item.quantity <= 0) {
            removeFromCart(id); // Call removeFromCart if quantity is 0
            return 0; // Remove the item from the cart
          }
          return true;
        })
    );
  };

  const sortMenus = () => {
    const sorted = [...menus].sort((a, b) => {
      const dateA = new Date(a.date_added ?? "").getTime();
      const dateB = new Date(b.date_added ?? "").getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setMenus(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const submitTransaction = async () => {
    try {
      const total_harga: number = cart.reduce(
        (sum, item) => sum + item.total_harga,
        0
      );
      const response = await axios.post("/api/cashier/transaction/submit", {
        cart,
        customerName,
        idmeja,
        total_harga,
      });
      console.log("Response from server:", response.data);
      
    } catch (error) {
      console.error("Error submitting transaction:", error);
      alert("Error submitting transaction. Please try again.");
    } finally {
      setCart([]);
      alert("Transaction submitted successfully!");
      localStorage.removeItem("cart");
    }
  };

  const clearCart = () => {
    setCart([]);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    localStorage.setItem("cart", []);
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:flex-row">
      <div className="w-full space-y-4 md:w-3/4">
        <div className="flex justify-start mb-4 space-x-2">
          <Button onClick={sortMenus}>
            Sort By Date ({sortOrder === "asc" ? "ascending" : "descending"})
          </Button>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu items..."
            className="w-full md:w-1/2"
            variant="bordered"
            endContent={
              <X
                style={{ cursor: "pointer" }}
                onClick={() => setSearchQuery("")}
              />
            }
          />
          <Button
            onClick={() => {
              const newCart = menus.reduce(
                (acc, menu) => {
                  const existingItem = acc.find(
                    (item) => item.id_menu === menu.id_menu
                  );
                  if (existingItem) {
                    existingItem.quantity = existingItem.quantity + 1;
                    existingItem.total_harga =
                      menu.harga * existingItem.quantity;
                  } else {
                    const { gambar, ...menuWithoutGambar } = menu;
                    acc.push({
                      ...menuWithoutGambar,
                      quantity: 1,
                      total_harga: menu.harga,
                    });
                  }
                  return acc;
                },
                [...cart]
              );
              setCart(newCart);
            }}
          >
            Add all to cart
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMenus.map((menu) => (
            <Card key={menu.id_menu} className="max-w-sm">
              <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                  <p className="text-md">
                    {menu.nama_menu} |{" "}
                    <span className="text-default-500">{menu.jenis}</span>
                  </p>
                  <p className="text-small text-default-500">
                    {menu.deskripsi}
                  </p>
                </div>
              </CardHeader>
              {menu.gambar && (
                <>
                  <CardBody className="flex justify-center py-2 overflow-visible">
                    <Image
                      alt={menu.nama_menu}
                      className="object-cover rounded-xl"
                      src={renderImage(menu.gambar)}
                    />
                  </CardBody>
                </>
              )}
              <CardFooter className="flex justify-between">
                <p>{formatter.format(menu.harga)}</p>
                <Button color="primary" onClick={() => addToCart(menu)}>
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <div className="w-full mt-4 md:w-1/4 md:mt-0">
        <Input
          type="text"
          value={CartQuery}
          onChange={(e) => setCartQuery(e.target.value)}
          placeholder="Search menu items..."
          className="w-full"
          variant="bordered"
          endContent={
            <X style={{ cursor: "pointer" }} onClick={() => setCartQuery("")} />
          }
        />
        <Spacer y={4}></Spacer>
        <Card className="sticky top-5">
          <CardHeader>
            <h2 className="text-lg font-bold">Cart</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            {filteredCart.map((item) => (
              <div
                key={item.id_menu}
                className="flex items-center justify-between"
              >
                <div>
                  <p>{item.nama_menu}</p>
                  <p className="text-small text-default-500">
                    {formatter.format(item.harga)} x {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onClick={() =>
                      updateQuantity(item.id_menu, item.quantity - 1)
                    }
                  >
                    <Minus size={16} />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity.toString()}
                    onChange={(e) =>
                      updateQuantity(item.id_menu, parseInt(e.target.value))
                    }
                    min={1}
                    className="w-16 text-center"
                    style={{
                      appearance: "none",
                    }}
                  />
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onClick={() =>
                      updateQuantity(item.id_menu, item.quantity + 1)
                    }
                  >
                    <Plus size={16} />
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => removeFromCart(item.id_menu)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </CardBody>
          <form className="w-full" onSubmit={submitTransaction}>
            <CardFooter className="flex flex-col">
              <div className="w-full">
                <p className="text-lg font-bold">
                  Total:{" "}
                  {formatter.format(
                    cart.reduce((sum, item) => sum + item.total_harga, 0)
                  )}
                </p>
                <Spacer y={3} />
                <div className="flex justify-between">
                  <Button type="submit" className="w-5/6" color="success">
                    Submit Order
                  </Button>
                  <Spacer x={8} />
                  <Button
                    className="w-5/6"
                    onClick={() => clearCart()}
                    color="danger"
                  >
                    Remove all
                  </Button>
                </div>
              </div>
              <Spacer y={5} />
              <div className="flex flex-col w-full gap-5">
                <Input
                  label="Customer Name"
                  labelPlacement="outside"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  fullWidth
                  placeholder="Enter Customer Name"
                  required
                  isRequired
                />
                <Select
                  label="Nomor Meja"
                  labelPlacement="outside"
                  value={idmeja}
                  onChange={(e) => setIdmeja(parseInt(e.target.value, 10))}
                  fullWidth
                  placeholder="Select Table Number"
                  isRequired
                >
                  {mejas.map((meja) => (
                    <SelectItem key={meja.id_meja} value={meja.id_meja}>
                      {meja.nomor_meja}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
