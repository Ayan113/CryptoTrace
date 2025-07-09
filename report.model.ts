import { action, Action, Thunk, thunk } from "easy-peasy";
import axios from "../../AxiosInstance";
import { Model } from ".";

export interface Report {
  _id: number;
  title: string;
  type: string;
  createdDate: string;
  status: "Completed" | "In Progress";
  content: string;
}

export interface ReportModel {
  reports: Report[];
  setReports: Action<ReportModel, Report[]>;
  fetchReports: Thunk<ReportModel, void, undefined, Model>;
  deleteReport: Thunk<ReportModel, number, undefined, Model>;
}

const reportModel: ReportModel = {
  reports: [],
  setReports: action((state, payload) => {
    state.reports = payload;
  }),
  fetchReports: thunk(async (actions, _, { getStoreActions }) => {
    const { setLoading } = getStoreActions().loadingModel;
    const { showToast } = getStoreActions().toastModel;
    setLoading(true);
    try {
      const response = await axios.get("/api/reports");
      actions.setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      showToast({ message: 'Error fetching reports', type: 'error' });
    } finally {
      setLoading(false);
    }
  }),
  deleteReport: thunk(async (actions, id, { getStoreActions }) => {
    const { setLoading } = getStoreActions().loadingModel;
    const { showToast } = getStoreActions().toastModel;
    setLoading(true);
    try {
      await axios.delete(`/api/reports/${id}`);
      actions.fetchReports();
      showToast({ message: 'Report deleted successfully', type: 'success' });
    } catch (error) {
      console.error("Error deleting report:", error);
      showToast({ message: 'Error deleting report', type: 'error' });
    } finally {
      setLoading(false);
    }
  }),
};

export default reportModel;