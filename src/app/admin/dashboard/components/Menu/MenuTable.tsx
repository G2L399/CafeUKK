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
} from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import AddMenu from "./AddMenu";
import EditMenu from "./EditMenu";
interface Food {
  id_menu: number;
  nama_menu: string;
  jenis: "Food" | "Beverage";
  deskripsi: string;
  gambar: string;
  harga: number;
  date_added: string | Date;
}

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
  // Calculate the data for the current page
  const indexOfLastFood = currentPage * rowsPerPage;
  const indexOfFirstFood = indexOfLastFood - rowsPerPage;
  const currentFoods = foods.slice(indexOfFirstFood, indexOfLastFood);

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
              <TableColumn aria-label="No">NO</TableColumn>
              <TableColumn aria-label="Image">IMAGE</TableColumn>
              <TableColumn aria-label="Name">NAME</TableColumn>
              <TableColumn aria-label="Type">TYPE</TableColumn>
              <TableColumn aria-label="Description">DESCRIPTION</TableColumn>
              <TableColumn aria-label="Price">PRICE</TableColumn>
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
              loadingState={loading ? "loading" : "idle"}
            >
              {currentFoods.map((food) => (
                <TableRow key={food.id_menu}>
                  <TableCell className="text-xl">
                    {foods.indexOf(food) + 1}
                  </TableCell>
                  <TableCell className="text-xl">
                    <div
                      className="relative overflow-hidden transition-transform duration-200 rounded-lg w-44 h-44 hover:scale-110"
                      style={{
                        transitionTimingFunction:
                          "cubic-bezier(0.33, 1.52, 0.6, 1)",
                      }}
                    >
                      {food.gambar ? (
                        <Image
                          src={renderImage(food.gambar) || "/placeholder.svg"}
                          alt={food.nama_menu}
                          className="flex items-center justify-center w-[200px] h-[200px] overflow-hidden object-contain cursor-pointer"
                          onClick={() =>
                            handleImageClick(renderImage(food.gambar) || "")
                          }
                          width={200} // Ensure to set a width
                          height={200} // Ensure to set a height
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-200">
                          No Image
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xl">{food.nama_menu}</TableCell>
                  <TableCell className="text-xl">{food.jenis}</TableCell>
                  <TableCell className="text-xl w-72">
                    {food.deskripsi || "N/A"}
                  </TableCell>
                  <TableCell className="text-xl">
                    {formatToRupiah(food.harga)}
                  </TableCell>
                  <TableCell>
                    <EditMenu refreshMenus={refreshMenu} menu={food} />
                    <Spacer y={5} />
                    <Button
                      className="text-lg hover:scale-110 bg-danger-500"
                      style={{
                        transitionTimingFunction:
                          "cubic-bezier(0.33, 1.52, 0.6, 1)",
                      }}
                      size="lg"
                      onClick={() => handleDelete(food.id_menu)}
                    >
                      Delete Menu Button
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="xl"
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            backdrop="blur"
          >
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1">
                Food Image
              </ModalHeader>
              <ModalBody>
                {focusedImage && (
                  <Image
                    src={focusedImage}
                    alt="Focused food image"
                    width={800}
                    height={600}
                    layout="responsive"
                    objectFit="contain"
                  />
                )}
              </ModalBody>
            </ModalContent>
          </Modal>

          <Spacer y={5} />
          <div className="flex justify-between">
            <AddMenu refreshMenus={refreshMenu} />
            {/* Pagination Controls */}
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
