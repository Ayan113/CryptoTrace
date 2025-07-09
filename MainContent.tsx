import { Realtime } from "../components/Realtime";
import { Search } from "../components/Search";
import { NetworkAnalysis } from "../components/NetworkAnalysis";
import { Dashboard } from "../components/Dashboard";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useSidebar } from "../contexts/useSidebar";
import { Alerts } from "@/components/Alerts";
import { Database } from "@/components/Database";
import { Reports } from "@/components/Reports";

export function MainContent() {
  const { selectedItem } = useSidebar();
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 no-scrollbar overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            {selectedItem === "dashboard" && <Dashboard />}
            {selectedItem === "realtime" && <Realtime />}
            {selectedItem === "search" && <Search />}
            {selectedItem === "network" && <NetworkAnalysis />}
            {selectedItem === "alerts" && <Alerts />}
            {selectedItem === "database" && <Database />}
            {selectedItem === "reports" && <Reports />}
          </div>
        </main>
      </div>
    </div>
  );
}
