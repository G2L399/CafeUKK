"use client";

import axios, { AxiosError } from "axios";
import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  SortDescriptor,
  Spinner,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Pagination,
  Select,
  SelectItem,
  Spacer,
} from "@nextui-org/react";
import { LogOut } from "lucide-react";

export interface User {
  id_user: number;
  nama_user: string;
  password: string;
  role: string;
  username: string;
}
export interface Transaksi {
  id_transaksi: number;
  tgl_transaksi: string;
  nama_pelanggan: string;
  status: string;
  total_harga: number;
  Detail_Transaksi: Detail_Transaksi[];
  User: User; // Add the User interface here
}
export interface Detail_Transaksi extends Transaksi {
  Menu: Menu;
  jumlah: number;
  total_harga: number;
}
export interface Menu {
  id_menu: number;
  nama_menu: string;
  jenis: Jenis; // Assuming `Jenis` is an enum or another type
  deskripsi?: string;
  gambar?: string; // Representing the LONGBLOB as a base64 string or URL if required
  harga: number;
  date_added: Date;
}
export enum Jenis {
  FOOD = "FOOD",
  BEVERAGE = "BEVERAGE",
  // Add more as needed
}

export default function ManagerDashboard() {
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [Detailtransaksi, setDetailTransaksi] = useState<Detail_Transaksi[]>(
    []
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "tgl_transaksi",
    direction: "ascending",
  });
  const [sortDetailDescriptor, setSortDetailDescriptor] =
    useState<SortDescriptor>({
      column: "no",
      direction: "ascending",
    });
  const [loading, setLoading] = useState(true);
  const [selectedTransaksi, setSelectedTransaksi] = useState<Transaksi | null>(
    null
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [startDate, setstartDate] = useState<string>("");
  const [endDate, setendDate] = useState<string>("");
  const fetchTransaksi = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/manager/getTransaksi");
      setTransaksi(response.data.Transaksi);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching transaksi:", error.message);
        console.error(error.response);
        if (error.response?.data.redirectUrl === "login") {
          window.location.href = `/${error.response?.data.redirectUrl}`;
        }
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTransaksi();
  }, []);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    // Define options for the date formatting
    const options: Intl.DateTimeFormatOptions = {
      month: "short", // Abbreviated month
      day: "numeric", // Day of the month
      year: "numeric", // Year
      hour: "numeric", // Hour
      minute: "numeric", // Minute
      hour12: true, // Use 12-hour time format (AM/PM)
    };

    // Format the date using Intl.DateTimeFormat
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };
  const sortedItems = useMemo(() => {
    return [...transaksi].sort((a, b) => {
      let first = a[sortDescriptor.column as keyof Transaksi];
      let second = b[sortDescriptor.column as keyof Transaksi];

      // // Special handling for the number
      if (sortDescriptor.column === "no") {
        first = transaksi.indexOf(a) + 1;
        second = transaksi.indexOf(b) + 1;
      } else if (sortDescriptor.column === "nama_pelanggan") {
        first = (first as string).toLowerCase();
        second = (second as string).toLowerCase();
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [transaksi, sortDescriptor]);

  const sortedDetail = useMemo(() => {
    return [...Detailtransaksi].sort((a, b) => {
      let first;
      let second;
      if (sortDetailDescriptor.column === "nama_menu") {
        first = a.Menu?.nama_menu?.toLowerCase() ?? ""; // Safely access nested property
        second = b.Menu?.nama_menu?.toLowerCase() ?? "";
      } else {
        // Handle other columns
        first = a[sortDetailDescriptor.column as keyof Detail_Transaksi];
        second = b[sortDetailDescriptor.column as keyof Detail_Transaksi];
      }
      // // Special handling for the number
      if (sortDetailDescriptor.column === "No") {
        first = Detailtransaksi.indexOf(a) + 1;
        second = Detailtransaksi.indexOf(b) + 1;
      } else if (sortDetailDescriptor.column === "nama_menu") {
        first = (first as string).toLowerCase();
        second = (second as string).toLowerCase();
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDetailDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [Detailtransaksi, sortDetailDescriptor]);
  const DateFiltered = useMemo(() => {
    return sortedItems.filter((item) => {
      const itemDate = new Date(item.tgl_transaksi);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      // Check if itemDate falls between the start and end dates
      if (!start && !end) {
        return true;
      }
      if (start && !end) {
        return itemDate >= start;
      }
      if (end && !start) {
        return itemDate <= end;
      }
      return itemDate >= start! && itemDate <= end!;
    });
  }, [endDate, sortedItems, startDate]);
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return DateFiltered.slice(start, end);
  }, [DateFiltered, page, rowsPerPage]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };
  const handleSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  };
  const handleDetailSortChange = (descriptor: SortDescriptor) => {
    setSortDetailDescriptor(descriptor);
  };
  const handleOpenModal = (item: Transaksi) => {
    setSelectedTransaksi(item);
    console.log(item.Detail_Transaksi);
    setDetailTransaksi(item.Detail_Transaksi);
    onOpen();
  };
  const handleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    // Implement logout logic here
    const response = await axios.post("/api/logout");
    console.log(response.headers.location);
    window.location.href = response.headers.location;
  };

  return (
    <div className="w-full h-full px-10 py-5 overflow-hidden bg-default-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex justify-between">
          <div>
            <label htmlFor="startDate">
              <pre>Start Date</pre>
            </label>
            <input
              onChange={(e) => {
                setstartDate(e.target.value);
              }}
              value={startDate}
              id="startDate"
              type="datetime-local"
              name="startDate"
            />
          </div>
          <Spacer x={5}></Spacer>
          <div>
            <label htmlFor="endDate">
              <pre>End Date</pre>
            </label>
            <input
              onChange={(e) => {
                setendDate(e.target.value);
              }}
              value={endDate}
              id="endDate"
              type="datetime-local"
              name="endDate"
            />
          </div>
        </div>
        <div className="flex justify-center">
          <Select
            label={<span className="text-default-900">Rows Per Page</span>}
            labelPlacement="outside"
            defaultSelectedKeys={["10"]}
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="w-40 "
            classNames={{
              base: "text-default-900",
              listbox: "text-default-900",
            }}
            disallowEmptySelection
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
      </div>

      <Spacer y={5}></Spacer>

      <div className="overflow-hidden ">
        <Table
          isHeaderSticky
          aria-label="Transaction history table"
          sortDescriptor={sortDescriptor}
          onSortChange={handleSortChange}
          className="max-h-[65vh]"
          classNames={{
            base: "max-h-[calc(100vh-200px)] overflow-y-auto",
            th: "bg-default-100 text-default-900 border-b border-divider",
            td: "text-default-900 border-b border-divider",
            thead: "text-default-900 [&>tr]:first:shadow-sm",
          }}
        >
          <TableHeader>
            <TableColumn className="text-sm" key="no" allowsSorting>
              No.
            </TableColumn>
            <TableColumn className="text-sm" key="tgl_transaksi" allowsSorting>
              Date
            </TableColumn>
            <TableColumn className="text-sm" key="nama_pelanggan" allowsSorting>
              Customer Name
            </TableColumn>
            <TableColumn className="text-sm" key="status" allowsSorting>
              Status
            </TableColumn>
            <TableColumn className="text-sm" key="total_harga" allowsSorting>
              Total
            </TableColumn>
            <TableColumn className="text-sm" key="more" allowsSorting={false}>
              More...
            </TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={"No Data"}
            items={paginatedItems}
            loadingContent={<Spinner label="Loading..." />}
            loadingState={loading ? "loading" : "idle"}
          >
            {(item) => {
              console.log(item.tgl_transaksi);

              return (
                <TableRow key={item.tgl_transaksi}>
                  <TableCell className="text-md">
                    {transaksi.indexOf(item) + 1}
                  </TableCell>
                  <TableCell className="text-md">
                    {formatDate(item.tgl_transaksi)}
                  </TableCell>
                  <TableCell className="text-md">
                    {item.nama_pelanggan.toLocaleUpperCase()}
                  </TableCell>
                  <TableCell className="text-md">
                    {item.status.toLocaleUpperCase()}
                  </TableCell>
                  <TableCell className="text-md">
                    {item.total_harga.toLocaleString("en-EN", {
                      style: "currency",
                      currency: "IDR",
                      notation: "compact",
                    })}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="lg"
                      className="bg-default-300"
                      onClick={() => handleOpenModal(item)}
                    >
                      VIEW DETAILS
                    </Button>
                  </TableCell>
                </TableRow>
              );
            }}
          </TableBody>
        </Table>
        <Spacer y={5}></Spacer>
      </div>
      <div className="flex justify-between">
        <Button
          style={{
            transitionTimingFunction: "cubic-bezier(0.33, 1.52, 0.6, 1)",
          }}
          color="danger"
          onClick={(event) => handleLogout(event)}
          className="sticky justify-start w-auto px-4 mt-auto bottom-4 hover:scale-110 "
          startContent={<LogOut size={24} className="mr-2" />}
        >
          Log Out
        </Button>
        <Pagination
          total={Math.ceil(DateFiltered.length / rowsPerPage)}
          initialPage={page}
          page={page}
          onChange={handlePageChange}
          loop
          showControls
        />
      </div>
      <Spacer y={5}></Spacer>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-default-900">
                Transaction Details
              </ModalHeader>
              <ModalBody>
                {selectedTransaksi && (
                  <Table
                    aria-label="Transaction details table"
                    sortDescriptor={sortDetailDescriptor}
                    onSortChange={handleDetailSortChange}
                    classNames={{
                      base: "max-h-[calc(100vh-200px)] overflow-y-auto",
                      th: "bg-default-100 text-default-900 border-b border-divider",
                      td: "text-default-900 border-b border-divider",
                      thead: "text-default-900 [&>tr]:first:shadow-sm",
                    }}
                  >
                    <TableHeader>
                      <TableColumn allowsSorting key="No">
                        No
                      </TableColumn>
                      <TableColumn allowsSorting key="nama_menu">
                        Menu
                      </TableColumn>
                      <TableColumn allowsSorting key="jumlah">
                        Quantity
                      </TableColumn>
                      <TableColumn allowsSorting key="total_harga">
                        Total Price
                      </TableColumn>
                    </TableHeader>
                    <TableBody items={sortedDetail}>
                      {(item) => {
                        return (
                          <TableRow
                            key={selectedTransaksi.Detail_Transaksi.indexOf(
                              item
                            )}
                          >
                            <TableCell>
                              {selectedTransaksi.Detail_Transaksi.indexOf(
                                item
                              ) + 1}
                            </TableCell>
                            <TableCell>{item.Menu.nama_menu}</TableCell>
                            <TableCell>{item.jumlah}</TableCell>
                            <TableCell>
                              {item.total_harga.toLocaleString("en-EN", {
                                style: "currency",
                                currency: "IDR",
                                notation: "compact",
                              })}
                            </TableCell>
                          </TableRow>
                        );
                      }}
                    </TableBody>
                  </Table>
                )}
              </ModalBody>
              <ModalFooter>
                <Button className="text-md bg-danger-400" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
