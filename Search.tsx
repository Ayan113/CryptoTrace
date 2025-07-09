"use client";

import { useEffect, useState } from "react";
import { SearchIcon, Filter, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useStoreActions, useStoreState } from "@/store/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Transfer } from "@/store/models/search.model";
import { useHandleCopy } from "@/lib/utils";
function AdvancedFilters() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="search-type">Search Type</Label>
        <Select defaultValue="address">
          <SelectTrigger id="search-type">
            <SelectValue placeholder="Select search type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="address">Address</SelectItem>
            <SelectItem value="transaction">Transaction</SelectItem>
            <SelectItem value="block">Block</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="date-range">Date Range</Label>
        <div className="flex space-x-2">
          <Input id="date-from" type="date" className="w-full" />
          <Input id="date-to" type="date" className="w-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount-range">Amount Range</Label>
        <div className="flex space-x-2">
          <Input id="amount-min" placeholder="Min" className="w-full" />
          <Input id="amount-max" placeholder="Max" className="w-full" />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Apply Filters
      </Button>
    </form>
  );
}

interface SearchResultsProps {
  results: Transfer[];
}

function SearchResults({ results }: SearchResultsProps) {
  const handleCopy = useHandleCopy();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {results?.map((result) => (
        <Card key={result.uniqueId}>
          <CardHeader>
            <CardTitle className="text-lg">Transaction</CardTitle>
            <CardDescription className="truncate">
              {result.hash}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              From: {result.from}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              To: {result.to}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Value: {result.value ? parseFloat(result.value).toFixed(4) : "N/A"} ETH
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Token ID: {result.tokenId}
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2">
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Transaction Details</DialogTitle>
                </DialogHeader>
                <div>
                  <Card className="w-full">
                    <CardContent className="space-y-4 mt-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction Hash</p>
                          <p className="font-mono text-sm break-all text-blue-600 dark:text-blue-400 hover:cursor-pointer" onClick={() => handleCopy(result.hash)}>
                            {result.hash}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Block</p>
                          <p className="font-mono text-sm break-all hover:cursor-pointer" onClick={() => handleCopy(result.blockNum)}>
                            {result.blockNum}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">From</p>
                          <p className="font-mono text-sm break-all hover:cursor-pointer" onClick={() => handleCopy(result.from)}>
                            {result.from}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">To</p>
                          <p className="font-mono text-sm break-all hover:cursor-pointer" onClick={() => handleCopy(result.to)}>
                            {result.to}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Value</p>
                          <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 font-mono">
                            {parseFloat(result.value || "0").toFixed(4)} ETH
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Token ID</p>
                          <p className="font-mono text-sm break-all hover:cursor-pointer" onClick={() => handleCopy(result.tokenId)}>
                            {result.tokenId}
                          </p>
                        </div>
                      </div>
                      <Separator />
                      {result.rawContract && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Raw Contract</p>
                          <pre className="font-mono text-xs break-all bg-gray-100 dark:bg-gray-800 p-2 rounded">
                            {JSON.stringify(result.rawContract, null, 2)}
                          </pre>
                        </div>
                      )}
                      {result.logs && result.logs.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Logs</p>
                          <ScrollArea className="h-[100px] w-[600px] rounded border">
                            <pre className="font-mono text-xs p-4">
                              {JSON.stringify(result.logs, null, 2)}
                            </pre>
                          </ScrollArea>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-center pt-4">
                      <a
                        href={`https://etherscan.io/tx/${result.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View on Etherscan
                        <ExternalLink className="ml-2 -mr-1 h-4 w-4" />
                      </a>
                    </CardFooter>
                  </Card>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface SearchSummaryProps {
  transfers: Transfer[];
}

function SearchSummary({ transfers }: SearchSummaryProps) {
  const totalTransactions = transfers.length;
  const totalValue = transfers.reduce(
    (sum, transfer) => sum + parseFloat(transfer.value || "0"),
    0
  );
  const uniqueAddresses = new Set([
    ...transfers.map((t) => t.from),
    ...transfers.map((t) => t.to),
  ]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Transactions
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTransactions}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalValue.toFixed(2)} ETH</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Unique Addresses
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueAddresses.size}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Transaction Value
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(totalValue / totalTransactions).toFixed(4)} ETH
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function Search() {
  const searchQuery = useStoreState((state) => state.searchModel.searchQuery);
  const setSearchQuery = useStoreActions(
    (actions) => actions.searchModel.setSearchQuery
  );
  const searchResult = useStoreState((state) => state.searchModel.searchResult);
  const isLoading = useStoreState((state) => state.loadingModel.isLoading);
  // const advancedFilters = useStoreState((state) => state.searchModel.advancedFilters)
  // const setAdvancedFilters = useStoreActions((actions) => actions.searchModel.setAdvancedFilters)
  const search = useStoreActions((actions) => actions.searchModel.search);

  useEffect(() => {
    const url = new URL(window.location.href)  
    const query = url.searchParams.get('query')
    if (query) {
      setSearchQuery(query)
      search(query)
    }
  }, [])

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    search(searchQuery);
  };

  const totalPages = searchResult.transfers
    ? Math.ceil(searchResult.transfers.length / itemsPerPage)
    : 0;

  const paginatedResults = searchResult.transfers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-8 flex items-center text-primary">
        <SearchIcon className="mr-4 h-8 w-8 md:h-10 md:w-10" />
        Blockchain Explorer
      </h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Transactions</CardTitle>
          <CardDescription>
            Enter an address or transaction hash to explore blockchain details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-6">
            <Input
              type="text"
              placeholder="Enter address or transaction hash"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoading} className="md:w-auto">
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>

          <div className="flex justify-between items-center mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Advanced Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Advanced Search</DialogTitle>
                  <DialogDescription>
                    Use multiple criteria to narrow down your search
                  </DialogDescription>
                </DialogHeader>
                <AdvancedFilters />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {searchResult.transfers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              Showing results for:{" "}
              <Badge variant="outline">{searchQuery}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SearchSummary transfers={searchResult.transfers} />
            <Separator className="my-6" />
            <Tabs defaultValue="transactions" className="w-full">
              <TabsList>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>
              <TabsContent value="transactions">
                <ScrollArea className="h-[800px]">
                  <SearchResults results={paginatedResults} />
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </CardFooter>
        </Card>
      )}

      {searchResult.transfers.length === 0 &&
        !isLoading &&
        searchQuery &&
        currentPage === 1 && (
          <Card>
            <CardContent>
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No results found. Try a different search term.
              </p>
            </CardContent>
          </Card>
        )}
    </motion.div>
  );
}

