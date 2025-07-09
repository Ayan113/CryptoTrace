import { action, thunk, Action, Thunk } from "easy-peasy";
import { Model } from ".";
import axios from "@/AxiosInstance";

export interface Transaction {
  id: string;
  blockId: string;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
}

export interface TimeSeriesData {
  timestamp: number;
  value: number;
}

export interface HashRateData {
  data: TimeSeriesData[];
}

export interface CoinData {
  symbol: string;
  data: TimeSeriesData[];
}

export interface Block {
  id: string;
  number: number;
  transactions: Transaction[];
  timestamp: number;
}

export interface NetworkAnalysisData {
  hashRateData: HashRateData;
  topCoinsData: CoinData[];
}

export interface TransactionsModel {
  transactions: Transaction[];
  blocks: Block[];
  setTransactions: Action<TransactionsModel, Transaction[]>;
  addTransaction: Thunk<TransactionsModel, Transaction, undefined, Model>;
  setBlocks: Action<TransactionsModel, Block[]>;
  fetchTransactions: Thunk<TransactionsModel, void, undefined, Model>;
  networkAnalysis: NetworkAnalysisData;
  setNetworkAnalysis: Action<TransactionsModel, NetworkAnalysisData>;
  getNetworkAnalysis: Thunk<TransactionsModel, void, undefined, Model>;
}

const transactionsModel: TransactionsModel = {
  transactions: [],
  blocks: [],

  setTransactions: action((state, payload) => {
    const sortedTransactions = [...payload].sort(
      (a, b) => b.timestamp - a.timestamp
    );
    state.transactions = sortedTransactions;
  }),

  addTransaction: thunk(async (actions, payload, { getState }) => {
    const currentTransactions = getState().transactions;
    const isDuplicate = currentTransactions.some((tx) => tx.id === payload.id);
    if (isDuplicate) return;

    const newTransactions = [payload, ...currentTransactions];
    actions.setTransactions(newTransactions);
  }),

  setBlocks: action((state, payload) => {
    payload.forEach((newBlock) => {
      const existingBlock = state.blocks.find((b) => b.id === newBlock.id);
      if (existingBlock) {
        existingBlock.transactions.push(...newBlock.transactions);
      } else {
        state.blocks.unshift(newBlock);
      }
    });
  }),

  fetchTransactions: thunk((actions) => {
    const socket = new WebSocket("ws://localhost:3000/ws/transactions");

    socket.onmessage = (event) => {
      const transaction: Transaction = JSON.parse(event.data);
      const block: Block = {
        id: transaction.blockId,
        number: parseInt(transaction.blockId, 16),
        transactions: [transaction],
        timestamp: transaction.timestamp,
      };
      actions.addTransaction(transaction);
      actions.setBlocks([block]);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }),
  networkAnalysis: {
    hashRateData: { data: [] },
    topCoinsData: [],
  },
  setNetworkAnalysis: action((state, payload) => {
    state.networkAnalysis = payload;
  }),
  getNetworkAnalysis: thunk(async (actions, _, { getStoreActions }) => {
    const { setLoading } = getStoreActions().loadingModel;
    const { showToast } = getStoreActions().toastModel;
    setLoading(true);
    try {
      const response = await axios("/api/network-analysis");
      const data = await response.data;
      actions.setNetworkAnalysis(data);
    } catch (error) {
      console.error("Error fetching network analysis:", error);
      showToast({ message: 'Error fetching network analysis', type: 'error' });
    } finally {
      setLoading(false);
    }
  }),
};

export default transactionsModel;
