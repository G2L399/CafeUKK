import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";

export default function HistoryTable() {
  const [Transaksi, setTransaksi] = useState();
  const FetchTransaksi = async () => {
    try {
      const response = await axios.get("/api/cashier/transaction/getTransaksi");
      setTransaksi(response.data.Transaksi);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching transaksi:", error.message);
        console.error(error);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    FetchTransaksi();
  }, []);
  useEffect(() => {
    console.log(Transaksi);
  }, [Transaksi]);
  return <div>historyTable</div>;
}
