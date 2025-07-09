import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, DollarSign, Search, ExternalLink, SearchIcon } from 'lucide-react';
import { useStoreActions, useStoreState } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert } from "@/store/models/alert.model";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useHandleCopy } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export function Alerts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const fetchAlerts = useStoreActions(
    (actions) => actions.alertModel.fetchAlerts
  );
  const alerts = useStoreState((state) => state.alertModel.alerts);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isAlertDetailsOpen, setIsAlertDetailsOpen] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  useEffect(() => {
    if(selectedAlert) {
      selectedAlert.status = alerts.find(alert => alert._id === selectedAlert._id)?.status || selectedAlert.status;
    }
  }, [alerts]);

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsAlertDetailsOpen(true);
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = alert.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      alert.type.toString().toLowerCase().includes(filterType.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Bell className="mr-2 h-8 w-8 text-primary" />
        Alerts Dashboard
      </h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Alert Filters</CardTitle>
          <CardDescription>Customize your view of alerts</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">
              Search alerts
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="search"
                type="search"
                placeholder="Search alerts..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full sm:w-48">
            <label htmlFor="filter" className="sr-only">
              Filter by type
            </label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger id="filter">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="list" className="mb-8">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert) => (
                  <TableRow key={alert._id}>
                    <TableCell>
                      <Badge
                        variant={
                          alert.type.toString().toLowerCase().includes("high")
                            ? "destructive"
                            : alert.type.toString().toLowerCase().includes("medium")
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {alert.type.toString()}
                      </Badge>
                    </TableCell>
                    <TableCell>{alert.description}</TableCell>
                    <TableCell>
                      {alert.amount} {alert.currency}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          alert.status === "New"
                            ? "default"
                            : alert.status === "In Progress"
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {alert.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAlertClick(alert)}
                      >
                        View Details
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlerts.map((alert) => (
              <Card key={alert._id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{alert.type.toString()}</span>
                    <Badge
                      variant={
                        alert.type.toString().toLowerCase().includes("high")
                          ? "destructive"
                          : alert.type.toString().toLowerCase().includes("medium")
                          ? "outline"
                          : "secondary"
                      }
                    >
                      {alert.type.toString()}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {new Date(alert.timestamp).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{alert.description}</p>
                  <p className="font-semibold">
                    <DollarSign className="inline-block mr-1 h-4 w-4" />
                    {alert.amount} {alert.currency}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Badge
                    variant={
                      alert.status === "New"
                        ? "default"
                        : alert.status === "In Progress"
                        ? "outline"
                        : "secondary"
                    }
                  >
                    {alert.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAlertClick(alert)}
                  >
                    View Details
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      <Dialog open={isAlertDetailsOpen} onOpenChange={setIsAlertDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <AlertDetails alert={selectedAlert} />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function AlertDetails({ alert }: { alert: Alert | null }) {
  const updateAlertStatus = useStoreActions(
    (actions) => actions.alertModel.updateAlertStatus
  );
  const handleCopy = useHandleCopy();
  const navigate = useNavigate();
  if (!alert) return null;

  const searchTransaction = (hash: string) => {
    navigate(`/search?q=${hash}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Alert Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Alert Type
              </p>
              <p>{alert.type.toString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Description
              </p>
              <p>{alert.description}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Amount
              </p>
              <p>
                {alert.amount} {alert.currency}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </p>
              <Select
                value={alert.status}
                onValueChange={(newStatus) => {
                  updateAlertStatus({ id: alert._id, status: newStatus });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Timestamp
              </p>
              <p>{new Date(alert.timestamp).toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Hash
              </p>
              <p
                className="font-mono text-sm whitespace-nowrap overflow-x-auto text-blue-600 dark:text-blue-400 hover:cursor-pointer"
                onClick={() => handleCopy(alert.hash)}
              >
                {alert.hash}
              </p>
            </div>
          </div>
          <div className="pt-4 flex justify-center cursor-pointer">
            <a
              onClick={() => searchTransaction(alert.hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              Search Transaction
              <SearchIcon className="ml-2 h-4 w-4" />
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

