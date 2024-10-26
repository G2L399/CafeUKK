// "use client";
// import { useState } from "react";
// import { Button } from "@nextui-org/react";
// import UserTable from "./components/UserTable";
// import MejaTable from "./components/MejaTable";
// import FoodTable from "./components/FoodTable";

// const AdminDashboard = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false); // state to track collapse
//   const [activeTab, setActiveTab] = useState("menu"); // state to track active tab

//   const handleTabChange = (key: string) => {
//     setActiveTab(key);
//   };

//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed); // toggle sidebar collapse
//   };

//   return (
//     <div style={{ display: "flex" }}>
//       {/* Sidebar */}
//       <div
//         style={{
//           backgroundColor: "black",
//           width: isCollapsed ? "80px" : "250px", // adjust width for collapse
//           minHeight: "100vh",
//           transition: "width 0.3s",
//           padding: "10px",
//         }}
//       >
//         <Button
//           color="primary"
//           onClick={toggleSidebar}
//           style={{ marginBottom: "20px" }}
//         >
//           {isCollapsed ? ">" : "<"} {/* Toggle Button */}
//         </Button>
//         <div>
//           <Button
//             color={activeTab === "users" ? "primary" : "default"}
//             onClick={() => handleTabChange("users")}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: isCollapsed ? "center" : "flex-start",
//               width: "100%",
//               marginBottom: "10px",
//             }}
//           >
//             {isCollapsed ? "U" : "Users"} {/* Show icon or text */}
//           </Button>

//           <Button
//             color={activeTab === "meja" ? "primary" : "default"}
//             onClick={() => handleTabChange("meja")}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: isCollapsed ? "center" : "flex-start",
//               width: "100%",
//               marginBottom: "10px",
//             }}
//           >
//             {isCollapsed ? "M" : "Meja"}
//           </Button>

//           <Button
//             color={activeTab === "menu" ? "primary" : "default"}
//             onClick={() => handleTabChange("menu")}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: isCollapsed ? "center" : "flex-start",
//               width: "100%",
//               marginBottom: "10px",
//             }}
//           >
//             {isCollapsed ? "F" : "menu"}
//           </Button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div style={{ padding: "20px", width: "100%" }}>
//         <h1>Admin Dashboard</h1>
//         {activeTab === "users" && <UserTable />}
//         {activeTab === "meja" && <MejaTable />}
//         {activeTab === "menu" && <FoodTable />}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
"use client";

import { useEffect, useState } from "react";
import { Button, Image } from "@nextui-org/react";
import { Users, CoffeeIcon, Menu, LogOut, Sun, Moon } from "lucide-react";
import UserTable from "./components/User/UserTable";
import MejaTable from "./components/Meja/MejaTable";
import FoodTable from "./components/Menu/MenuTable";
import Cookies from "js-cookie";
import axios from "axios";
import { useTheme } from "next-themes";

type TabKey = "users" | "meja" | "menu";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("menu");
  const [adminName, setAdminName] = useState<string>(""); // state to hold admin name
  const [userName, setuserName] = useState<string>(""); // state to hold admin name
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
  };

  const handleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    // Implement logout logic here
    const response = await axios.post("/api/logout");
    console.log(response.headers.location);
    window.location.href = response.headers.location;
  };
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  useEffect(() => {
    setTheme(localStorage.getItem("theme") as string);
    console.log(localStorage.getItem("theme"));
  }, [setTheme]);
  useEffect(() => {
    // Get the admin name from cookies
    const name = Cookies.get("name"); // Assuming you set this cookie on successful login
    const username = Cookies.get("username"); // Assuming you set this cookie on successful login
    if (name) {
      setAdminName(name);
    }
    if (username) {
      setuserName(username);
    }
    console.log(`Admin name: ${name}`);
  }, []);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  const tabConfig = [
    { key: "users" as const, label: "Users", icon: Users },
    { key: "meja" as const, label: "Meja", icon: CoffeeIcon },
    { key: "menu" as const, label: "Menu", icon: Menu },
  ];

  return (
    <div className="flex min-h-screen bg-default-100">
      {/* Fixed Sidebar */}
      <aside className="w-64 p-6 text-white bg-default-100">
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-6 space-x-4">
            <Image
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${adminName}`}
              alt="Admin Profile"
              className="rounded-full"
              width={50}
              height={50}
            />
            <div>
              <h1 className="text-xl font-bold text-default-900">
                {adminName}
              </h1>
              <p className="text-sm font-bold text-default-900">{userName}</p>
            </div>
          </div>

          <nav className="flex-grow space-y-2">
            {tabConfig.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                style={{
                  transitionTimingFunction: "cubic-bezier(0.33, 1.52, 0.6, 1)",
                }}
                onClick={() => handleTabChange(key)}
                className={`dark:text-black font-bold uppercase text-white justify-start w-full px-4  ${
                  activeTab === key
                    ? "bg-primary-600"
                    : "bg-primary-300 hover:scale-110 "
                } `}
                startContent={<Icon size={24} className="mr-2" />}
                variant="bordered"
              >
                {label}
              </Button>
            ))}
            <Button
              style={{
                transitionTimingFunction: "cubic-bezier(0.33, 1.52, 0.6, 1)",
              }}
              onClick={toggleTheme}
              className="font-bold uppercase w-auto md:w-full p-2 bg-primary-600  transition-all duration-300 hover:scale-110"
              aria-label="Toggle theme"
            >
              <span className="hidden md:block text-white dark:text-black">
                Toggle theme: {theme === "light" ? "Light" : "Dark"}
              </span>
              {theme === "light" ? (
                <Sun className=" text-white" /> // Sun icon for light mode
              ) : (
                <Moon className=" text-black" /> // Moon icon for dark mode
              )}
            </Button>
          </nav>

          <Button
            style={{
              transitionTimingFunction: "cubic-bezier(0.33, 1.52, 0.6, 1)",
            }}
            color="danger"
            onClick={(event) => handleLogout(event)}
            className="sticky justify-start w-full px-4 mt-auto bottom-4 hover:scale-110"
            startContent={<LogOut size={24} className="mr-2" />}
          >
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-8 py-4 bg-default-50">
        <h1 className="mb-2 text-3xl font-bold text-default-900">
          Admin Dashboard
        </h1>
        <div className="px-6 pt-6 rounded-lg shadow bg-default-200">
          {activeTab === "users" && <UserTable />}
          {activeTab === "meja" && <MejaTable />}
          {activeTab === "menu" && <FoodTable />}
        </div>
      </main>
    </div>
  );
}
