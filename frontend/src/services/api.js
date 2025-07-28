import axios from 'axios';

// Configuração base da API
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
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

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => response.data, // já retorna response.data diretamente
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Serviços de autenticação
export const authService = {
  login: async ({ email, senha }) => api.post('/auth/login', { email, senha }),

  register: async ({ nome, email, senha, planoId }) => {
    console.log('Payload enviado para /auth/register:', { nome, email, senha, planoId });
    return api.post('/auth/register', { nome, email, senha, planoId });
  },

  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  verifyToken: async () => api.get('/auth/verify'),

  verifyTokenRaw: async () => {
    try {
      const response = await api.get('/auth/verify', { validateStatus: () => true });
      return response;
    } catch (error) {
      return { status: 500, data: null, error };
    }
  },

  refreshToken: async () => api.post('/auth/refresh'),
};

// Serviços de usuário
export const usersService = {
  getProfile: async () => api.get('/users/profile'),

  updateProfile: async (nome, email) => api.put('/users/profile', { nome, email }),

  changePassword: async (senhaAtual, novaSenha) => api.put('/users/password', { senhaAtual, novaSenha }),

  getFavorites: async (tipo, page = 1, limit = 20) => api.get('/users/favorites', { params: { tipo, page, limit } }),

  getHistory: async (page = 1, limit = 20) => api.get('/users/history', { params: { page, limit } }),
};

// Serviços de canais
export const channelsService = {
  getChannels: async (params = {}) => api.get('/channels', { params }),

  getChannel: async (id) => api.get(`/channels/${id}`),

  getChannelStream: async (id) => api.get(`/channels/${id}/stream`),

  getChannelEPG: async (id, date) => api.get(`/channels/${id}/epg`, { params: { date } }),

  addToFavorites: async (id) => api.post(`/channels/${id}/favorite`),

  removeFromFavorites: async (id) => api.delete(`/channels/${id}/favorite`),

  getFavoriteChannels: async () => api.get('/channels/favorites/list'),
};

// Serviços de categorias
export const categoryService = {
  getCategories: async () => api.get('/categories'),

  getCategory: async (id) => api.get(`/categories/${id}`),

  getCategoryChannels: async (id, page = 1, limit = 20) => api.get(`/categories/${id}/channels`, { params: { page, limit } }),
};

// Serviços de planos
export const plansService = {
  getAll: async () => api.get('/plans'),

  getPlans: async () => api.get('/plans'),

  getPlan: async (id) => api.get(`/plans/${id}`),
};

// Serviços de VOD (Video on Demand)
export const vodService = {
  getMovies: async (params = {}) => api.get('/vod/movies', { params }),

  getMovie: async (id) => api.get(`/vod/movies/${id}`),

  getMoviesStream: async (id) => api.get(`/vod/movies/${id}/stream`),

  getSeries: async (params = {}) => api.get('/vod/series', { params }),

  getSerie: async (id) => api.get(`/vod/series/${id}`),

  getSerieEpisodes: async (id, temporada, page = 1, limit = 20) => api.get(`/vod/series/${id}/episodes`, { params: { temporada, page, limit } }),

  getEpisodeStream: async (id) => api.get(`/vod/episodes/${id}/stream`),

  getFeatured: async () => api.get('/vod/featured'),
};

// Serviços de EPG
export const epgService = {
  getAll: (params) => api.get('/epg', { params }),

  getById: (id) => api.get(`/epg/${id}`),

  getByChannel: (channelId, params) => api.get(`/epg/channel/${channelId}`, { params }),

  getByDate: (date) => api.get('/epg/date', { params: { date } }),

  getEPG: async (date, canalId, page = 1, limit = 50) => api.get('/epg', { params: { date, canalId, page, limit } }),

  getCurrentPrograms: async (canalId) => api.get('/epg/now', { params: { canalId } }),

  getNextPrograms: async (canalId, hours = 6) => api.get('/epg/next', { params: { canalId, hours } }),

  getProgramsByCategory: async (categoria, date, page = 1, limit = 20) => api.get(`/epg/category/${categoria}`, { params: { date, page, limit } }),

  getProgram: async (id) => api.get(`/epg/program/${id}`),

  getProgramCategories: async () => api.get('/epg/categories'),
};

// Serviços do dashboard
export const dashboardService = {
  getStats: async () => api.get('/dashboard/stats'),

  getRecentActivity: async (limit = 5) => api.get('/dashboard/activity', { params: { limit } }),

  getSystemHealth: async () => api.get('/dashboard/health'),

  getFullDashboard: async () => api.get('/dashboard'),
};

export default api;
