import axios from 'axios';

// Create axios instance
export const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth
  auth: {
    adminLogin: '/auth/admin/login',
    publicLogin: '/auth/public/login',
    me: '/auth/me',
  },
  
  // Events
  events: {
    list: '/events',
    detail: (id) => `/events/${id}`,
    create: '/events',
    update: (id) => `/events/${id}`,
    delete: (id) => `/events/${id}`,
    updateStatus: (id) => `/events/${id}/status`,
    addWinners: (id) => `/events/${id}/winners`,
  },
  
  // Leaderboard
  leaderboard: {
    list: '/leaderboard',
    pointsSystem: '/leaderboard/points-system',
  },
  
  // Photos
  photos: {
    list: '/photos',
    create: '/photos',
  },
  
  // Announcements
  announcements: {
    list: '/announcements',
    detail: (id) => `/announcements/${id}`,
    create: '/announcements',
  },
  
  // Comments
  comments: {
    list: '/comments',
    create: '/comments',
    delete: (id) => `/comments/${id}`,
  },
  
  // Health
  health: '/health',
};

// Helper functions
export const apiHelpers = {
  // Format date for API
  formatDate: (date) => {
    if (typeof date === 'string') return date;
    return date.toISOString().split('T')[0];
  },
  
  // Format time for display
  formatTime: (time) => {
    if (!time) return '';
    return time.replace(/(\d{1,2}):(\d{2})\s*(AM|PM)/i, (match, hour, minute, period) => {
      const h = parseInt(hour);
      const m = minute;
      const p = period.toUpperCase();
      return `${h.toString().padStart(2, '0')}:${m} ${p}`;
    });
  },
  
  // Get status color
  getStatusColor: (status) => {
    switch (status) {
      case 'Upcoming':
        return 'blue';
      case 'Active':
        return 'green';
      case 'Concluded':
        return 'gray';
      default:
        return 'gray';
    }
  },
  
  // Get event type icon
  getEventTypeIcon: (type) => {
    switch (type) {
      case 'Individual':
        return '👤';
      case 'Team':
        return '👥';
      default:
        return '🏆';
    }
  },
  
  // Get category icon
  getCategoryIcon: (category) => {
    switch (category) {
      case 'Boys':
        return '👨';
      case 'Girls':
        return '👩';
      default:
        return '🏃';
    }
  },
  
  // Get game icon
  getGameIcon: (game) => {
    const gameIcons = {
      'Cricket': '🏏',
      'Football': '⚽',
      'Basketball': '🏀',
      'Volleyball': '🏐',
      'Badminton': '🏸',
      'TableTennis': '🏓',
      'Athletics': '🏃',
      'Chess': '♟️',
      'Carrom': '🎯',
    };
    return gameIcons[game] || '🏆';
  },
};

export default api; 