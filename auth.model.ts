import { action, Action, thunk, Thunk } from 'easy-peasy';
import axios from '../../AxiosInstance';
import { Model } from '.';

interface User {
  id: number;
  name: string;
  email: string;
  agency: string;
  role: string;
}

export interface AccessRequest extends Omit<User, 'id'> {
  reason: string;
}

export interface AuthModel {
  user: User | null;
  setUser: Action<AuthModel, User | null>;
  getUser: Thunk<AuthModel, void, undefined, Model>;
  login: Thunk<AuthModel, { email: string; password: string }, undefined, Model>;
  requestAccess: Thunk<AuthModel, AccessRequest, undefined, Model>;
}

const authModel: AuthModel = {
  user: null,
  setUser: action((state, payload) => {
    state.user = payload;
  }),
  getUser: thunk(async (actions, __, { getStoreActions }) => {
    const { setLoading } = getStoreActions().loadingModel;
    const { showToast } = getStoreActions().toastModel;
    setLoading(true);
    try {
      const res = await axios.get('/api/auth/user');
      actions.setUser(res.data);
    } catch (error) {
      console.error('Error getting user:', error);
      showToast({ message: 'Error getting user', type: 'error' });
    } finally {
      setLoading(false);
    }
  }),
  login: thunk(async (actions, payload, { getStoreActions }) => {
    const { setLoading } = getStoreActions().loadingModel;
    const { showToast } = getStoreActions().toastModel;
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', payload);
      const token = response.data.token;
      localStorage.setItem('jwt', token);
      actions.getUser();
      showToast({ message: 'Login successful', type: 'success' });
    } catch (error) {
      console.error('Error logging in:', error);
      showToast({ message: 'Error logging in', type: 'error' });
    } finally {
      setLoading(false);
    }
  }),
  requestAccess: thunk(async (_, payload, { getStoreActions }) => {
    const { setLoading } = getStoreActions().loadingModel;
    const { showToast } = getStoreActions().toastModel;
    setLoading(true);
    try {
      await axios.post('/api/auth/request-access', payload);
      showToast({ message: 'Access request sent', type: 'success' });
    } catch (error) {
      console.error('Error requesting access:', error);
      showToast({ message: 'Error requesting access', type: 'error' });
    } finally {
      setLoading(false);
    }
  }),
};

export default authModel;