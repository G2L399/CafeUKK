"use client";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { CreditCard, Receipt, LogOut } from "lucide-react";
import Cookies from "js-cookie";
import Image from "next/image";
import TransactionUI from "./components/transactionUI";
import HistoryTable from "./components/historyTable";
import axios from "axios";

type TabKey = "transaction" | "history";

export default function CashierDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("transaction");
  const [CashierName, setCashierName] = useState<string>(""); // state to hold cashier name
  const [userName, setuserName] = useState<string>(""); // state to hold cashier name

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
  };

  const handleLogout = async() => {
    // Implement logout logic here
    const response =await axios.get("/api/logout");
    console.log(response);
    
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
              <h1 className="text-xl font-bold text-default-900">{CashierName}</h1>
              <p className="text-sm text-default-900">{userName}</p>
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
      <main className="flex-1 px-8 py-2 bg-default-100">
        <h1 className="mb-2 text-3xl font-bold text-default-900">Cashier Dashboard</h1>
        <div className="p-6 rounded-lg shadow bg-default-200">
          {activeTab === "transaction" && <TransactionUI />}
          {activeTab === "history" && <HistoryTable />}
        </div>
      </main>
    </div>
  );
}
