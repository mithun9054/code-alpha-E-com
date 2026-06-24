import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

export default api;

export const apiAuth = (token) =>
  axios.create({
    baseURL: 'http://localhost:5000',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });


