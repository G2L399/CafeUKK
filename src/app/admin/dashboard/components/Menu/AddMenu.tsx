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
} from "@nextui-org/react";
import axios from "axios";
import Image from "next/image";
import { Jenis } from "@/lib/types";
export default function AddMenu({
  refreshMenus,
}: {
  refreshMenus: () => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [formData, setFormData] = useState({
    nama_menu: "",
    jenis: Jenis.Food || Jenis.Drinks, // default value
    deskripsi: "",
    harga: 0,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null); // To store image preview
  const [imageBase64, setImageBase64] = useState<string | null>(null); // To store image Base64 string

  // Handle image file selection and conversion to Base64
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
      console.log("erm");
      console.log(data);

      await axios.post("/api/admin/Menu/addMenu", data, {
        headers: {
          "Content-Type": "application/json", // Set content type for JSON
        },
      });

      refreshMenus(); // Refresh menu data after adding
      onOpenChange(); // Close modal
    } catch (error) {
      console.error("Failed to add menu:", error);
    }
  };

  return (
    <>
      <Button
        className="text-xl tran hover:scale-110 bg-success"
        style={{
          transitionTimingFunction: "cubic-bezier(0.33, 1.52, 0.6, 1)",
        }}
        size="lg"
        onPress={onOpen}
      >
        Add Menu
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
                Add New Menu Item
              </ModalHeader>
              <ModalBody>
                <div className="flex gap-4">
                  <div className="w-2/3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{
                        cursor: "pointer",
                      }}
                    />

                    <Spacer x={5} />
                    {imagePreview && (
                      <>
                        <Spacer y={1} />
                        <Image
                          src={imagePreview}
                          alt="Image preview"
                          style={{
                            width: "100%",
                            maxHeight: "250px",
                            objectFit: "contain",
                          }}
                          width={100}
                          height={0}
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
                      defaultSelectedKeys={["Foods"]}
                      onSelectionChange={(key) => {
                        const currentKey = Array.from(key)[0] as Jenis;
                        setFormData({ ...formData, jenis: currentKey });
                      }}
                    >
                      <SelectItem key="Foods">Food</SelectItem>
                      <SelectItem key="Drinks">Drink</SelectItem>
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
                      min={1}
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
                <Button color="danger" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
