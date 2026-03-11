import axios from 'axios';

const noAuthClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  // baseURL:"http://localhost:3000",
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default noAuthClient;
