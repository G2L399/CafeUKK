import { useState, useEffect } from "react";
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
import bcrypt from "bcryptjs";
import { Edit } from "lucide-react";

interface User {
  id_user: number;
  nama_user: string;
  username: string;
  password: string;
  role: string;
}
export default function EditUser({
  user,
  refreshUsers,
}: {
  user: User;
  refreshUsers: () => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [formData, setFormData] = useState({ ...user });

  useEffect(() => {
    setFormData(user); // Reset form data when user prop changes
  }, [user]);
  const handlePasswordChange = async (e: any) => {
    const newPassword = e.target.value;

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      setFormData({
        ...formData,
        password: hashedPassword,
      });
      console.log(hashedPassword);
    } else {
      // Handle case when the password is left blank (optional)
      setFormData({
        ...formData,
        password: "",
      });
    }
  };
  const handleSubmit = async () => {
    try {
      console.log(formData);
      await axios.put(`/api/admin/User/editUser/${user.id_user}`, formData);
      refreshUsers(); // Refresh user data after editing
      onOpenChange(); // Close modal
    } catch (error) {
      console.error("Failed to edit user:", error);
    }
  };

  return (
    <>
      <Button
        className="hover:scale-110"
        style={{
          transitionTimingFunction: "cubic-bezier(0.33, 1.52, 0.6, 1)",
        }}
        color="primary"
        size="lg"
        onPress={onOpen}
      >
        <Edit />
        <h1 className="text-xl">Edit {formData.nama_user} User</h1>
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size="xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit User
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Name"
                  placeholder="Enter user name"
                  value={formData.nama_user}
                  onChange={(e) =>
                    setFormData({ ...formData, nama_user: e.target.value })
                  }
                />
                <Spacer y={1} />
                <Select
                  label="Role"
                  placeholder="Select role"
                  defaultSelectedKeys={[formData.role]}
                  onSelectionChange={(key: any) =>
                    setFormData({ ...formData, role: key.currentKey })
                  }
                >
                  <SelectItem key="admin">Admin</SelectItem>
                  <SelectItem key="Cashier">Cashier</SelectItem>
                  <SelectItem key="manajer">Manajer</SelectItem>
                </Select>
                <Spacer y={1} />
                <Input
                  label="Username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
                <Spacer y={1} />
                <Input
                  type="password"
                  label="Password"
                  placeholder="Enter new password or leave blank"
                  onChange={(e) => handlePasswordChange(e)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}