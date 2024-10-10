"use client";

import { useEffect, useState } from "react";
import { Button, Switch } from "@nextui-org/react";
import { CreditCard, Receipt, LogOut, Moon, Sun } from "lucide-react";
import Cookies from "js-cookie";
import Image from "next/image";
import TransactionUI from "./components/transactionUI";
import HistoryTable from "./components/historyTable";
import axios from "axios";
import { useTheme } from "next-themes";
import "@/app/globals.css";
type TabKey = "transaction" | "history";

export default function CashierDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("history");
  const [CashierName, setCashierName] = useState<string>(""); // state to hold cashier name
  const [userName, setuserName] = useState<string>(""); // state to hold cashier name
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
  };

  const handleLogout = async () => {
    // Implement logout logic here
    try {
      const response = await axios.post("/api/logout");
      if (response.status === 200) {
        alert(response.data.message);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error Loggin Out:", error);
    }
  };
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    // You would typically update your app's theme here
    // For example: document.documentElement.classList.toggle('dark')
  };
  useEffect(() => {
    // Get the cashier name from cookies
    const name = Cookies.get("name"); // Assuming you set this cookie on successful login
    const username = Cookies.get("username"); // Assuming you set this cookie on successful login
    if (name) {
      setCashierName(name);
    }
    if (username) {
      setuserName(username);
    }
    console.log(`Cashier name: ${name}`);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  const tabConfig = [
    { key: "transaction" as const, label: "transaction", icon: CreditCard },
    { key: "history" as const, label: "history", icon: Receipt },
  ];

  return (
    <div className="flex min-h-screen bg-black">
      {/* Fixed Sidebar */}
      <aside className="w-16 p-6 text-default-900 bg-default-50 lg:w-64 md:w-52 sm:w-32">
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-6 space-x-4">
            <Image
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${CashierName}`}
              alt="Cashier Profile"
              className="rounded-full"
              width={50}
              height={50}
            />
            <div>
              <h1 className="text-xl font-bold text-default-900">
                {CashierName}
              </h1>
              <p className="text-sm text-default-900">{userName}</p>
            </div>
          </div>

          <nav className="flex-grow space-y-2">
            {tabConfig.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                isIconOnly={activeTab ? true : false}
                color={activeTab === key ? "primary" : "default"}
                onClick={() => handleTabChange(key)}
                className={`justify-start w-full px-4 ${
                  activeTab === key ? "bg-primary-600" : "bg-primary-300"
                } `}
                startContent={<Icon size={24} className="mr-2" />}
              >
                <span className="block">{label}</span>
                {/* Only show this on larger screens */}
              </Button>
            ))}
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* <Sun style={{ marginRight: 8 }} /> */}
              <Switch
                size="lg"
                checked={theme === "dark"}
                onChange={toggleTheme}
                thumbIcon={({ isSelected, className }) =>
                  isSelected ? (
                    <Sun className={className} /> // Sun icon for dark mode
                  ) : (
                    <Moon className={className} /> // Moon icon for light mode
                  )
                }
                // size="lg"
              />
              {/* <Moon style={{ marginLeft: 8 }} /> */}
            </div>
          </nav>

          <Button
            style={{
              transitionTimingFunction: "cubic-bezier(0.33, 1.52, 0.6, 1)",
            }}
            color="danger"
            onClick={handleLogout}
            className="sticky justify-start w-full px-4 mt-auto hover:scale-110 bottom-6"
            startContent={<LogOut size={24} className="mr-2" />}
          >
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-8 py-2 bg-default-100">
        <h1 className="mb-2 text-3xl font-bold text-default-900">
          Cashier Dashboard
        </h1>
        <div className="p-6 rounded-lg shadow bg-default-200">
          {activeTab === "transaction" && <TransactionUI />}
          {activeTab === "history" && <HistoryTable />}
        </div>
      </main>
    </div>
  );
}
