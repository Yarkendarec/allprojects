import axios from 'axios';

const API_URL = 'http://127.0.0.1:7000/api/auth';

const api = axios.create({
  baseURL: API_URL,
});

const AuthService = {
  signin: (userData) => api.post('/signin', userData),
  signup: (userData) => api.post('/signup', userData),
  resetPassword: (userData) => api.post('/reset', userData),
};

export default AuthService;