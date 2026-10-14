api_code = """import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
  }
  return Promise.reject(error);
});

export default api;
"""

with open(r'D:\CreatorHub\frontend\src\services\api.ts', 'w', encoding='utf-8') as f:
    f.write(api_code.strip())

print("Added default export to api.ts!")
