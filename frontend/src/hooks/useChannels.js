import { useState, useEffect, useCallback, useMemo } from 'react';
import { channelsService, categoryService, epgService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const useChannels = () => {
  const { isAuthenticated } = useAuth();
  
  // Estados otimizados
  const [channels, setChannels] = useState({});
  const [categories, setCategories] = useState([]);
  const [currentPrograms, setCurrentPrograms] = useState([]);
  const [favoriteChannelIds, setFavoriteChannelIds] = useState(new Set());
  
  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    quality: '',
    language: '',
    country: '',
  });
  
  // Paginação
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50, // Reduzido para melhor performance
    totalPages: 1,
    totalItems: 0,
  });

  // Cache de imagens otimizadas
  const imageCache = useMemo(() => new Map(), []);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Carregamento otimizado
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const promises = [
        loadCategories(),
        loadChannels(),
      ];
      
      if (isAuthenticated) {
        promises.push(loadCurrentPrograms());
        promises.push(loadFavoriteChannels());
      }
      
      await Promise.allSettled(promises);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, debouncedSearch, filters.category, filters.quality, filters.language]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  const loadChannels = async () => {
    try {
      const params = { 
        search: debouncedSearch,
        category: filters.category,
        quality: filters.quality,
        language: filters.language,
        page: pagination.page,
        limit: pagination.limit
      };
      
      // Remove filtros vazios
      Object.keys(params).forEach(key => !params[key] && delete params[key]);
      
      const response = await channelsService.getChannels(params);
      
      // Processamento otimizado
      const groupedChannels = {};
      const channelsData = response.data || [];
      
      channelsData.forEach(channel => {
        const categoryName = channel.categoria_nome || 'Sem Categoria';
        if (!groupedChannels[categoryName]) {
          groupedChannels[categoryName] = [];
        }
        
        // Cache de imagem otimizada
        const cacheKey = `${channel.id}_${channel.logo_url}`;
        if (!imageCache.has(cacheKey)) {
          imageCache.set(cacheKey, getOptimizedImageUrl(channel.logo_url, channel.name));
        }
        
        groupedChannels[categoryName].push({
          ...channel,
          safeLogoUrl: imageCache.get(cacheKey)
        });
      });
      
      setChannels(groupedChannels);
      
      if (response.pagination) {
        setPagination(prev => ({
          ...prev,
          totalPages: response.pagination.totalPages,
          totalItems: response.pagination.total,
        }));
      }
    } catch (err) {
      console.error('Erro ao carregar canais:', err);
      setError('Erro ao carregar canais. Tente novamente.');
      setChannels({});
    }
  };

  const loadCurrentPrograms = async () => {
    try {
      const response = await epgService.getCurrentPrograms();
      setCurrentPrograms(response.data || []);
    } catch (err) {
      console.error('Erro ao carregar programação:', err);
    }
  };

  const loadFavoriteChannels = async () => {
    try {
      const response = await channelsService.getFavoriteChannels();
      const favIds = new Set((response.data || []).map(ch => ch.id));
      setFavoriteChannelIds(favIds);
    } catch (err) {
      console.error('Erro ao carregar favoritos:', err);
    }
  };

  // Funções auxiliares otimizadas
  const getOptimizedImageUrl = (url, channelName) => {
    if (!url) return getPlaceholderUrl(channelName);
    
    try {
      // URLs locais mantidas
      if (url.startsWith('/') || url.includes(window.location.hostname)) {
        return url;
      }
      
      // Otimização com WebP e tamanhos específicos
      const cleanUrl = url.replace(/^https?:\/\//, '');
      return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&w=200&h=100&fit=contain&output=webp&q=80`;
    } catch {
      return getPlaceholderUrl(channelName);
    }
  };

  const getPlaceholderUrl = (channelName) => {
    const colors = ['4285F4', 'EA4335', 'FBBC05', '34A853', 'FF6D00'];
    const color = colors[channelName?.charCodeAt(0) % colors.length] || '4285F4';
    const text = encodeURIComponent(channelName?.substring(0, 12) || 'TV');
    return `https://via.placeholder.com/200x100/${color}/FFFFFF?text=${text}`;
  };

  const getCurrentProgram = useCallback((channelId) => {
    return currentPrograms.find(p => p.channel_id === channelId);
  }, [currentPrograms]);

  // Handlers
  const handleFilterChange = useCallback((name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
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
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  return {
    channels,
    categories,
    loading,
    error,
    filters,
    pagination,
    favoriteChannelIds,
    currentPrograms,
    getCurrentProgram,
    handleFilterChange,
    handleToggleFavorite,
    clearFilters,
    setPagination,
    loadData
  };
};
