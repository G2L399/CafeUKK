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
import { EyeIcon, EyeOff } from "lucide-react";
import axios from "axios";
import bcrypt from "bcryptjs";
export default function AddUser({
  refreshUsers,
}: {
  refreshUsers: () => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nama_user: "",
    role: "admin" || "manager" || "cashier",
    username: "",
    password: "",
  });
  const initialFormData = {
    nama_user: "",
    role: "admin", // You can change this to whichever role you'd prefer as the default
    username: "",
    password: "",
  };

  const handlePasswordChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPassword = e.target.value;

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      setFormData({
        ...formData,
        password: hashedPassword,
      });
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
      await axios.post("/api/admin/User/addUser", formData);
      setFormData(initialFormData);
      refreshUsers(); // Refresh user data after adding
      onOpenChange(); // Close modal
    } catch (error) {
      console.error("Failed to add user:", error);
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
        Add User
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
                Add New User
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
                  defaultSelectedKeys={["admin"]}
                  onSelectionChange={(key) => {
                    const currentKey = Array.from(key)[0] as string;
                    setFormData({ ...formData, role: currentKey });
                  }}
                >
                  <SelectItem key="admin">Admin</SelectItem>
                  <SelectItem key="cashier">Cashier</SelectItem>
                  <SelectItem key="manager">Manager</SelectItem>
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
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder="Enter password"
                  onChange={handlePasswordChange}
                  endContent={
                    <Button
                      isIconOnly
                      className="bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="text-2xl pointer-events-none text-default-900"></EyeOff>
                      ) : (
                        <EyeIcon className="text-2xl pointer-events-none text-default-900"></EyeIcon>
                      )}
                    </Button>
                  }
                />
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
