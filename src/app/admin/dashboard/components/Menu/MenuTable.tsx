// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableColumn,
//   TableRow,
//   TableCell,
//   Button,
// } from "@nextui-org/react";
// import axios from "axios";
// import { useEffect, useState } from "react";

// interface Food {
//   id_menu: number;
//   nama_menu: string;
//   jenis: string; // Adjust according to your Jenis type
//   deskripsi?: string;
//   gambar?: string; // Assuming the gambar field is a Bytes array
//   harga: number;
// }

// const FoodTable = () => {
//   const [foods, setFoods] = useState<Food[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFoods = async () => {
//       try {
//         const response = await axios.get("/api/admin/getMenu");
//         console.log(response.data.Menu);

//         setFoods(response.data.Menu);
//       } catch (error) {
//         console.error("Failed to fetch foods:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFoods();
//   }, []);

//   const handleDelete = async (id: number) => {
//     await axios.delete(`/api/admin/menu/deleteMenu/${id}`);
//     setFoods(foods.filter((food) => food.id_menu !== id));
//   };

//   const renderImage = (base64String?: string) => {
//     if (!base64String) return undefined;
//     return `data:image/jpeg;base64,${base64String}`;
//   };

//   return (
//     <div>
//       <Table aria-label="Food Menu">
//         <TableHeader>
//           <TableColumn aria-label="ID">ID</TableColumn>
//           <TableColumn aria-label="Name">Name</TableColumn>
//           <TableColumn aria-label="Type">Type</TableColumn>
//           <TableColumn aria-label="Description">Description</TableColumn>
//           <TableColumn aria-label="Image">Image</TableColumn>
//           <TableColumn aria-label="Price">Price</TableColumn>
//           <TableColumn aria-label="Actions">Actions</TableColumn>
//         </TableHeader>
//         <TableBody>
//           {loading ? (
//             <TableRow aria-label="loading">
//               <TableCell aria-label="loading">Loading...</TableCell>
//               <TableCell aria-label="loading">Loading...</TableCell>
//               <TableCell aria-label="loading">Loading...</TableCell>
//               <TableCell aria-label="loading">Loading...</TableCell>
//               <TableCell aria-label="loading">Loading...</TableCell>
//               <TableCell aria-label="loading">Loading...</TableCell>
//               <TableCell aria-label="loading">Loading...</TableCell>
//             </TableRow>
//           ) : (
//             foods.map((food) => (
//               <TableRow aria-label="table row" key={food.id_menu}>
//                 <TableCell aria-label="id">{food.id_menu}</TableCell>
//                 <TableCell aria-label="name">{food.nama_menu}</TableCell>
//                 <TableCell aria-label="type">{food.jenis}</TableCell>
//                 <TableCell aria-label="description">{food.deskripsi || 'N/A'}</TableCell>
//                 <TableCell aria-label="image">
//                   {food.gambar ? (
//                     <img src={renderImage(food.gambar)} alt={food.nama_menu} style={{ width: 50, height: 50 }} />
//                   ) : (
//                     "No Image"
//                   )}
//                 </TableCell>
//                 <TableCell aria-label="price">{food.harga}</TableCell>
//                 <TableCell aria-label="actions">
//                   <Button
//                     color="danger"
//                     size="lg"
//                     className="me-5"
//                     aria-label="delete"
//                     onClick={() => handleDelete(food.id_menu)}
//                   >
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// export default FoodTable;
"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Spacer,
  Pagination,
  Spinner,
  Select,
  SelectItem,
  SortDescriptor,
} from "@nextui-org/react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import AddMenu from "./AddMenu";
import EditMenu from "./EditMenu";
import { Menu as Food } from "@/lib/types";

export default function FoodTable() {
  useEffect(() => {
    fetchFoods();
  }, []);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [focusedImage, setFocusedImage] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [accessDenied, setAccessDenied] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });


  const refreshMenu = () => {
    fetchFoods();
  };
  const fetchFoods = async () => {
    try {
      const response = await axios.get("/api/admin/Menu/getMenu");
      setFoods(response.data.Menu);
    } catch (error) {
      console.error("Failed to fetch foods:", error);
      setAccessDenied(true);
      console.log("nigger");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  };
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/admin/Menu/deleteMenu/${id}`);
      setFoods(foods.filter((food) => food.id_menu !== id));
    } catch (error) {
      console.error("Failed to delete food:", error);
    }
  };

  const renderImage = (base64String?: string) => {
    if (!base64String) return undefined;
    return `data:image/jpeg;base64,${base64String}`;
  };

  const handleImageClick = (imageSrc: string) => {
    setFocusedImage(imageSrc);
    onOpen();
  };
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  function formatToRupiah(value: number): string {
    return new Intl.NumberFormat("en-EN", {
      style: "currency",
      currency: "IDR",
      notation: "scientific",
    }).format(value);
  }
  const sortedFood = useMemo(() => {
    
    return [...foods].sort((a, b) => {
      let first = a[sortDescriptor.column as keyof Food];
      let second = b[sortDescriptor.column as keyof Food];
      if (first === undefined && second === undefined) return 0;
      if (first === undefined) return 1; // Treat undefined as greater than any defined value
      if (second === undefined) return -1; // Treat defined values as less than undefined
      if (sortDescriptor.column === "no") {
        first = foods.indexOf(a) + 1;
        second = foods.indexOf(b) + 1;
      }
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      console.log(sortDescriptor.column);
      
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [foods, sortDescriptor]);

  const currentFoods = useMemo(() => {
    if (rowsPerPage === sortedFood.length) {
      return sortedFood;
    }
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    
    return sortedFood.slice(start, end);
  }, [sortedFood, currentPage, rowsPerPage]);
  return (
    <>
      {accessDenied ? (
        <div>An Error Occurred: Either Server Side or Access Denied</div>
      ) : (
        <div className="container">
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
          <Spacer y={5}></Spacer>
          <Table
            sortDescriptor={sortDescriptor}
            onSortChange={handleSortChange}
            isHeaderSticky
            className="max-h-[70vh]"
            classNames={{
              base: "max-h-[calc(100vh-200px)] overflow-y-auto",
              th: "bg-default-100 text-default-900 border-b border-divider",
              td: "text-default-900 border-b border-divider",
              thead: "text-default-900 [&>tr]:first:shadow-sm",
            }}
            aria-label="Food Menu"
          >
            <TableHeader className="text-2xl text-bold">
              <TableColumn allowsSorting key="no" aria-label="No">
                NO
              </TableColumn>
              <TableColumn aria-label="Image">IMAGE</TableColumn>
              <TableColumn allowsSorting key="name" aria-label="Name">
                NAME
              </TableColumn>
              <TableColumn aria-label="Type">TYPE</TableColumn>
              <TableColumn aria-label="Description">DESCRIPTION</TableColumn>
              <TableColumn allowsSorting aria-label="Price">PRICE</TableColumn>
              <TableColumn aria-label="Actions">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent="No rows to display."
              loadingContent={
                <div>
                  <Spinner aria-label="loading" />
                  <div>Loading...</div>
                </div>
              }
              items={currentFoods}
              loadingState={loading ? "loading" : "idle"}
            >
              {(item) => (
                <TableRow key={item.id_menu}>
                  <TableCell className="text-xl">
                    {foods.indexOf(item) + 1}
                  </TableCell>
                  <TableCell className="text-xl">
                    <div
                      className="flex items-center justify-center relative w-[auto] h-[auto] py-7"
                      style={{
                        transitionTimingFunction:
                          "cubic-bezier(0.33, 1.52, 0.6, 1)",
                      }}
                    >
                      {item.gambar ? (
                        <Image
                          src={renderImage(item.gambar) || "/placeholder.svg"}
                          alt={item.nama_menu}
                          className="w-[100%] h-[auto] overflow-hidden transition-transform duration-200 object-contain cursor-pointer hover:scale-110 max-w-44 outline-4 outline-black outline dark:outline-none outline-offset-0"
                          onClick={() =>
                            handleImageClick(renderImage(item.gambar) || "")
                          }
                          width={0} // Ensure to set a width
                          height={0} // Ensure to set a height
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-200">
                          No Image
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xl">{item.nama_menu}</TableCell>
                  <TableCell className="text-xl">{item.jenis}</TableCell>
                  <TableCell className="w-auto text-xl max-w-72">
                    {item.deskripsi || "N/A"}
                  </TableCell>
                  <TableCell className="text-xl">
                    {formatToRupiah(item.harga)}
                  </TableCell>
                  <TableCell>
                    <EditMenu refreshMenus={refreshMenu} menu={item} />
                    <Spacer y={5} />
                    <Button
                      className="text-lg hover:scale-110 bg-danger-500"
                      style={{
                        transitionTimingFunction:
                          "cubic-bezier(0.33, 1.52, 0.6, 1)",
                      }}
                      size="lg"
                      onClick={() => handleDelete(item.id_menu)}
                    >
                      Delete Menu Button
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Modal isOpen={isOpen} onClose={onClose} size="xl" backdrop="blur">
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1">
                Food Image
              </ModalHeader>
              <ModalBody>
                {focusedImage && (
                  <div className="pb-4">
                    <Image
                      src={focusedImage}
                      className="outline-none outline-4 outline-black outline-offset-0"
                      alt="Focused food image"
                      width={800}
                      height={600}
                      layout="responsive"
                      objectFit="contain"
                    />
                  </div>
                )}
              </ModalBody>
            </ModalContent>
          </Modal>

          <Spacer y={5} />
          <div className="flex justify-between pb-3">
            <AddMenu refreshMenus={refreshMenu} />
            <div className="flex justify-center mb-4">
              <Pagination
                total={Math.ceil(foods.length / rowsPerPage)}
                initialPage={currentPage}
                onChange={(page) => setCurrentPage(page)}
                page={currentPage}
                size={"lg"}
                showControls={true}
                loop={true}
                isCompact={true}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
