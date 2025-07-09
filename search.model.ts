import { action, Action, Thunk, thunk } from "easy-peasy";
import axios from "../../AxiosInstance";
import { Model } from ".";

interface RawContract {
  value: string | null;
  address: string;
  decimal: number | null;
}

export interface Transfer {
  blockNum: string;
  uniqueId: string;
  hash: string;
  from: string;
  to: string;
  value: string | null;
  erc721TokenId: string;
  erc1155Metadata: any | null;
  tokenId: string;
  asset: string;
  category: string;
  rawContract?: RawContract;
  logs?: any;
}

export interface SearchResult {
  transfers: Transfer[];
}

export interface SearchModel {
  searchQuery: string;
  setSearchQuery: Action<SearchModel, string>;
  searchResult: SearchResult;
  setSearchResults: Action<SearchModel, SearchResult>;
  advancedFilters: boolean;
  setAdvancedFilters: Action<SearchModel, boolean>;
  search: Thunk<SearchModel, string, undefined, Model>;
}

const searchModel: SearchModel = {
  searchQuery: "",
  setSearchQuery: action((state, query) => {
    state.searchQuery = query;
  }),
  searchResult: { transfers: [] },
  setSearchResults: action((state, results) => {
    state.searchResult = results;
  }),
  advancedFilters: false,
  setAdvancedFilters: action((state, filters) => {
    state.advancedFilters = filters;
  }),
  search: thunk(async (actions, searchQuery, { getStoreActions }) => {
    const { setLoading } = getStoreActions().loadingModel;
    const { showToast } = getStoreActions().toastModel;
    setLoading(true);
    try {
      const response = await axios.post("/api/search", { query: searchQuery });
      actions.setSearchResults({ transfers: response.data });
    } catch (error) {
      console.error("Error fetching search results:", error);
      showToast({ message: 'Error fetching search results', type: 'error' });
    } finally {
      setLoading(false);
    }
  }),
};

export default searchModel;
