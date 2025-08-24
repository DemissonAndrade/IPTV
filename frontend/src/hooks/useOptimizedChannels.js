import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { channelsService, categoryService, epgService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// Hook otimizado para carregamento de canais com performance melhorada
export const useOptimizedChannels = () => {
  const { isAuthenticated } = useAuth();
  
  // Estados otimizados
  const [channels, setChannels] = useState({});
  const [categories, setCategories] = useState([]);
  const [currentPrograms, setCurrentPrograms] = useState([]);
  const [favoriteChannelIds, setFavoriteChannelIds] = useState(new Set());
  
  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtros com debounce
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    quality: '',
    language: '',
    country: '',
  });
  
  // Paginação infinita
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 30,
    totalPages: 1,
    totalItems: 0,
    hasMore: true,
  });
  
  // Cache local
  const cacheRef = useRef(new Map());
  const abortControllerRef = useRef(null);
  
  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Abortar requisições pendentes
  const abortPendingRequests = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Carregamento otimizado com cache
  const loadChannels = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) {
        setInitialLoading(true);
      } else {
        setLoading(true);
      }
      
      setError(null);
      abortPendingRequests();
      
      abortControllerRef.current = new AbortController();
      
      const params = { 
        search: debouncedSearch,
        category: filters.category,
        quality: filters.quality,
        language: filters.language,
        country: filters.country,
        page: pageNum,
        limit: pagination.limit
      };
      
      // Remove filtros vazios
      Object.keys(params).forEach(key => !params[key] && delete params[key]);
      
      // Verificar cache
      const cacheKey = JSON.stringify(params);
      if (cacheRef.current.has(cacheKey) && pageNum === 1) {
        const cached = cacheRef.current.get(cacheKey);
        setChannels(cached.channels);
        setPagination(cached.pagination);
        setInitialLoading(false);
        setLoading(false);
        return;
      }
      
      const response = await channelsService.getChannels(params);
      
      // Processamento otimizado
      const groupedChannels = {};
      const channelsData = response.data || [];
      
      channelsData.forEach(channel => {
        const categoryName = channel.categoria_nome || 'Sem Categoria';
        if (!groupedChannels[categoryName]) {
          groupedChannels[categoryName] = [];
        }
        
        // URL otimizada para imagens
        groupedChannels[categoryName].push({
          ...channel,
          safeLogoUrl: getOptimizedImageUrl(channel.logo_url, channel.name)
        });
      });
      
      // Atualizar estado
      if (append) {
        setChannels(prev => {
          const updated = { ...prev };
          Object.keys(groupedChannels).forEach(category => {
            if (!updated[category]) {
              updated[category] = [];
            }
            updated[category] = [...updated[category], ...groupedChannels[category]];
          });
          return updated;
        });
      } else {
        setChannels(groupedChannels);
      }
      
      setPagination({
        page: pageNum,
        limit: pagination.limit,
        totalPages: response.pagination.totalPages,
        totalItems: response.pagination.total,
        hasMore: pageNum < response.pagination.totalPages
      });
      
      // Cachear resposta
      if (pageNum === 1) {
        cacheRef.current.set(cacheKey, {
          channels: groupedChannels,
          pagination: {
            page: pageNum,
            limit: pagination.limit,
            totalPages: response.pagination.totalPages,
            totalItems: response.pagination.total,
            hasMore: pageNum < response.pagination.totalPages
          }
        });
      }
      
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Erro ao carregar canais:', err);
        setError('Erro ao carregar canais. Tente novamente.');
      }
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  }, [debouncedSearch, filters, pagination.limit, abortPendingRequests]);

  // Carregamento de categorias com cache
  const loadCategories = useCallback(async () => {
    try {
      const cacheKey = 'categories';
      if (cacheRef.current.has(cacheKey)) {
        setCategories(cacheRef.current.get(cacheKey));
        return;
      }
      
      const response = await categoryService.getCategories();
      const categoriesData = response.data || [];
      setCategories(categoriesData);
      cacheRef.current.set(cacheKey, categoriesData, 600); // 10 minutos
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  }, []);

  // Carregamento de programação atual
  const loadCurrentPrograms = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const cacheKey = 'current-programs';
      if (cacheRef.current.has(cacheKey)) {
        setCurrentPrograms(cacheRef.current.get(cacheKey));
        return;
      }
      
      const response = await epgService.getCurrentPrograms();
      const programs = response.data || [];
      setCurrentPrograms(programs);
      cacheRef.current.set(cacheKey, programs, 60); // 1 minuto
    } catch (err) {
      console.error('Erro ao carregar programação:', err);
    }
  }, [isAuthenticated]);

  // Carregamento de favoritos
  const loadFavoriteChannels = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await channelsService.getFavoriteChannels();
      const favIds = new Set((response.data || []).map(ch => ch.id));
      setFavoriteChannelIds(favIds);
    } catch (err) {
      console.error('Erro ao carregar favoritos:', err);
    }
  }, [isAuthenticated]);

  // Carregamento inicial
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        loadCategories(),
        loadChannels(1, false),
        loadCurrentPrograms(),
        loadFavoriteChannels()
      ]);
    };
    
    loadInitialData();
    
    return () => {
      abortPendingRequests();
    };
  }, []);

  // Recarregar quando filtros mudam
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1, hasMore: true }));
    loadChannels(1, false);
  }, [debouncedSearch, filters.category, filters.quality, filters.language, filters.country]);

  // Função para carregar mais canais (infinite scroll)
  const loadMoreChannels = useCallback(() => {
    if (!loading && pagination.hasMore) {
      loadChannels(pagination.page + 1, true);
    }
  }, [loading, pagination.hasMore, pagination.page, loadChannels]);

  // Funções auxiliares otimizadas
  const getOptimizedImageUrl = (url, channelName) => {
    if (!url) return getPlaceholderUrl(channelName);
    
    try {
      // URLs locais mantidas
      if (url.startsWith('/') || url.includes(window.location.hostname)) {
        return url;
      }
      
      // Otimização com WebP e lazy loading
      const cleanUrl = url.replace(/^https?:\/\//, '');
      return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&w=150&h=75&fit=contain&output=webp&q=70&lazy=true`;
    } catch {
      return getPlaceholderUrl(channelName);
    }
  };

  const getPlaceholderUrl = (channelName) => {
    const colors = ['4285F4', 'EA4335', 'FBBC05', '34A853', 'FF6D00'];
    const color = colors[channelName?.charCodeAt(0) % colors.length] || '4285F4';
    const text = encodeURIComponent(channelName?.substring(0, 12) || 'TV');
    return `https://via.placeholder.com/150x75/${color}/FFFFFF?text=${text}`;
  };

  const getCurrentProgram = useCallback((channelId) => {
    return currentPrograms.find(p => p.channel_id === channelId);
  }, [currentPrograms]);

  // Handlers otimizados
  const handleFilterChange = useCallback((name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    // Resetar cache quando filtros mudam
    cacheRef.current.clear();
  }, []);

  const handleToggleFavorite = useCallback(async (channelId) => {
    if (!isAuthenticated) return;
    
    try {
      if (favoriteChannelIds.has(channelId)) {
        await channelsService.removeFromFavorites(channelId);
        setFavoriteChannelIds(prev => new Set([...prev].filter(id => id !== channelId)));
      } else {
        await channelsService.addToFavorites(channelId);
        setFavoriteChannelIds(prev => new Set([...prev, channelId]));
      }
    } catch (err) {
      console.error('Erro ao atualizar favoritos:', err);
      setError('Erro ao atualizar favoritos');
    }
  }, [isAuthenticated, favoriteChannelIds]);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      category: '',
      quality: '',
      language: '',
      country: '',
    });
    cacheRef.current.clear();
  }, []);

  const refreshChannels = useCallback(() => {
    cacheRef.current.clear();
    loadChannels(1, false);
  }, [loadChannels]);

  return {
    channels,
    categories,
    loading,
    initialLoading,
    error,
    filters,
    pagination,
    favoriteChannelIds,
    currentPrograms,
    getCurrentProgram,
    handleFilterChange,
    handleToggleFavorite,
    clearFilters,
    loadMoreChannels,
    refreshChannels,
    setFilters
  };
};
