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

interface Transaksi {
  tgl_transaksi: string;
  nama_pelanggan: string;
  status: string;
  total_harga: number;
  Detail_Transaksi: Detail_Transaksi[];
}
interface Detail_Transaksi {
  Menu: Menu;
  jumlah: number;
  total_harga: number;
}
interface Menu {
  id_menu: number;
  nama_menu: string;
  jenis: Jenis; // Assuming `Jenis` is an enum or another type
  deskripsi?: string;
  gambar?: string; // Representing the LONGBLOB as a base64 string or URL if required
  harga: number;
  date_added: Date;
}
enum Jenis {
  FOOD = "FOOD",
  BEVERAGE = "BEVERAGE",
  // Add more as needed
}
export default function HistoryTable() {
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "tgl_transaksi",
    direction: "ascending",
  });
  const [loading, setLoading] = useState(true);
  const [selectedTransaksi, setSelectedTransaksi] = useState<Transaksi | null>(
    null
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const fetchTransaksi = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/cashier/transaction/getTransaksi");
      setTransaksi(response.data.Transaksi);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching transaksi:", error.message);
        console.error(error);
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
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
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

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedItems.slice(start, end);
  }, [sortedItems, page, rowsPerPage]);
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
  const handleOpenModal = (item: Transaksi) => {
    setSelectedTransaksi(item);
    onOpen();
  };
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Select
          label="Rows Per Page"
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className="w-40 border-divider border-5 rounded-lg "
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
        <div className="flex justify-center">
        <Pagination
          total={Math.ceil(sortedItems.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          loop
          showControls
        />
      </div>
      </div>
      <Spacer y={5}></Spacer>
      <div className="overflow-hidden border rounded-lg border-divider">
        <Table
          isHeaderSticky
          aria-label="Transaction history table"
          sortDescriptor={sortDescriptor}
          onSortChange={handleSortChange}
          className="max-h-[65vh]"
          classNames={{
            base: "max-h-[calc(100vh-200px)] overflow-y-auto",
            th: "bg-default-100 text-default-700 border-b border-divider",
            td: " border-b border-divider",
            thead: "[&>tr]:first:shadow-sm",
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
            {(item) => (
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
                  <Button size="lg" onClick={() => handleOpenModal(item)}>
                    VIEW DETAILS
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Spacer y={5}></Spacer>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Transaction Details
              </ModalHeader>
              <ModalBody>
                {selectedTransaksi && (
                  <Table aria-label="Transaction details table">
                    <TableHeader>
                      <TableColumn>Menu</TableColumn>
                      <TableColumn>Quantity</TableColumn>
                      <TableColumn>Total Price</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {selectedTransaksi.Detail_Transaksi.map(
                        (detail, index) => (
                          <TableRow key={index}>
                            <TableCell>{detail.Menu.nama_menu}</TableCell>
                            <TableCell>{detail.jumlah}</TableCell>
                            <TableCell>
                              {detail.total_harga.toLocaleString("en-EN", {
                                style: "currency",
                                currency: "IDR",
                                notation: "compact",
                              })}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
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
