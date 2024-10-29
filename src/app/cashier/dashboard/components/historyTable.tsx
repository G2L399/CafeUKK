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
import { Detail_Transaksi, Transaksi } from "@/lib/types";
import { handleExportPDF } from "@/lib/utils";
export default function HistoryTable() {
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
  const fetchTransaksi = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/cashier/transaction/getTransaksi");
      console.log(response);

      setTransaksi(response.data.Transaksi);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching transaksi:", error.message);
        console.error(error.response);
        if (error.response?.status === 305) {
          window.location.href = `/${error.response?.data.redirectUrl}`;
        }
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };
  const changestatus = async (id: number) => {
    await axios.post("/api/cashier/transaction/changeStatus/" + id);
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
      if (sortDetailDescriptor.column === "no") {
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
  const handleDetailSortChange = (descriptor: SortDescriptor) => {
    setSortDetailDescriptor(descriptor);
  };
  const handleOpenModal = (item: Transaksi) => {
    setSelectedTransaksi(item);
    setDetailTransaksi(item.Detail_Transaksi);
    onOpen();
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Select
          label={<span className="text-default-900">Rows Per Page</span>}
          labelPlacement="outside"
          defaultSelectedKeys={["10"]}
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className="w-40 "
          classNames={{
            base: "",
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
                <TableCell className="flex flex-row">
                  <Button
                    className="bg-default-300 "
                    size="lg"
                    onClick={() => handleOpenModal(item)}
                  >
                    <span className="">VIEW DETAILS</span>
                  </Button>
                  <Spacer x={5}></Spacer>
                  {item.status.toLowerCase() === "unpaid" ? (
                    <Button
                      className="bg-default-300 "
                      size="lg"
                      onClick={() => {
                        Promise.resolve(changestatus(item.id_transaksi)).then(
                          () => {
                            fetchTransaksi();
                          }
                        );
                      }}
                    >
                      Paid
                    </Button>
                  ) : (
                    <></>
                  )}
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
                  <Table
                    aria-label="Transaction details table"
                    sortDescriptor={sortDetailDescriptor}
                    onSortChange={handleDetailSortChange}
                    classNames={{
                      th: "border-b border-divider",
                      td: "border-b border-divider",
                    }}
                  >
                    <TableHeader>
                      <TableColumn allowsSorting key="no">
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
              <ModalFooter className="flex justify-between">
                {selectedTransaksi?.status.toLowerCase() === "belum_bayar" ? (
                  <></>
                ) : (
                  <Button
                    className="text-md bg-primary-400"
                    onClick={() =>
                      handleExportPDF(sortedDetail, selectedTransaksi!)
                    }
                  >
                    Export
                  </Button>
                )}
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
