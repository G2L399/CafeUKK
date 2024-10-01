"use client";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { CreditCard, Receipt, LogOut } from "lucide-react";
import Cookies from "js-cookie";
import Image from "next/image";
import TransactionUI from "./components/transactionUI";
import HistoryTable from "./components/historyTable";

type TabKey = "transaction" | "history";

export default function CashierDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("history");
  const [CashierName, setCashierName] = useState<string>(""); // state to hold cashier name
  const [userName, setuserName] = useState<string>(""); // state to hold cashier name

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...");
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

  const tabConfig = [
    { key: "transaction" as const, label: "transaction", icon: CreditCard },
    { key: "history" as const, label: "history", icon: Receipt },
  ];

  return (
    <div className="flex min-h-screen bg-black">
      {/* Fixed Sidebar */}
      <aside className="w-16 p-6 text-white bg-gray-800 lg:w-64 md:w-52 sm:w-32">
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
              <h1 className="text-xl font-bold">{CashierName}</h1>
              <p className="text-sm text-gray-300">{userName}</p>
            </div>
          </div>

          <nav className="flex-grow space-y-2">
            {tabConfig.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                color={activeTab === key ? "primary" : "default"}
                onClick={() => handleTabChange(key)}
                className="justify-start w-full px-4"
                startContent={<Icon size={24} className="mr-2" />}
              >
                <span className="block sm:hidden">
                  {/* Only show this on small screens */}
                  <Icon size={24} />
                </span>
                <span className="hidden sm:block">{label}</span>
                {/* Only show this on larger screens */}
              </Button>
            ))}
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
      <main className="flex-1 p-8">
        <h1 className="mb-6 text-3xl font-bold">Cashier Dashboard</h1>
        <div className="p-6 bg-gray-800 rounded-lg shadow">
          {activeTab === "transaction" && <TransactionUI />}
          {activeTab === "history" && <HistoryTable />}
        </div>
      </main>
    </div>
  );
}
