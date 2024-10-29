import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { Detail_Transaksi, Transaksi } from "./types";
import { TDocumentDefinitions } from "pdfmake/interfaces";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleExportPDF = (
  items: Detail_Transaksi[],
  selectedTransaksi: Transaksi
) => {
  // Define document structure
  const docDefinition: TDocumentDefinitions = {
    content: [
      { text: "RECEIPT", style: "header", alignment: "center" },
      {
        text: `Transaction ID: ${selectedTransaksi?.id_transaksi}`,
        style: "subheader",
        margin: [0, 10, 0, 20],
      },

      // Table
      {
        table: {
          headerRows: 1,
          widths: ["*", 40, 60, 80], // Set custom widths for columns
          body: [
            // Table header
            [
              { text: "Item(s)", style: "tableHeader" },
              { text: "Quantity", style: "tableHeader", alignment: "center" },
              { text: "Price", style: "tableHeader", alignment: "right" },
              { text: "Total", style: "tableHeader", alignment: "right" },
            ],
            // Table rows for each item
            ...items.map((item) => [
              item.Menu.nama_menu,
              { text: `${item.jumlah}`, alignment: "center" },
              {
                text: item.Menu.harga.toLocaleString("en-EN", {
                  style: "currency",
                  currency: "IDR",
                  notation: "compact",
                }),
                alignment: "right",
              },
              {
                text: item.total_harga.toLocaleString("en-EN", {
                  style: "currency",
                  currency: "IDR",
                  notation: "compact",
                }),
                alignment: "right",
              },
            ]),
          ],
        },
        layout: {
          fillColor: function (rowIndex: number) {
            return rowIndex % 2 === 0 ? "#F5F5F5" : null;
          },
          hLineWidth: function () {
            return 0.5;
          },
          vLineWidth: function () {
            return 0.5;
          },
        },
      },

      // Total Price Section
      {
        columns: [
          { text: "Total Price", style: "totalLabel", width: "*" },
          {
            text: selectedTransaksi?.total_harga.toLocaleString("en-EN", {
              style: "currency",
              currency: "IDR",
              notation: "compact",
            }),
            style: "totalValue",
            alignment: "right",
            width: 100,
          },
        ],
        margin: [0, 10],
      },

      // Customer and Cashier Info
      {
        text: `Customer Name: ${selectedTransaksi?.nama_pelanggan}`,
        margin: [0, 10, 0, 2],
      },
      {
        text: `Cashier Name: ${selectedTransaksi?.User?.nama_user}`,
        margin: [0, 2, 0, 20],
      },

      // Footer
      {
        text: "Thank you for your purchase!",
        style: "footer",
        alignment: "center",
        margin: [0, 20, 0, 5],
      },
      { text: "Please come again!", style: "footer", alignment: "center" },
    ],

    // Styles
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
      subheader: {
        fontSize: 12,
        bold: true,
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: "black",
      },
      totalLabel: {
        bold: true,
        fontSize: 12,
      },
      totalValue: {
        bold: true,
        fontSize: 12,
      },
      footer: {
        italics: true,
        fontSize: 10,
      },
    },

    // Page size and margins
    pageSize: "A4",
    pageMargins: [40, 60, 40, 60], // Left, Top, Right, Bottom
  };

  // Generate the PDF
  pdfMake
    .createPdf(docDefinition)
    .download(`transaction_${selectedTransaksi?.id_transaksi}.pdf`);
};
