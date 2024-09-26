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

export default function AddMeja({ refreshMeja }: { refreshMeja: () => void }) {
  const [formData, setFormData] = useState({
    nomor_meja: "",
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleSubmit = async () => {
    try {
      // Create a new object with Base64 image data
      const data = {
        ...formData,
      };
      console.log("erm");

      await axios.post("/api/admin/Meja/addMeja", data, {
        headers: {
          "Content-Type": "application/json", // Set content type for JSON
        },
      });

      refreshMeja(); // Refresh menu data after adding
      onOpenChange(); // Close modal
    } catch (error) {
      console.error("Failed to add menu:", error);
    }
  };

  return (
    <>
      <Button
        className="text-xl hover:scale-110"
        style={{
          transitionTimingFunction: "cubic-bezier(0.33, 1.52, 0.6, 1)",
        }}
        color="success"
        size="lg"
        onPress={onOpen}
      >
        Add Meja
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
                Add New Meja
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
