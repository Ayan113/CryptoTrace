import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

console.log(import.meta.env.VITE_BACKEND_URL);

axiosInstance.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('jwt');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  (response) => {    
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.localStorage.removeItem('jwt');
      // @ts-ignore
      window.location = '/auth' as string;
      return;
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;