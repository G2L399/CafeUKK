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
import { Button } from "@nextui-org/react";
import { Users, CoffeeIcon, Menu, LogOut } from "lucide-react";
import UserTable from "./components/User/UserTable";
import MejaTable from "./components/Meja/MejaTable";
import FoodTable from "./components/Menu/MenuTable";
import Cookies from "js-cookie";

type TabKey = "users" | "meja" | "menu";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("meja");
  const [adminName, setAdminName] = useState<string>(""); // state to hold admin name
  const [userName, setuserName] = useState<string>(""); // state to hold admin name

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...");
  };
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

  const tabConfig = [
    { key: "users" as const, label: "Users", icon: Users },
    { key: "meja" as const, label: "Meja", icon: CoffeeIcon },
    { key: "menu" as const, label: "Menu", icon: Menu },
  ];

  return (
    <div className="flex min-h-screen bg-black">
      {/* Fixed Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6">
        <div className="flex flex-col h-full">
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${adminName}`}
              alt="Admin Profile"
              className="rounded-full"
              width={50}
              height={50}
            />
            <div>
              <h1 className="text-xl font-bold">{adminName}</h1>
              <p className="text-sm text-gray-300">{userName}</p>
            </div>
          </div>

          <nav className="space-y-2 flex-grow">
            {tabConfig.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                color={activeTab === key ? "primary" : "default"}
                onClick={() => handleTabChange(key)}
                className="w-full justify-start px-4"
                startContent={<Icon size={24} className="mr-2" />}
              >
                {label}
              </Button>
            ))}
          </nav>

          <Button
            style={{
              transitionTimingFunction: "cubic-bezier(0.33, 1.52, 0.6, 1)",
            }}
            color="danger"
            onClick={handleLogout}
            className="w-full justify-start px-4 mt-auto hover:scale-110"
            startContent={<LogOut size={24} className="mr-2" />}
          >
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="bg-gray-800 rounded-lg shadow p-6">
          {activeTab === "users" && <UserTable />}
          {activeTab === "meja" && <MejaTable />}
          {activeTab === "menu" && <FoodTable />}
        </div>
      </main>
    </div>
  );
}
