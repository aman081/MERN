import axios from 'axios';

// Create axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Now environment-aware
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  auth: {
    adminLogin: '/auth/admin/login',
    publicLogin: '/auth/public/login',
    me: '/auth/me',
  },
  events: {
    list: '/events',
    detail: (id) => `/events/${id}`,
    create: '/events',
    update: (id) => `/events/${id}`,
    delete: (id) => `/events/${id}`,
    updateStatus: (id) => `/events/${id}/status`,
    addWinners: (id) => `/events/${id}/winners`,
  },
  leaderboard: {
    list: '/leaderboard',
    pointsSystem: '/leaderboard/points-system',
  },
  photos: {
    list: '/photos',
    create: '/photos',
  },
  announcements: {
    list: '/announcements',
    detail: (id) => `/announcements/${id}`,
    create: '/announcements',
  },
  comments: {
    list: '/comments',
    create: '/comments',
    delete: (id) => `/comments/${id}`,
  },
  health: '/health',
  chatbot: '/chatbot',
};

// Helper functions
export const apiHelpers = {
  formatDate: (date) => {
    if (typeof date === 'string') return date;
    return date.toISOString().split('T')[0];
  },

  formatTime: (time) => {
    if (!time) return '';
    return time.replace(/(\d{1,2}):(\d{2})\s*(AM|PM)/i, (match, hour, minute, period) => {
      const h = parseInt(hour);
      const m = minute;
      const p = period.toUpperCase();
      return `${h.toString().padStart(2, '0')}:${m} ${p}`;
    });
  },

  getStatusColor: (status) => {
    switch (status) {
      case 'Upcoming': return 'blue';
      case 'Active': return 'green';
      case 'Concluded': return 'gray';
      default: return 'gray';
    }
  },

  getEventTypeIcon: (type) => {
    switch (type) {
      case 'Individual': return '👤';
      case 'Team': return '👥';
      default: return '🏆';
    }
  },

  getCategoryIcon: (category) => {
    switch (category) {
      case 'Boys': return '👨';
      case 'Girls': return '👩';
      default: return '🏃';
    }
  },

  getGameIcon: (game) => {
    const gameIcons = {
      Cricket: '🏏',
      Football: '⚽',
      Basketball: '🏀',
      Volleyball: '🏐',
      Badminton: '🏸',
      TableTennis: '🏓',
      Athletics: '🏃',
      Chess: '♟️',
      Carrom: '🎯',
    };
    return gameIcons[game] || '🏆';
  },
};

export default api;
