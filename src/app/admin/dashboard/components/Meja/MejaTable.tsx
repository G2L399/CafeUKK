"use client"

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Spacer,
  Spinner,
  SortDescriptor
} from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import AddMeja from "./AddMeja";
import EditMeja from "./EditMeja";
import { Meja } from "@/lib/types";

const MejaTable = () => {
  const [meja, setMeja] = useState<Meja[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "NO",
    direction: "ascending"
  });

  const fetchMeja = async () => {
    try {
      const response = await axios.get("/api/admin/Meja/getMeja");
      setMeja(response.data.Meja);
    } catch (error) {
      console.error("Failed to fetch Meja:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeja();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/admin/Meja/deleteMeja/${id}`);
      setMeja(meja.filter((item) => item.id_meja !== id));
    } catch (error) {
      console.error("Failed to delete Meja:", error);
    }
  };

  const sortedMeja = useCallback(() => {
    return [...meja].sort((a, b) => {
      const first = sortDescriptor.column === "NO" ? meja.indexOf(a) : a.nomor_meja;
      const second = sortDescriptor.column === "NO" ? meja.indexOf(b) : b.nomor_meja;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [meja, sortDescriptor]);

  const onSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  };

  return (
    <div>
      <Table 
        aria-label="Meja table" 
        sortDescriptor={sortDescriptor} 
        onSortChange={onSortChange}
      >
        <TableHeader>
          <TableColumn key="NO" allowsSorting>NO</TableColumn>
          <TableColumn key="NOMOR_MEJA" allowsSorting>NOMOR MEJA</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          items={sortedMeja()}
          emptyContent={
            loading ? (
              <>
                <Spinner aria-label="loading" />
                <div>Loading...</div>
              </>
            ) : (
              <span className="text-xl">No data available</span>
            )
          }
        >
          {(item) => (
            <TableRow key={item.id_meja}>
              <TableCell className="text-xl">
                {meja.indexOf(item) + 1}
              </TableCell>
              <TableCell
                style={{
                  wordBreak: "break-all",
                  whiteSpace: "normal",
                }}
                className="text-xl w-auto max-w-72"
              >
                {item.nomor_meja}
              </TableCell>
              <TableCell className="flex text-xl">
                <EditMeja Meja={item} refreshMeja={fetchMeja} />
                <Spacer x={5} />
                <Button
                  className="text-lg hover:scale-110"
                  style={{
                    transitionTimingFunction:
                      "cubic-bezier(0.33, 1.52, 0.6, 1)",
                  }}
                  color="danger"
                  size="lg"
                  onClick={() => handleDelete(item.id_meja)}
                >
                  Delete Meja
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Spacer y={5} />
      <AddMeja refreshMeja={fetchMeja} />
      <Spacer y={5} />
    </div>
  );
};

export default MejaTable;