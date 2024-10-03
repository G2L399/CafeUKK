"use client";

import { useEffect, useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Image,
  Select,
  SelectItem,
  Spacer,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Pagination,
  SortDescriptor,
} from "@nextui-org/react";
import { Minus, Plus, Search, X } from "lucide-react";
import React from "react";

interface Menu {
  id_menu: number;
  nama_menu: string;
  jenis: "Food" | "Beverage";
  deskripsi: string;
  gambar?: string;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [CartQuery, setCartQuery] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [idmeja, setIdmeja] = useState<number>(0);
  const [filterType, setFilterType] = useState<"All" | "Food" | "Beverage">(
    "All"
  );

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "nama_menu",
    direction: "ascending",
  });
  const filteredMenus = menus.filter(
    (menu) =>
      (filterType === "All" || menu.jenis === filterType) &&
      (menu.nama_menu.toLowerCase().includes(searchQuery.toLowerCase()) ||
        menu.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        menu.jenis.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCart = cart.filter(
    (item) =>
      item.nama_menu.toLowerCase().includes(CartQuery.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(CartQuery.toLowerCase()) ||
      item.jenis.toLowerCase().includes(CartQuery.toLowerCase())
  );
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };
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
  const sortedMenu = useMemo(() => {
    return [...filteredMenus].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof Menu];
      const second = b[sortDescriptor.column as keyof Menu];
      if (first === undefined && second === undefined) return 0;
      if (first === undefined) return 1; // Treat undefined as greater than any defined value
      if (second === undefined) return -1; // Treat defined values as less than undefined

      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [filteredMenus, sortDescriptor]);
  const fetchMenus = async () => {
    try {
      setLoading(true);
      await axios
        .get("/api/cashier/transaction/getMenu")
        .then((response) => setMenus(response.data.Menu));
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
    } finally {
      setLoading(false);
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

  const submitTransaction = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent page reload

    const total_harga: number = cart.reduce(
      (sum, item) => sum + item.total_harga,
      0
    );
    try {
      await axios
        .post(
          "/api/cashier/transaction/submit",

          { cart, customerName, idmeja, total_harga }
        )
        .finally(() => {
          setCart([]);
          alert("Transaction submitted successfully!");
        });

      localStorage.removeItem("cart");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error("Error response:", error.response.data);
        } else if (error.request) {
          // Request was made but no response was received
          console.error("No response received:", error.request);
        } else {
          // Something else happened
          console.error("Error setting up request:", error.message);
        }
      } else {
        // Handle non-Axios errors here
        console.error("Unknown error:", error);
      }
      alert("Error submitting transaction. Please try again.");
    }
  };

  const clearCart = () => {
    setCart([]);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    localStorage.setItem("cart", []);
  };
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handleSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  };

  return (
    <div className="flex flex-col gap-4 px-4 md:flex-row">
      <div className="w-full space-y-4 md:w-3/4">
        <div className="flex justify-start mb-4 space-x-2">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            label="Search Menu Items..."
            placeholder="Search Menu Items..."
            labelPlacement="outside"
            startContent={<Search />}
            className="w-full md:w-1/2"
            variant="bordered"
            endContent={
              <X
                style={{ cursor: "pointer" }}
                onClick={() => setSearchQuery("")}
              />
            }
          />
          <Select
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value as "All" | "Food" | "Beverage")
            }
            variant="bordered"
            defaultSelectedKeys={["All"]}
            className="w-full md:w-1/4"
            disallowEmptySelection
            label="Type"
            labelPlacement="outside"
          >
            <SelectItem key="All" value="All">
              All
            </SelectItem>
            <SelectItem key="Food" value="Food">
              Food
            </SelectItem>
            <SelectItem key="Beverage" value="Beverage">
              Beverage
            </SelectItem>
          </Select>
          <Select
            label="Rows Per Page"
            labelPlacement="outside"
            defaultSelectedKeys={["5"]}
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            disallowEmptySelection
            className="w-1/4"
            variant="bordered"
          >
            <SelectItem key={5} value="5">
              5
            </SelectItem>
            <SelectItem key={10} value="10">
              10
            </SelectItem>
            <SelectItem key={20} value="20">
              20
            </SelectItem>
            <SelectItem key={50} value="50">
              50
            </SelectItem>
          </Select>
        </div>
        <Table
          aria-label="Menu items table"
          sortDescriptor={sortDescriptor}
          classNames={{
            th: "text-sm uppercase",
            td: " border-b border-divider text-lg",
          }}
          onSortChange={handleSortChange}
        >
          <TableHeader>
            <TableColumn key="gambar">gambar</TableColumn>
            <TableColumn allowsSorting key="nama_menu">
              Name
            </TableColumn>
            <TableColumn allowsSorting key="jenis">
              Type
            </TableColumn>
            <TableColumn key="deskripsi">Description</TableColumn>
            <TableColumn allowsSorting key="harga">
              Price
            </TableColumn>
            <TableColumn key="actions">Actions</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={"No Data"}
            items={sortedMenu}
            loadingContent={<Spinner label="Loading..." />}
            loadingState={loading ? "loading" : "idle"}
          >
            {(item) => (
              <TableRow key={item.id_menu}>
                <TableCell>
                  <Image
                    className="max-w-[17.5rem]"
                    alt={item.nama_menu}
                    src={renderImage(item.gambar)}
                  />
                </TableCell>
                <TableCell>{item.nama_menu}</TableCell>
                <TableCell>{item.jenis}</TableCell>
                <TableCell>{item.deskripsi}</TableCell>
                <TableCell>{formatter.format(item.harga)}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => addToCart(item)}>
                    Add to Cart
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-between">
          <Pagination
            total={Math.ceil(filteredMenus.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            loop
            showControls
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
                    acc.push({
                      id_menu: menu.id_menu,
                      nama_menu: menu.nama_menu,
                      jenis: menu.jenis,
                      deskripsi: menu.deskripsi,
                      harga: menu.harga,
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
      </div>
      <div className="w-full mt-4 md:w-1/4 md:mt-0">
        <Input
          type="text"
          value={CartQuery}
          onChange={(e) => setCartQuery(e.target.value)}
          label="Search cart items..."
          labelPlacement="outside"
          placeholder="Search cart items..."
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
