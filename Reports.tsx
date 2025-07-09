import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FileText,
  Download,
  Trash2,
  Search,
  Calendar,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useStoreActions, useStoreState } from "@/store/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Report as IReport } from "@/store/models/report.model";
import { Alert } from "@/store/models/alert.model";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface StreamingReportProps {
  alertId: string;
  reportType: string;
  onClose: () => void;
}

export function StreamingReport({
  alertId,
  reportType,
  onClose,
}: StreamingReportProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (content.length > 0) {
      return;
    }
    const eventSource = new EventSource(
      `http://localhost:3000/api/transactions/${alertId}/analyse?type=${reportType}`
    );

    eventSource.addEventListener("message", (event) => {
      const newContent = JSON.parse(event.data);
      setContent((prevContent) => prevContent + newContent.message);
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    });

    eventSource.addEventListener("error", (event) => {
      console.error(event);
      setError("An error occurred while generating the report");
    });

    eventSource.addEventListener("end", () => {
      eventSource.close();
    });

    // @ts-ignore
    eventSource.stream();
  }, [alertId, reportType]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-4xl h-[80vh] flex flex-col">
        {content.length === 0 && !error && (
          <div className="flex-grow flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin" />
              <h2 className="mt-4 text-xl font-semibold">Generating Report</h2>
              <p className="mt-2 text-muted-foreground">This may take a few moments...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="text-destructive text-center flex-grow flex items-center justify-center">
            {error}
          </div>
        )}
        {!error && (
          <ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}>
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              children={content || ""}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-xl font-semibold mt-4 mb-2" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-lg font-medium mt-3 mb-2" {...props} />
                ),
                p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-5 mb-2" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal pl-5 mb-2" {...props} />
                ),
                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                table: ({ node, ...props }) => (
                  <table
                    className="min-w-full divide-y divide-gray-200 mb-4"
                    {...props}
                  />
                ),
                th: ({ node, ...props }) => (
                  <th
                    className="px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    {...props}
                  />
                ),
                td: ({ node, ...props }) => (
                  <td
                    className="px-3 py-2 whitespace-nowrap text-sm text-gray-500"
                    {...props}
                  />
                ),
                pre: ({ node, ...props }) => (
                  <pre
                    className="bg-gray-100 rounded p-2 overflow-x-auto"
                    {...props}
                  />
                ),
              }}
            />
          </ScrollArea>
        )}
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </motion.div>
  );
}

export function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const alerts = useStoreState((state) => state.alertModel.alerts);
  const reports = useStoreState((state) => state.reportModel.reports);
  const fetchReports = useStoreActions(
    (actions) => actions.reportModel.fetchReports
  );
  const fetchAlerts = useStoreActions(
    (actions) => actions.alertModel.fetchAlerts
  );
  const deleteReport = useStoreActions(
    (actions) => actions.reportModel.deleteReport
  );
  const [pendingAlerts, setPendingAlerts] = useState<Alert[]>([]);
  const [streamingReport, setStreamingReport] = useState<{
    hash: string;
    reportType: string;
  } | null>(null);
  const [viewingReport, setViewingReport] = useState<IReport | null>(null);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    if (!alerts || alerts.length === 0) {
      fetchAlerts();
    }
  }, [fetchAlerts, alerts]);

  useEffect(() => {
    setPendingAlerts(alerts.filter((alert) => alert.status === "In Progress"));
  }, [alerts]);

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      report.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleGenerateReport = (hash: string, reportType: string) => {
    console.log("Generating report for alert:", hash, reportType);
    setStreamingReport({ hash, reportType });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <FileText className="mr-2 h-8 w-8 text-primary" />
        Reports Dashboard
      </h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Pending Alerts</CardTitle>
          <CardDescription>
            Alerts that require attention and report generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingAlerts.map((alert) => (
                <TableRow key={alert._id}>
                  <TableCell>{alert._id}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        alert.type.toString().toLowerCase().includes("high")
                          ? "destructive"
                          : alert.type
                              .toString()
                              .toLowerCase()
                              .includes("medium")
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button>Generate Report</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onSelect={() =>
                            handleGenerateReport(alert.hash, "investigation")
                          }
                        >
                          Investigation
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            handleGenerateReport(alert.hash, "summary")
                          }
                        >
                          Summary
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            handleGenerateReport(alert.hash, "analysis")
                          }
                        >
                          Analysis
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
          <CardDescription>
            View, download, and delete generated reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Label htmlFor="search-reports" className="sr-only">
                Search reports
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="search-reports"
                  type="search"
                  placeholder="Search reports..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Label htmlFor="filter-type" className="sr-only">
                Filter by type
              </Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger id="filter-type">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="investigation">Investigation</SelectItem>
                  <SelectItem value="analysis">Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-48">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? selectedDate.toDateString() : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report: IReport) => (
                <TableRow key={report._id}>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>
                    {report.type.charAt(0).toUpperCase() +
                      report.type.slice(1).toLowerCase()}
                  </TableCell>
                  <TableCell>
                    {new Date(report.createdDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {report.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingReport(report)}
                      >
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadReport(report)}
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button> */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteReport(report._id)}
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
          <Button variant="outline" onClick={() => fetchReports()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh List
          </Button>
          <p className="text-sm text-gray-600">
            Total Reports: {filteredReports.length}
          </p>
        </CardFooter>
      </Card>
      <AnimatePresence>
        {streamingReport && (
          <StreamingReport
            alertId={streamingReport.hash}
            reportType={streamingReport.reportType}
            onClose={() => setStreamingReport(null)}
          />
        )}
      </AnimatePresence>
      <Dialog
        open={!!viewingReport}
        onOpenChange={() => setViewingReport(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] p-6">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-semibold">
              {viewingReport?.title}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-grow pr-4 max-h-[70vh]">
            <div className="space-y-4">
              <ReactMarkdown
                children={viewingReport?.content || ""}
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-xl font-semibold mt-4 mb-2"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-lg font-medium mt-3 mb-2" {...props} />
                  ),
                  p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc pl-5 mb-2" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal pl-5 mb-2" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="mb-1" {...props} />
                  ),
                  table: ({ node, ...props }) => (
                    <table
                      className="min-w-full divide-y divide-gray-200 mb-4"
                      {...props}
                    />
                  ),
                  th: ({ node, ...props }) => (
                    <th
                      className="px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      {...props}
                    />
                  ),
                  td: ({ node, ...props }) => (
                    <td
                      className="px-3 py-2 whitespace-nowrap text-sm text-gray-500"
                      {...props}
                    />
                  ),
                  pre: ({ node, ...props }) => (
                    <pre
                      className="bg-gray-100 rounded p-2 overflow-x-auto"
                      {...props}
                    />
                  ),
                }}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
