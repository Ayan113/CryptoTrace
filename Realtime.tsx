import React, { useEffect, useState, useCallback } from 'react';
import { ExternalLink, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Block, Transaction } from '@/store/models/transactions.model';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, LinkIcon, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStoreActions, useStoreState } from '@/store/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { useHandleCopy } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import axios from '../AxiosInstance';

const transactionVariants = {
  initial: { opacity: 0, y: -100, height: 'auto' },
  animate: { opacity: 1, y: 0, height: 'auto' },
  exit: { opacity: 0, y: -100, height: 0 },
};

interface TransactionItemProps {
  tx: Transaction;
  onViewDetails: (transaction: Transaction) => void;
}
interface TransactionDetailsProps {
  transaction: Transaction;
}

interface BlockDetailsProps {
  block: Block;
  onClose: () => void;
  onViewTransaction: (transaction: Transaction) => void;
}

const TransactionItem = React.memo(({ tx, onViewDetails }: TransactionItemProps) => {
  return (
    <motion.div
      key={`${tx.id}-${tx.timestamp}`}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={transactionVariants}
      transition={{ duration: 0.3 }}
      className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-gray-500 dark:text-gray-400">
            From:
          </span>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
          </span>
        </div>
        <ChevronRight className="text-gray-400" />
        <div className="flex items-center space-x-2">
          <span className="text-gray-500 dark:text-gray-400">
            To:
          </span>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            {tx.to?.slice(0, 6)}...{tx.to?.slice(-4)}
          </span>
        </div>
      </div>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-blue-600 dark:text-blue-400 font-semibold">
          {parseFloat(tx.amount).toFixed(4)} ETH
        </span>
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          {new Date(tx.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <div className="mt-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" onClick={() => onViewDetails(tx)}>
              View Details
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
    </motion.div>
  );
});

function FullScreenLoading() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
        <h2 className="mt-4 text-xl font-semibold">Predicting Fraud</h2>
        <p className="mt-2 text-muted-foreground">This may take a few moments...</p>
      </div>
    </div>
  )
}

function TransactionDetails({ transaction }: TransactionDetailsProps) {
  const handleCopy = useHandleCopy();
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<{ Prediction: number; Fraud_Probability: number } | null>(null);
  const { toast } = useToast();
  
  const handlePredictFraud = async () => {
    setIsPredicting(true);
    try {
      const response = await axios(`/api/transactions/${transaction.from}/predict`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch prediction');
      }
      const data = await response.data
      setPredictionResult(data);
    } catch (error) {
      console.error('Error predicting fraud:', error);
      toast({
        title: "Error",
        description: "Failed to predict fraud. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Transaction Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction Hash</p>
              <p className="font-mono text-sm whitespace-nowrap overflow-x-auto text-blue-600 dark:text-blue-400 hover:cursor-pointer" onClick={() => handleCopy(transaction.id)}>
                {transaction.id}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Block</p>
              <p className="font-mono text-sm break-all hover:cursor-pointer" onClick={() => handleCopy(transaction.blockId)}>
                {transaction.blockId}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">From</p>
            <p className="font-mono text-sm break-all hover:cursor-pointer" onClick={() => handleCopy(transaction.from)}>
              {transaction.from}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">To</p>
            <p className="font-mono text-sm break-all hover:cursor-pointer" onClick={() => handleCopy(transaction.to)}>
              {transaction.to}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount</p>
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 font-mono">{parseFloat(transaction.amount).toFixed(4)} ETH</p>
            </div>
            <div className="space-y-2 text-right">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Timestamp</p>
              <p className="text-sm">{new Date(transaction.timestamp).toLocaleString()}</p>
            </div>
          </div>
          <div className="pt-4 flex justify-between items-center">
            <a
              href={`https://etherscan.io/tx/${transaction.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View on Etherscan
              <ExternalLink className="ml-2 -mr-1 h-4 w-4" />
            </a>
            <Button
              onClick={handlePredictFraud}
              disabled={isPredicting}
              className="ml-4"
            >
              {isPredicting ? 'Predicting...' : 'Predict Fraud'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!predictionResult} onOpenChange={() => setPredictionResult(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Fraud Prediction Result</DialogTitle>
          </DialogHeader>
          <div className="mt-4 text-center">
            {predictionResult?.Prediction === 0 ? (
              <div className="text-green-600">
                <CheckCircle className="h-16 w-16 mx-auto mb-2" />
                <p className="text-xl font-semibold">No Fraud Detected</p>
              </div>
            ) : (
              <div className="text-red-600">
                <AlertTriangle className="h-16 w-16 mx-auto mb-2" />
                <p className="text-xl font-semibold">Potential Fraud Detected</p>
              </div>
            )}
            <p className="mt-4 text-lg">
              Fraud Probability: <span className="font-bold">{((predictionResult?.Fraud_Probability ?? 0) * 100).toFixed(2)}%</span>
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setPredictionResult(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {isPredicting && <FullScreenLoading />}
    </motion.div>
  );
}
function BlockDetails({ block, onClose, onViewTransaction }: BlockDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-4xl mx-auto h-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Block Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Block Number</p>
              <p className="font-mono text-sm">{block.id}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Timestamp</p>
              <p className="font-mono text-sm">{new Date(block.timestamp).toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Transactions</p>
              <p className="font-mono text-sm">{block.transactions.length}</p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Transactions in this block:</h3>
            <div className="space-y-2 overflow-y-auto pr-2 max-h-[30vh]">
              {block.transactions.map((tx) => (
                <Button
                  key={tx.id}
                  variant="ghost"
                  className="w-full justify-start font-mono text-sm text-left overflow-hidden"
                  onClick={() => onViewTransaction(tx)}
                >
                  <span className="truncate">{tx.id}</span>
                </Button>
              ))}
            </div>
          </div>
          <div className="pt-4 flex justify-center">
            <Button onClick={onClose}>Close</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}


export function Realtime() {
  const transactions = useStoreState(state => state.transactionsModel.transactions);
  const blocks = useStoreState(state => state.transactionsModel.blocks);
  const fetchTransactions = useStoreActions(actions => actions.transactionsModel.fetchTransactions);
  const [newBlockIndicator, setNewBlockIndicator] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  
  const handleViewTransactionDetails = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
  }, []);

  const handleViewBlockDetails = useCallback((block: Block) => {
    setSelectedBlock(block);
    setIsBlockModalOpen(true);
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    if (blocks.length > 0) {
      setNewBlockIndicator(true);
      const timer = setTimeout(() => setNewBlockIndicator(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [blocks]);

  const handleViewTransactionFromBlock = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsBlockModalOpen(false);
    setIsTransactionModalOpen(true);
  }, []);

  const isLoading = transactions.length === 0 && blocks.length === 0;

  const orderedTransactions = [...transactions].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center">
          <Radio className="mr-2 h-8 w-8 text-primary" />
          Ethereum Transaction Stream
        </h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: newBlockIndicator ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="bg-green-500 h-3 w-3 rounded-full"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest Blocks</CardTitle>
          <CardDescription>
            Most recent Ethereum blocks and their connections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="flex items-center space-x-2 overflow-x-auto pb-4 scroll-smooth"
          >
            <AnimatePresence initial={false}>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="w-32 h-24 rounded-md flex-shrink-0"
                  />
                ))
              ) : (
                blocks.map((block, index) => (
                  <motion.div
                    key={block.id}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={transactionVariants}
                    transition={{ duration: 0.3 }}
                    className="flex items-center flex-shrink-0"
                  >
                    <div 
                      className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 w-32 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleViewBlockDetails(block)}
                    >
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">
                          {block.id}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {block.transactions.length} txs
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(block.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    {index < blocks.length - 1 && (
                      <LinkIcon className="h-6 w-6 text-gray-400 mx-2 flex-shrink-0" />
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest Ethereum transactions (Max 20)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 overflow-hidden">
            <AnimatePresence initial={false}>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="w-full h-32 rounded-lg"
                  />
                ))
              ) : (
                orderedTransactions.map(tx => (
                  <TransactionItem
                    key={`${tx.id}-${tx.timestamp}`}
                    tx={tx}
                    onViewDetails={handleViewTransactionDetails}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
      <Dialog open={isTransactionModalOpen} onOpenChange={setIsTransactionModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          {selectedTransaction && <TransactionDetails transaction={selectedTransaction} />}
        </DialogContent>
      </Dialog>
      <Dialog open={isBlockModalOpen} onOpenChange={setIsBlockModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[95vh] overflow-hidden">
          {selectedBlock && (
            <BlockDetails
              block={selectedBlock}
              onClose={() => setIsBlockModalOpen(false)}
              onViewTransaction={handleViewTransactionFromBlock}
            />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default Realtime;