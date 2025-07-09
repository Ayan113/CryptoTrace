import { Search, AlertTriangle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const data = [
  { name: "Jan", Bitcoin: 4000, Ethereum: 2400, Monero: 2400 },
  { name: "Feb", Bitcoin: 3000, Ethereum: 1398, Monero: 2210 },
  { name: "Mar", Bitcoin: 2000, Ethereum: 9800, Monero: 2290 },
  { name: "Apr", Bitcoin: 2780, Ethereum: 3908, Monero: 2000 },
  { name: "May", Bitcoin: 1890, Ethereum: 4800, Monero: 2181 },
  { name: "Jun", Bitcoin: 2390, Ethereum: 3800, Monero: 2500 },
  { name: "Jul", Bitcoin: 3490, Ethereum: 4300, Monero: 2100 },
];

export function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Activity className="mr-2 h-8 w-8 text-primary" />
        Dashboard
      </h1>

      <div className="mt-4">
        <div className="flex flex-wrap -mx-6">
          <div className="w-full px-6 sm:w-1/2 xl:w-1/3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Tracked Transactions
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45,231</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="w-full px-6 sm:w-1/2 xl:w-1/3 mt-4 sm:mt-0">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Suspicious Activities Detected
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,345</div>
                <p className="text-xs text-muted-foreground">
                  +15% from last week
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="w-full px-6 sm:w-1/2 xl:w-1/3 mt-4 xl:mt-0">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Investigations
                </CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">189</div>
                <p className="text-xs text-muted-foreground">
                  +7 new cases this week
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Transaction Analysis</CardTitle>
            <CardDescription>
              Overview of cryptocurrency transactions across different
              blockchains
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Bitcoin"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="Ethereum" stroke="#82ca9d" />
                <Line type="monotone" dataKey="Monero" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
