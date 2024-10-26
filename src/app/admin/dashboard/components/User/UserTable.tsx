"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Spacer,
  User as Users,
  Chip,
  SortDescriptor,
  Spinner,
} from "@nextui-org/react";
import { toast, Toaster } from "react-hot-toast";

import { useEffect, useState, useMemo } from "react";
import axios, { AxiosError } from "axios";
import { Trash2 } from "lucide-react";
import EditUser from "./EditUser";
import AddUser from "./AddUser";
import { Role, User } from "@/lib/types";

export default function Component() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id_user",
    direction: "ascending",
  });

  const refreshUsers = () => {
    fetchUsers();
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/User/getUser");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/admin/User/deleteUser/${id}`);
      setUsers(users.filter((user) => user.id_user !== id));
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error deleting user:", error.response?.data.error);
        if (error.response?.status === 400) {
          toast.error("You Cannot Delete Yourself!");
        } else {
          toast.error(
            "An error occurred while deleting the user. Please try again."
          );
        }
      }
    }
  };

  const roleColor = (role: Role) => {
    switch (role.role.toLowerCase()) {
      case "admin":
        return "danger";
      case "manager":
        return "success";
      default:
        return "default";
    }
  };

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof User];
      const second = b[sortDescriptor.column as keyof User];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [users, sortDescriptor]);

  const handleSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  };

  return (
    <div className="container p-4">
      <Toaster position="top-right" />
      <h1 className="mb-4 text-2xl font-bold">User Management</h1>
      <Table
        aria-label="User table"
        sortDescriptor={sortDescriptor}
        onSortChange={handleSortChange}
      >
        <TableHeader>
          <TableColumn key="id_user" allowsSorting>
            NO
          </TableColumn>
          <TableColumn key="nama_user" allowsSorting>
            USER
          </TableColumn>
          <TableColumn key="role" allowsSorting>
            ROLE
          </TableColumn>
          <TableColumn key="username" allowsSorting>
            USERNAME
          </TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            loading ? (
              <>
                <Spinner aria-label="loading" />
                <div>Loading...</div>
              </>
            ) : (
              <span className="text-xl">No data available</span>
            )
          }
          items={sortedUsers}
        >
          {(item) => (
            <TableRow key={item.id_user}>
              <TableCell className="text-xl">
                {users.indexOf(item) + 1}
              </TableCell>
              <TableCell className="w-auto max-w-10">
                <Users
                  name={<h1 className="text-xl">{item.nama_user}</h1>}
                  description={
                    <span className="text-lg">ID: {item.id_user}</span>
                  }
                  avatarProps={{
                    src: `https://api.dicebear.com/6.x/initials/svg?seed=${item.nama_user}`,
                    style: {
                      width: "3.5rem",
                      height: "3.5rem",
                    },
                  }}
                />
              </TableCell>
              <TableCell className="w-auto max-w-10">
                <Chip color={roleColor(item.role)} variant="dot">
                  <h1 className="text-xl uppercase">{item.role.role}</h1>
                </Chip>
              </TableCell>
              <TableCell className="text-xl w-auto max-w-72">
                {item.username}
              </TableCell>
              <TableCell className="text-xl">
                <div className="flex items-center w-3/4 gap-5">
                  <EditUser user={item} refreshUsers={refreshUsers} />
                  <Button
                    className="hover:scale-110"
                    style={{
                      transitionTimingFunction:
                        "cubic-bezier(0.33, 1.52, 0.6, 1)",
                    }}
                    size="lg"
                    color="danger"
                    aria-label="Delete user"
                    onClick={() => handleDelete(item.id_user)}
                  >
                    <Trash2 />
                    <h1 className="text-xl">Delete User</h1>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Spacer y={4} />
      <AddUser refreshUsers={refreshUsers} />
    </div>
  );
}
