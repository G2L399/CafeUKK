/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Spacer,
  useDisclosure,
  Select,
  SelectItem,
  Image,
} from "@nextui-org/react";
import axios from "axios";
import { Menu } from "@/lib/types";
export default function EditMenu({
  refreshMenus,
  menu,
}: {
  refreshMenus: () => void;
  menu: Menu;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [formData, setFormData] = useState({
    nama_menu: menu.nama_menu,
    jenis: menu.jenis, // default value
    deskripsi: menu.deskripsi,
    harga: menu.harga,
    gambar: menu.gambar,
  });
  const formatBase64Image = (base64: string | undefined): string | undefined => {
    if (!base64) return undefined;
    // Check if the string already has the data URL prefix
    if (base64.startsWith("data:image")) {
      return base64;
    }
    // If not, assume it's a JPEG and prepend the necessary prefix
    return `data:image/jpeg;base64,${base64}`;
  };
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    formatBase64Image(formData.gambar) // Call the function to format the base64 string
  ); // To store image preview
  const [imageBase64, setImageBase64] = useState<string | undefined>(
    formData.gambar
  ); // To store image Base64 string

  // Handle image file selection and conversion to Base64
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(imagePreview);

    if (file) {
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Convert the image to Base64 and store it
      const toBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });

      const base64String = await toBase64(file);
      setImageBase64(base64String.split(",")[1]); // Remove data URL part
    }
  };
  const handleSubmit = async () => {
    try {
      // Create a new object with Base64 image data
      const data = {
        ...formData,
        gambar: imageBase64,
      };

      await axios.put("/api/admin/Menu/editMenu/" + menu.id_menu, data, {
        headers: {
          "Content-Type": "application/json", // Set content type for JSON
        },
      });

      refreshMenus(); // Refresh menu data after editing
      onOpenChange(); // Close modal
    } catch (error) {
      console.error("Failed to edit menu:", error);
    }
  };
  return (
    <>
      <Button
        className="mr-5 text-lg hover:scale-110 bg-primary-500"
        style={{
          transitionTimingFunction: "cubic-bezier(0.33, 1.52, 0.6, 1)",
        }}
        size="lg"
        onPress={onOpen}
      >
        Edit Menu
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Menu Button
              </ModalHeader>
              <ModalBody>
                <div className="flex gap-4">
                  <div className="w-2/3">
                    <Input
                      type="file"
                      label="Image"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {imagePreview && (
                      <>
                        <Spacer y={1} />
                        <Image
                          src={imagePreview}
                          alt="Image preview"
                          width={0}
                          height={0}
                          className="!w-full"
                          style={{
                            objectFit: "contain",
                          }}
                        />
                      </>
                    )}
                  </div>
                  <div className="w-2/3 space-y-4">
                    <Input
                      label="Name"
                      placeholder="Enter menu name"
                      value={formData.nama_menu}
                      onChange={(e) =>
                        setFormData({ ...formData, nama_menu: e.target.value })
                      }
                    />
                    <Spacer y={1} />
                    <Select
                      label="Type"
                      placeholder="Select type"
                      defaultSelectedKeys={["Food"]}
                      onSelectionChange={(key: any) =>
                        setFormData({ ...formData, jenis: key.currentKey })
                      }
                    >
                      <SelectItem key="Food">Food</SelectItem>
                      <SelectItem key="Beverage">Beverage</SelectItem>
                    </Select>
                    <Spacer y={1} />
                    <Input
                      label="Description"
                      placeholder="Enter description"
                      value={formData.deskripsi}
                      onChange={(e) =>
                        setFormData({ ...formData, deskripsi: e.target.value })
                      }
                    />
                    <Spacer y={1} />
                    <Input
                      type="number"
                      label="Price"
                      placeholder="Enter price"
                      value={formData.harga.toString()}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          harga: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                    <Spacer y={1} />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  Edit {menu.nama_menu}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
