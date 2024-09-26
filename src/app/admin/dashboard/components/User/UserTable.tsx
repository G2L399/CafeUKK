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
  User,
  Tooltip,
  Chip,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import EditUser from "./EditUser";
import AddUser from "./AddUser";

interface User {
  id_user: number;
  nama_user: string;
  role: string;
  username: string;
  password: string;
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/admin/User/deleteUser/${id}`);
      setUsers(users.filter((user) => user.id_user !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const roleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "danger";
      case "manajer":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <Table aria-label="User table" className="mb-4">
        <TableHeader>
          <TableColumn>NO</TableColumn>
          <TableColumn>USER</TableColumn>
          <TableColumn>ROLE</TableColumn>
          <TableColumn>USERNAME</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={loading ? "Loading users..." : "No users found"}
          loadingContent={
            <div className="h-12 bg-default-100 rounded animate-pulse" />
          }
          loadingState={loading ? "loading" : "idle"}
        >
          {users.map((user) => (
            <TableRow key={user.id_user}>
              <TableCell className="text-xl">{users.indexOf(user) + 1}</TableCell>
              <TableCell>
                <User
                  name={<h1 className="text-xl">{user.nama_user}</h1>}
                  description={
                    <span className="text-lg">ID: {user.id_user}</span>
                  }
                  avatarProps={{
                    src: `https://api.dicebear.com/6.x/initials/svg?seed=${user.nama_user}`,
                    style: {
                      width: "3.5rem",
                      height: "3.5rem",
                      marginRight: "1rem",
                    },
                  }}
                />
              </TableCell>
              <TableCell>
                <Chip color={roleColor(user.role)} variant="light">
                  <h1 className="text-xl uppercase">{user.role}</h1>
                </Chip>
              </TableCell>
              <TableCell style={{width: "25%"}} className="text-xl">{user.username}</TableCell>
              <TableCell className="text-xl">
                <div className="w-3/4 flex items-center gap-5">
                  <EditUser user={user} refreshUsers={refreshUsers} />
                  <Button
                    className="hover:scale-110"
                    style={{
                      transitionTimingFunction:
                        "cubic-bezier(0.33, 1.52, 0.6, 1)",
                    }}
                    size="lg"
                    color="danger"
                    aria-label="Delete user"
                    onClick={() => handleDelete(user.id_user)}
                  >
                    <Trash2 />
                    <h1 className="text-xl">Delete User</h1>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Spacer y={4} />
      <AddUser refreshUsers={refreshUsers} />
    </div>
  );
}
