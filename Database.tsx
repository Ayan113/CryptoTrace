'use client'

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DatabaseIcon, Upload, FileText, Trash2, RefreshCw, Search } from 'lucide-react';
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
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useStoreActions, useStoreState } from "@/store/hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Database as DB } from "@/store/models/database.model";
// Removed unused import

export function Database() {
  const databases = useStoreState((state) => state.databaseModel.databases);
  const searchTerm = useStoreState((state) => state.databaseModel.searchTerm);
  const uploadProgress = useStoreState((state) => state.databaseModel.uploadProgress);
  const isLoading = useStoreState((state) => state.loadingModel.isLoading);
  
  const setSearchTerm = useStoreActions((actions) => actions.databaseModel.setSearchTerm);
  const uploadDatabase = useStoreActions((actions) => actions.databaseModel.uploadDatabase);
  const deleteDatabase = useStoreActions((actions) => actions.databaseModel.deleteDatabase);
  const fetchDatabases = useStoreActions((actions) => actions.databaseModel.fetchDatabases);
  const viewDatabase = useStoreActions((actions) => actions.databaseModel.viewDatabase);
  const updateDatabaseStatus = useStoreActions((actions) => actions.databaseModel.updateDatabaseStatus);

  const [selectedDatabase, setSelectedDatabase] = useState<DB>();

  const { toast } = useToast();

  useEffect(() => {
    fetchDatabases();
  }, [fetchDatabases]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadDatabase(file);
      toast({
        title: "Database Uploaded",
        description: `${file.name} has been successfully uploaded and is inactive.`,
      });
    }
  };

  const handleDatabaseDelete = async (id: number) => {
    await deleteDatabase(id);
    toast({
      title: "Database Removed",
      description: "The selected database has been removed from the system.",
      variant: "destructive",
    });
  };

  const handleViewDatabase = async (id: number) => {
    const data = await viewDatabase(id);
    setSelectedDatabase(data);
  };

  const handleStatusToggle = async (id: number, currentStatus: "Active" | "Inactive") => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    await updateDatabaseStatus({
      id,
      status: newStatus,
    });
    toast({
      title: "Status Updated",
      description: `Database status has been updated to ${newStatus}.`,
    });
  };

  const filteredDatabases = databases.filter((db) =>
    db.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <DatabaseIcon className="mr-2 h-8 w-8 text-primary" />
        External Database Cross-Reference
      </h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload New Database</CardTitle>
          <CardDescription>
            Add a new external database for cross-referencing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="database-upload" className="cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                CSV, JSON, or XML files up to 50MB
              </p>
            </div>
            <Input
              id="database-upload"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".csv,.json,.xml"
              disabled={isLoading}
            />
          </Label>
          {uploadProgress > 0 && (
            <div className="mt-4">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage External Databases</CardTitle>
          <CardDescription>View and manage uploaded databases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="search-databases" className="sr-only">
              Search databases
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="search-databases"
                type="search"
                placeholder="Search databases..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Database</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Active/Inactive</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDatabases.map((db) => (
                <TableRow key={db._id}>
                  <TableCell>
                    {db.name}{" "}
                    <span
                      className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        db.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {db.status}
                    </span>
                  </TableCell>
                  <TableCell>{db.records.toLocaleString()}</TableCell>
                  <TableCell>
                    {new Date(db.lastUpdated).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={db.status === "Active"}
                      onCheckedChange={() => handleStatusToggle(db._id, db.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleViewDatabase(db._id)}>
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                          <DialogHeader>
                            <DialogTitle>{db.name}</DialogTitle>
                            <DialogDescription>
                              Database contents
                            </DialogDescription>
                          </DialogHeader>
                          {selectedDatabase && (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Address</TableHead>
                                  <TableHead>Remarks</TableHead>
                                  <TableHead>Severity</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {selectedDatabase.data.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{item.address}</TableCell>
                                    <TableCell>{item.remarks}</TableCell>
                                    <TableCell>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        item.severity.toString() == 'Low' ? 'bg-green-100 text-green-800' :
                                        item.severity.toString() == 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                      }`}>
                                        {item.severity.toString()}
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDatabaseDelete(db._id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => fetchDatabases()} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh List
          </Button>
          <p className="text-sm text-gray-600">
            Total Databases: {filteredDatabases.length}
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}