import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Search,
  Database,
  Network,
  Activity,
  BarChart2,
  Radio,
  Shield,
  Menu,
} from "lucide-react";
import { useSidebar } from "@/contexts/useSidebar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useStoreActions, useStoreState } from "@/store/hooks";

interface SidebarItem {
  id: string;
  name: string;
  icon: React.ElementType;
}

const sidebarItems: SidebarItem[] = [
  { id: "dashboard", name: "Dashboard", icon: Activity },
  { id: "realtime", name: "Real-time", icon: Radio },
  { id: "search", name: "Search", icon: Search },
  { id: "network", name: "Network Analysis", icon: Network },
  { id: "alerts", name: "Alerts", icon: Bell },
  { id: "database", name: "Database", icon: Database },
  { id: "reports", name: "Reports", icon: BarChart2 },
];

export function Sidebar() {
  const { selectedItem, setSelectedItem } = useSidebar();
  const user = useStoreState((state) => state.authModel.user);
  const getUser = useStoreActions((actions) => actions.authModel.getUser);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user, getUser]);

  useEffect(() => {
    const path = window.location.pathname;
    const item = sidebarItems.find((item) => path.includes(item.id));
    if (item) {
      setSelectedItem(item.id);
    }
  }, [setSelectedItem, navigate]);

  const handleSidebarItemClicked = (item: SidebarItem) => {
    const path = `/${item.id}`;
    navigate(path, { replace: true });
  }


  return (
    <>
      {!isOpen && (
        <Button
          variant="ghost"
          className="md:hidden fixed top-4 left-4 z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu />
        </Button>
      )}

      <div className="md:hidden">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: isOpen ? 0 : "-100%" }}
          transition={{ duration: 0.1 }}
          className={`
            fixed inset-y-0 left-0 transform z-40
            md:relative md:translate-x-0 transition duration-200 ease-in-out
            md:flex flex-col w-64 bg-white dark:bg-gray-800
          `}
        >
          <div className="flex items-center h-16 px-4 border-b dark:border-gray-700">
            <Shield className="h-8 w-8 text-primary" />
            <span className="ml-2 text-2xl font-bold text-gray-800 dark:text-white">
              CryptoTrace
            </span>
          </div>
          <ScrollArea className="flex-1">
            <nav className="mt-5 px-2">
              {sidebarItems.map((item) => (
                <a
                  key={item.id}
                  className={`group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md transition ease-in-out duration-150 cursor-pointer ${
                    selectedItem === item.id
                      ? "text-gray-900 bg-gray-100 focus:outline-none focus:bg-gray-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 dark:focus:text-gray-200 dark:focus:bg-gray-600"
                  }`}
                  onClick={() => {
                    handleSidebarItemClicked(item);
                    setIsOpen(false);
                  }}
                >
                  <item.icon className="mr-4 h-6 w-6" />
                  {item.name}
                </a>
              ))}
            </nav>
          </ScrollArea>
        </motion.div>
      </div>

      <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800">
        <div className="flex items-center h-16 px-4 border-b dark:border-gray-700">
          <Shield className="h-8 w-8 text-primary" />
          <span className="ml-2 text-2xl font-bold text-gray-800 dark:text-white">
            CryptoTrace
          </span>
        </div>
        <ScrollArea className="flex-1">
          <nav className="mt-5 px-2">
            {sidebarItems.map((item) => (
              <a
                key={item.id}
                className={`group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md transition ease-in-out duration-150 cursor-pointer ${
                  selectedItem === item.id
                    ? "text-gray-900 bg-gray-100 focus:outline-none focus:bg-gray-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 dark:focus:text-gray-200 dark:focus:bg-gray-600"
                }`}
                onClick={() => handleSidebarItemClicked(item)}
              >
                <item.icon className="mr-4 h-6 w-6" />
                {item.name}
              </a>
            ))}
          </nav>
        </ScrollArea>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <a href="#" className="flex-shrink-0 group block">
            <div className="flex items-center">
              <div>
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>US</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-gray-700 group-hover:text-gray-900 dark:text-gray-200 dark:group-hover:text-gray-100">
                  {user?.name}
                </p>
                <Dialog>
                  <DialogTrigger>
                    <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200">
                      View profile
                    </p>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Profile</DialogTitle>
                      <DialogDescription>
                        Your profile information
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src="/avatars/01.png" alt="@johndoe" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold">Name</h3>
                          <p className="text-sm text-muted-foreground">
                            {user?.name}
                          </p>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <p className="text-sm font-medium">Agency</p>
                        <p className="text-sm text-muted-foreground">
                          {user?.agency}
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <p className="text-sm font-medium">Role</p>
                        <p className="text-sm text-muted-foreground">
                          {user?.role}
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </a>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
