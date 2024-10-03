import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Spacer,
  Spinner
} from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import AddMeja from "./AddMeja";
import EditMeja from "./EditMeja";
interface Meja {
  id_meja: number;
  nomor_meja: string;
}

const MejaTable = () => {
  const [meja, setMeja] = useState<Meja[]>([]);
  const [loading, setLoading] = useState(true);
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
    await axios.delete(`/api/admin/Meja/deleteMeja/${id}`);
    setMeja(meja.filter((item) => item.id_meja !== id));
  };

  return (
    <div>
      <Table aria-label="table">
        <TableHeader aria-label="table header">
          <TableColumn aria-label="NO">NO</TableColumn>
          <TableColumn aria-label="ID">ID</TableColumn>
          <TableColumn aria-label="NOMOR MEJA">NOMOR MEJA</TableColumn>
          <TableColumn aria-label="ACTIONS">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          aria-label="table body"
          emptyContent={
            loading ? (<>
            <Spinner aria-label="loading" />
              <span className="text-xl">loading...</span>
            </>
            ) : (
              <span className="text-xl">No data available</span>
            )
          }
        >
          {meja.map((item) => (
            <TableRow key={item.id_meja} aria-label="table row">
              <TableCell aria-label="NO" className="text-xl">
                {meja.indexOf(item) + 1}
              </TableCell>
              <TableCell aria-label="ID" className="text-xl">
                {item.id_meja}
              </TableCell>
              <TableCell
                style={{
                  width: "500px",
                  wordBreak: "break-all",
                  whiteSpace: "normal",
                }}
                aria-label="NOMOR MEJA"
                className="text-xl"
              >
                {item.nomor_meja}
              </TableCell>
              <TableCell aria-label="DELETE" className="text-xl">
                <EditMeja Meja={item} refreshMeja={fetchMeja} />
                <Spacer y={5} />
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
                  Delete Meja With ID {item.id_meja}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Spacer y={5} />
      <AddMeja refreshMeja={fetchMeja} />
    </div>
  );
};

export default MejaTable;
