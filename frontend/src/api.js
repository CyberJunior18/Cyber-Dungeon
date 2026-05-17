const API_URL = 'http://localhost:8000/api';

const getHeaders = () => {
  const token = localStorage.getItem('cyber_token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const api = {
  setToken: (token) => {
    localStorage.setItem('cyber_token', token);
  },

  getToken: () => {
    return localStorage.getItem('cyber_token');
  },

  removeToken: () => {
    localStorage.removeItem('cyber_token');
  },

  register: async (username, email, password) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      let msg = data.message || 'Registration failed';
      msg = msg.replace(/\s*\(and\s+\d+\s+more\s+error[s]?\)/i, '');
      throw new Error(msg);
    }
    return data;
  },

  login: async (login, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ login, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      let msg = data.message || 'Login failed';
      msg = msg.replace(/\s*\(and\s+\d+\s+more\s+error[s]?\)/i, '');
      throw new Error(msg);
    }
    return data;
  },

  logout: async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: getHeaders(),
      });
    } catch (e) {
      console.error('Logout request failed', e);
    } finally {
      api.removeToken();
    }
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/user`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return await response.json();
  },

  solveChallenge: async (challengeId, flag) => {
    const response = await fetch(`${API_URL}/solve`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ challenge_id: challengeId, flag }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit solve');
    }
    return data;
  },

  getChallenges: async () => {
    const response = await fetch(`${API_URL}/challenges`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch challenges');
    }
    return await response.json();
  },

  createChallenge: async (challengeData) => {
    const response = await fetch(`${API_URL}/challenges`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(challengeData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to contribute challenge');
    }
    return data;
  },

  deleteChallenge: async (challengeId) => {
    const response = await fetch(`${API_URL}/challenges/${challengeId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete challenge');
    }
    return data;
  },

  searchUsers: async (query) => {
    const response = await fetch(`${API_URL}/admin/users/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to search players');
    }
    return await response.json();
  },

  toggleCreatorApproval: async (userId) => {
    const response = await fetch(`${API_URL}/admin/users/approve-creator`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ user_id: userId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to toggle creator permission');
    }
    return data;
  },

  getLeaderboard: async () => {
    const response = await fetch(`${API_URL}/leaderboard`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard');
    }
    return await response.json();
  },

  updateProfile: async (username, email, avatar) => {
    const response = await fetch(`${API_URL}/user/update`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, email, avatar }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }
    return data;
  },

  clearProgress: async () => {
    const response = await fetch(`${API_URL}/user/clear-progress`, {
      method: 'POST',
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to clear progress');
    }
    return data;
  },

  deleteAccount: async () => {
    const response = await fetch(`${API_URL}/user`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete account');
    }
    return data;
  },
};
