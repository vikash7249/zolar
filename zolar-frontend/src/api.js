const API_URL = 'http://65.2.179.135:5000/api';

const getToken = () => localStorage.getItem('zolar_token');
const getRefreshToken = () => localStorage.getItem('zolar_refresh');

const api = {
  post: async (endpoint, data) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(getToken() && {Authorization: `Bearer ${getToken()}`})
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  get: async (endpoint) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        ...(getToken() && {Authorization: `Bearer ${getToken()}`})
      }
    });
    return res.json();
  },
  setTokens: (access, refresh) => {
    localStorage.setItem('zolar_token', access);
    localStorage.setItem('zolar_refresh', refresh);
  },
  clearTokens: () => {
    localStorage.removeItem('zolar_token');
    localStorage.removeItem('zolar_refresh');
  },
  getUser: () => {
    const u = localStorage.getItem('zolar_user');
    return u ? JSON.parse(u) : null;
  },
  setUser: (user) => {
    localStorage.setItem('zolar_user', JSON.stringify(user));
  }
};

export default api;