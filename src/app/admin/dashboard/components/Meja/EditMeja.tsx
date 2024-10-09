"use client";
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
} from "@nextui-org/react";
import axios from "axios";
interface Meja {
  id_meja: number;
  nomor_meja: string;
}
export default function EditMeja({
  Meja,
  refreshMeja,
}: {
  Meja: Meja;
  refreshMeja: () => void;
}) {
  const [formData, setFormData] = useState({
    nomor_meja: Meja.nomor_meja,
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleSubmit = async () => {
    try {
      // Create a new object with Base64 image data
      const data = {
        ...formData,
      };
      console.log("erm");

      await axios.put("/api/admin/Meja/editMeja/" + Meja.id_meja, data, {
        headers: {
          "Content-Type": "application/json", // Set content type for JSON
        },
      });

      refreshMeja(); // Refresh Meja data after editing
      onOpenChange(); // Close modal
    } catch (error) {
      console.error("Failed to edit menu:", error);
    }
  };

  return (
    <>
      <Button
        className="text-xl hover:scale-110 bg-primary-500"
        style={{
          transitionTimingFunction: "cubic-bezier(0.33, 1.52, 0.6, 1)",
        }}
        size="lg"
        onPress={onOpen}
      >
        Edit Meja With ID {Meja.id_meja}
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit New Meja
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Nomor Meja"
                  placeholder="Enter Nomor Meja"
                  value={formData.nomor_meja}
                  onChange={(e) =>
                    setFormData({ ...formData, nomor_meja: e.target.value })
                  }
                />
                <Spacer y={1} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  Edit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
