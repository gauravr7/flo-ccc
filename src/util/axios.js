import axios from 'axios';

const axiosInstance = axios.create({
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
