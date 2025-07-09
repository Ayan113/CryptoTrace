import { Action, action, Thunk, thunk } from 'easy-peasy';
import axios from '../../AxiosInstance';
import { Model } from '.';
import { Severity } from './database.model';

export interface Alert {
  _id: number;
  type: Severity;
  description: string;
  amount: number;
  currency: string;
  timestamp: string;
  status: string;
  hash: string;
}

export interface AlertModel {
  alerts: Alert[];
  setAlerts: Action<AlertModel, Alert[]>;
  fetchAlerts: Thunk<AlertModel, void, undefined, Model>;
  updateAlertStatus: Thunk<AlertModel, { id: number; status: string }, undefined, Model>;
}

const alertModel: AlertModel = {
  alerts: [],
  setAlerts: action((state, alerts) => {
    state.alerts = alerts;
  }),
  fetchAlerts: thunk(async (actions, _, { getStoreActions }) => {
    const { setLoading } = getStoreActions().loadingModel;
    const { showToast } = getStoreActions().toastModel;
    try {
      const res = await axios.get('/api/alerts');
      actions.setAlerts(res.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      showToast({ message: 'Error fetching alerts', type: 'error' });
    } finally {
      setLoading(false);
    }
  }),
  updateAlertStatus: thunk(async (_, { id, status }, { getStoreState, getStoreActions }) => {
    const alerts = getStoreState().alertModel.alerts;
    const setAlerts = getStoreActions().alertModel.setAlerts;
    const { showToast } = getStoreActions().toastModel;
    const { setLoading } = getStoreActions().loadingModel;
    setLoading(true);

    try {
      const res = await axios.patch(`/api/alerts/${id}/status`, { status });
      if (res.status === 200) {
        const updatedAlert = res.data;
        const updatedAlerts = alerts.map((alert) => {
          if (alert._id === id) {
            return updatedAlert;
          }
          return alert;
        });
        setAlerts(updatedAlerts);
        showToast({ message: 'Alert status updated successfully', type: 'success' });
      }
    } catch (error) {
      console.error('Error updating alert status:', error);
      showToast({ message: 'Error updating alert status', type: 'error' });
    } finally {
      setLoading(false);
    }
  })
};

export default alertModel;