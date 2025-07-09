import { action, Action, Thunk, thunk } from "easy-peasy";
import axios from "../../AxiosInstance";
import { Model } from ".";

export interface Severity {
  Low: "Low";
  Medium: "Medium";
  High: "High";
}

export interface AddressData {
  remarks: string;
  address: string;
  severity: Severity;
}

export interface Database {
  _id: number;
  name: string;
  records: number;
  lastUpdated: string;
  status: "Active" | "Inactive";
  data: AddressData[];
}

export interface DatabaseModel {
  databases: Database[];
  setDatabases: Action<DatabaseModel, Database[]>;
  searchTerm: string;
  setSearchTerm: Action<DatabaseModel, string>;
  uploadProgress: number;
  setUploadProgress: Action<DatabaseModel, number>;
  uploadDatabase: Thunk<DatabaseModel, File, undefined, Model>;
  deleteDatabase: Thunk<DatabaseModel, number, undefined, Model>;
  fetchDatabases: Thunk<DatabaseModel, void, undefined, Model>;
  viewDatabase: Thunk<DatabaseModel, number, any, Model>;
  updateDatabaseStatus: Thunk<DatabaseModel, { id: number; status: "Active" | "Inactive" }, undefined, Model>;
}

const databaseModel: DatabaseModel = {
  databases: [],
  setDatabases: action((state, payload) => {
    state.databases = payload;
  }),
  searchTerm: "",
  setSearchTerm: action((state, payload) => {
    state.searchTerm = payload;
  }),
  uploadProgress: 0,
  setUploadProgress: action((state, payload) => {
    state.uploadProgress = payload;
  }),
  uploadDatabase: thunk(async (actions, file, { getStoreActions }) => {
    const { setLoading } = getStoreActions().loadingModel;
    const { showToast } = getStoreActions().toastModel;
    setLoading(true);
    actions.setUploadProgress(0);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/databases", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
          actions.setUploadProgress(percentCompleted);
        },
      });
      if (response.status === 200) {
        actions.fetchDatabases();
        showToast({ message: 'Database uploaded successfully', type: 'success' });
      }
    } catch (error) {
      console.error("Error uploading database:", error);
      showToast({ message: 'Error uploading database', type: 'error' });
    } finally {
      setLoading(false);
      actions.setUploadProgress(0);
      actions.fetchDatabases();
    }
  }),
  deleteDatabase: thunk(async (actions, id, { getStoreActions }) => {
    const { setLoading } = getStoreActions().loadingModel;
    const { showToast } = getStoreActions().toastModel;
    setLoading(true);
    try {
      await axios.delete(`/api/databases/${id}`);
      actions.fetchDatabases();
      showToast({ message: 'Database deleted successfully', type: 'success' });
    } catch (error) {
      console.error("Error deleting database:", error);
      showToast({ message: 'Error deleting database', type: 'error' });
    } finally {
      setLoading(false);
    }
  }),
  fetchDatabases: thunk(async (actions, _, { getStoreActions }) => {
    const { setLoading } = getStoreActions().loadingModel;
    const { showToast } = getStoreActions().toastModel;
    setLoading(true);
    try {
      const response = await axios.get("/api/databases");
      actions.setDatabases(response.data);
    } catch (error) {
      console.error("Error fetching databases:", error);
      showToast({ message: 'Error fetching databases', type: 'error' });
    } finally {
      setLoading(false);
    }
  }),
  viewDatabase: thunk(async (_, id, { getStoreActions }) => {
    const { setLoading } = getStoreActions().loadingModel;
    const { showToast } = getStoreActions().toastModel;
    setLoading(true);
    try {
      const response = await axios.get(`/api/databases/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error viewing database:", error);
      showToast({ message: 'Error viewing database', type: 'error' });
      throw error;
    } finally {
      setLoading(false);
    }
  }),
  updateDatabaseStatus: thunk(async (_, { id, status }, { getStoreState, getStoreActions }) => {
    const databases = getStoreState().databaseModel.databases;
    const setDatabases = getStoreActions().databaseModel.setDatabases;
    const { setLoading } = getStoreActions().loadingModel;
    const { showToast } = getStoreActions().toastModel;
    setLoading(true);
    try {
      const response = await axios.patch(`/api/databases/${id}/status`, { status });
      if (response.status === 200) {
        const updatedDatabase = response.data;
        const updatedDatabases = databases.map((database) => (database._id === id ? updatedDatabase : database));
        setDatabases(updatedDatabases);
        showToast({ message: 'Database status updated successfully', type: 'success' });
      }
    } catch (error) {
      console.error("Error updating database status:", error);
      showToast({ message: 'Error updating database status', type: 'error' });
    } finally {
      setLoading(false);
    }
  }),
};

export default databaseModel;
