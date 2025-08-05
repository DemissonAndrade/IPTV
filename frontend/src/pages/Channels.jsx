import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useTheme,
  Collapse,
  Divider,
  Avatar,
  Paper,
  Badge,
  createTheme,
  ThemeProvider
} from '@mui/material';
import {
  PlayArrow,
  Favorite,
  FavoriteBorder,
  Search,
  FilterList,
  Close,
  Info,
  ExpandMore,
  ExpandLess,
  Language,
  HighQuality,
  Category,
  Theaters,
  LiveTv,
  Star
} from '@mui/icons-material';
import { channelsService, categoryService, epgService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// Tema personalizado com cores otimizadas
const theme = createTheme({
  palette: {
    primary: {
      main: '#1565c0',
      dark: '#0d47a1',
      light: '#1976d2',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#7b1fa2'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    },
    text: {
      primary: '#212121',
      secondary: '#424242'
    },
    grey: {
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 500,
      fontSize: '2.125rem'
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.5rem'
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.25rem'
    },
    body1: {
      fontSize: '1rem'
    },
    body2: {
      fontSize: '0.875rem'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#e0e0e0'
            },
            '&:hover fieldset': {
              borderColor: '#1976d2'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1976d2',
              borderWidth: '1px'
            }
          }
        }
      }
    }
  }
});

const ChannelsPage = () => {
  const { isAuthenticated, user, logout } = useAuth();

  // Estados
  const [channels, setChannels] = useState({});
  const [categories, setCategories] = useState([]);
  const [currentPrograms, setCurrentPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [playerDialogOpen, setPlayerDialogOpen] = useState(false);
  const [epgDialogOpen, setEpgDialogOpen] = useState(false);
  const [favoriteChannelIds, setFavoriteChannelIds] = useState(new Set());
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Filtros
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
    limit: 1000,
    totalPages: 1,
    totalItems: 0,
  });

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          loadCategories(),
          loadChannels(),
          isAuthenticated && loadCurrentPrograms(),
          isAuthenticated && loadFavoriteChannels()
        ]);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters, pagination.page, isAuthenticated]);

  // Funções de carregamento
  const loadCategories = async () => {
    const response = await categoryService.getCategories();
    setCategories(response.data || []);
  };

  const loadChannels = async () => {
    try {
      const params = { 
        ...filters, 
        page: pagination.page, 
        limit: pagination.limit
      };
      
      // Remove filtros vazios
      Object.keys(params).forEach(key => !params[key] && delete params[key]);
      
      const response = await channelsService.getChannels(params);
      
      // Agrupar canais por categoria
      const groupedChannels = {};
      (response.data || []).forEach(channel => {
        const categoryName = channel.categoria_nome || 'Sem Categoria';
        if (!groupedChannels[categoryName]) {
          groupedChannels[categoryName] = [];
        }
        groupedChannels[categoryName].push({
          ...channel,
          safeLogoUrl: getSafeImageUrl(channel.logo_url, channel.name)
        });
      });
      
      setChannels(groupedChannels);
      
      // Expandir automaticamente categorias com poucos canais
      const autoExpanded = {};
      Object.keys(groupedChannels).forEach(cat => {
        autoExpanded[cat] = groupedChannels[cat].length <= 6;
      });
      setExpandedCategories(autoExpanded);
      
      if (response.pagination) {
        setPagination(prev => ({
          ...prev,
          totalPages: response.pagination.totalPages,
          totalItems: response.pagination.total,
        }));
      }
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar canais:', err);
      setError('Erro ao carregar canais. Tente novamente.');
      setChannels({});
    }
  };

  const loadCurrentPrograms = async () => {
    const response = await epgService.getCurrentPrograms();
    setCurrentPrograms(response.data || []);
  };

  const loadFavoriteChannels = async () => {
    const response = await channelsService.getFavoriteChannels();
    const favIds = new Set((response.data || []).map(ch => ch.id));
    setFavoriteChannelIds(favIds);
  };

  // Funções auxiliares
  const getSafeImageUrl = (url, channelName) => {
    if (!url) return getPlaceholderUrl(channelName);
    
    try {
      if (url.startsWith('/') || url.includes(window.location.hostname)) {
        return url;
      }
      
      return `https://images.weserv.nl/?url=${encodeURIComponent(url.replace(/^https?:\/\//, ''))}&w=300&h=150&fit=contain&output=webp`;
    } catch {
      return getPlaceholderUrl(channelName);
    }
  };

  const getPlaceholderUrl = (channelName) => {
    const colors = ['4285F4', 'EA4335', 'FBBC05', '34A853', 'FF6D00'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return `https://via.placeholder.com/300x150/${color}/FFFFFF?text=${encodeURIComponent(channelName?.substring(0, 15) || 'TV')}`;
  };

  const getCurrentProgram = (channelId) => {
    return currentPrograms.find(p => p.channel_id === channelId);
  };

  // Handlers
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (_, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePlayChannel = (channel) => {
    if (!isAuthenticated) {
      return setError('Faça login para assistir aos canais');
    }
    setSelectedChannel(channel);
    setPlayerDialogOpen(true);
  };

  const handleShowEPG = (channel) => {
    setSelectedChannel(channel);
    setEpgDialogOpen(true);
  };

  const handleToggleFavorite = async (channelId) => {
    if (!isAuthenticated) {
      return setError('Faça login para gerenciar favoritos');
    }
    
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
  };

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  // Componente de Card de Canal
  const ChannelCard = React.memo(({ channel }) => {
    const program = getCurrentProgram(channel.id);
    const isFavorite = favoriteChannelIds.has(channel.id);
    
    return (
      <Card>
        {/* Cabeçalho com logo */}
        <Box sx={{ 
          height: 120,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.palette.grey[100],
          p: 2,
          position: 'relative'
        }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            badgeContent={
              isFavorite ? (
                <Star color="warning" sx={{ fontSize: 24 }} />
              ) : null
            }
          >
            <CardMedia
              component="img"
              image={channel.safeLogoUrl}
              alt={channel.name}
              sx={{
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'contain'
              }}
              onError={(e) => {
                if (e.target.src !== getPlaceholderUrl(channel.name)) {
                  e.target.src = getPlaceholderUrl(channel.name);
                }
              }}
            />
          </Badge>
          
          {/* Badge de qualidade */}
          {channel.quality && (
            <Chip
              label={channel.quality}
              size="small"
              color="primary"
              sx={{ 
                position: 'absolute',
                top: 8,
                right: 8,
                fontWeight: 'bold',
                fontSize: '0.7rem'
              }}
            />
          )}
        </Box>
        
        {/* Corpo do card */}
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography variant="h6" noWrap sx={{ mb: 1, fontWeight: 500 }}>
            {channel.name}
          </Typography>
          
          {/* Metadados do canal */}
          <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            {channel.category_name && (
              <Chip 
                label={channel.category_name} 
                size="small" 
                icon={<Category fontSize="small" />}
                sx={{ fontSize: '0.7rem' }}
              />
            )}
            {channel.language && (
              <Chip 
                label={channel.language} 
                size="small" 
                icon={<Language fontSize="small" />}
                sx={{ fontSize: '0.7rem' }}
              />
            )}
          </Box>
          
          {/* Programação atual */}
          {program && (
            <Box sx={{ 
              mb: 1,
              p: 1,
              backgroundColor: theme.palette.grey[100],
              borderRadius: 1
            }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Agora:
              </Typography>
              <Typography variant="body2" fontWeight={500} noWrap>
                {program.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {new Date(program.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {' '}
                {new Date(program.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>
          )}
          
          {/* Botões de ação */}
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            mt: 'auto',
            pt: 1
          }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<PlayArrow />}
              onClick={() => handlePlayChannel(channel)}
              sx={{ flex: 1 }}
            >
              Assistir
            </Button>
            
            <IconButton
              onClick={() => handleShowEPG(channel)}
              color="info"
              size="small"
              sx={{ border: `1px solid ${theme.palette.info.main}` }}
            >
              <Info fontSize="small" />
            </IconButton>
            
            <IconButton
              onClick={() => handleToggleFavorite(channel.id)}
              color={isFavorite ? 'error' : 'default'}
              size="small"
              sx={{ 
                border: `1px solid ${isFavorite ? theme.palette.error.main : theme.palette.grey[400]}`,
                '&:hover': {
                  backgroundColor: isFavorite ? theme.palette.error.light : theme.palette.grey[200]
                }
              }}
            >
              {isFavorite ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    );
  });

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ py: 2, backgroundColor: theme.palette.background.default }}>
        {/* Cabeçalho */}
        <Paper sx={{ 
          mb: 3,
          p: 2,
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          boxShadow: theme.shadows[2]
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LiveTv sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
              StreamFlux
            </Typography>
          </Box>
        </Paper>

        {/* Barra de busca */}
        <Paper sx={{ 
          mb: 3, 
          p: 2,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[1]
        }}>
          <Search sx={{ color: theme.palette.text.secondary, mr: 2, fontSize: 30 }} />
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar canais..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            sx={{
              '& input': { 
                color: theme.palette.text.primary,
                fontSize: '1.2rem'
              }
            }}
          />
        </Paper>

        {/* Filtros */}
        <Button
          fullWidth
          variant="outlined"
          startIcon={<FilterList />}
          endIcon={filtersExpanded ? <ExpandLess /> : <ExpandMore />}
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          sx={{ 
            mb: 2,
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.dark,
              borderColor: theme.palette.primary.dark
            }
          }}
        >
          Filtros Avançados
        </Button>

        <Collapse in={filtersExpanded}>
          <Paper sx={{ 
            mb: 3,
            p: 3,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[1]
          }}>
            <Grid container spacing={2}>
              {/* Categoria */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: theme.palette.text.primary }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Category sx={{ mr: 1, fontSize: '1rem', color: theme.palette.text.secondary }} /> 
                      Categoria
                    </Box>
                  </InputLabel>
                  <Select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    label="Categoria"
                    sx={{
                      color: theme.palette.text.primary,
                      '& .MuiSelect-select': {
                        textShadow: 'none',
                        color: theme.palette.text.primary,
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: theme.palette.background.paper,
                          color: theme.palette.text.primary
                        }
                      }
                    }}
                  >
                    <MenuItem value="">Todas</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id} sx={{ color: theme.palette.text.primary }}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Qualidade */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: theme.palette.text.primary }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <HighQuality sx={{ mr: 1, fontSize: '1rem', color: theme.palette.text.secondary }} /> 
                      Qualidade
                    </Box>
                  </InputLabel>
                  <Select
                    value={filters.quality}
                    onChange={(e) => handleFilterChange('quality', e.target.value)}
                    label="Qualidade"
                    sx={{
                      color: theme.palette.text.primary,
                      '& .MuiSelect-select': {
                        textShadow: 'none',
                        color: theme.palette.text.primary,
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: theme.palette.background.paper,
                          color: theme.palette.text.primary
                        }
                      }
                    }}
                  >
                    <MenuItem value="">Todas</MenuItem>
                    {['SD', 'HD', 'FHD', '4K'].map((q) => (
                      <MenuItem key={q} value={q}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ 
                            width: 20, 
                            height: 20, 
                            mr: 1,
                            backgroundColor: q === '4K' ? 'gold' : 
                                             q === 'FHD' ? 'green' : 
                                             q === 'HD' ? 'blue' : 'grey'
                          }}>
                            <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                              {q}
                            </Typography>
                          </Avatar>
                          {q}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Idioma */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: theme.palette.text.primary }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Language sx={{ mr: 1, fontSize: '1rem', color: theme.palette.text.secondary }} /> 
                      Idioma
                    </Box>
                  </InputLabel>
                  <Select
                    value={filters.language}
                    onChange={(e) => handleFilterChange('language', e.target.value)}
                    label="Idioma"
                    sx={{
                      color: theme.palette.text.primary,
                      '& .MuiSelect-select': {
                        textShadow: 'none',
                        color: theme.palette.text.primary,
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: theme.palette.background.paper,
                          color: theme.palette.text.primary
                        }
                      }
                    }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="pt-BR">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src="https://flagcdn.com/w20/br.png" sx={{ width: 20, height: 20, mr: 1 }} />
                        Português
                      </Box>
                    </MenuItem>
                    <MenuItem value="en">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src="https://flagcdn.com/w20/us.png" sx={{ width: 20, height: 20, mr: 1 }} />
                        Inglês
                      </Box>
                    </MenuItem>
                    <MenuItem value="es">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src="https://flagcdn.com/w20/es.png" sx={{ width: 20, height: 20, mr: 1 }} />
                        Espanhol
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Limpar */}
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Close />}
                  onClick={() => {
                    setFilters({
                      search: '',
                      category: '',
                      quality: '',
                      language: '',
                      country: '',
                    });
                  }}
                  sx={{ 
                    height: '56px', 
                    color: theme.palette.error.main,
                    borderColor: theme.palette.error.main,
                    '&:hover': { 
                      backgroundColor: theme.palette.error.light,
                      borderColor: theme.palette.error.dark
                    } 
                  }}
                >
                  Limpar Filtros
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Collapse>

        {/* Mensagens de erro */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Conteúdo principal */}
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: '300px'
          }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {Object.keys(channels).length > 0 ? (
              <Box>
                {Object.entries(channels).map(([categoryName, channelsInCategory]) => (
                  <Paper 
                    key={categoryName} 
                    sx={{ 
                      mb: 4, 
                      borderRadius: 2, 
                      overflow: 'hidden',
                      boxShadow: theme.shadows[2]
                    }}
                  >
                    <Box 
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark
                        }
                      }}
                      onClick={() => toggleCategory(categoryName)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Theaters sx={{ mr: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 500 }}>
                          {categoryName}
                        </Typography>
                        <Chip 
                          label={`${channelsInCategory.length} canais`} 
                          sx={{ 
                            ml: 2,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white'
                          }} 
                        />
                      </Box>
                      {expandedCategories[categoryName] ? <ExpandLess /> : <ExpandMore />}
                    </Box>

                    <Collapse in={expandedCategories[categoryName] !== false}>
                      <Grid container spacing={3} sx={{ p: 3, backgroundColor: theme.palette.background.paper }}>
                        {channelsInCategory.map((channel) => (
                          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={channel.id}>
                            <ChannelCard channel={channel} />
                          </Grid>
                        ))}
                      </Grid>
                    </Collapse>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Paper sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '300px',
                textAlign: 'center',
                p: 4,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[1]
              }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Nenhum canal encontrado
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Tente ajustar os filtros de busca
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<FilterList />}
                  onClick={() => {
                    setFilters({
                      search: '',
                      category: '',
                      quality: '',
                      language: '',
                      country: '',
                    });
                  }}
                >
                  Limpar Filtros
                </Button>
              </Paper>
            )}
          </>
        )}

        {/* Modal do Player */}
        <Dialog
          open={playerDialogOpen}
          onClose={() => setPlayerDialogOpen(false)}
          maxWidth="lg"
          fullWidth
          fullScreen={window.innerWidth < 900}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
          }}>
            {selectedChannel?.name}
            <IconButton 
              onClick={() => setPlayerDialogOpen(false)}
              color="inherit"
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ 
            backgroundColor: '#000',
            padding: 0,
            height: window.innerWidth < 900 ? '100vh' : '70vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Box sx={{ textAlign: 'center', color: '#fff' }}>
              <Typography variant="h6" gutterBottom>
                Player de Vídeo
              </Typography>
              <Typography>
                {selectedChannel?.name}
              </Typography>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Modal da Programação */}
        <Dialog
          open={epgDialogOpen}
          onClose={() => setEpgDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
          }}>
            Programação - {selectedChannel?.name}
            <IconButton onClick={() => setEpgDialogOpen(false)} color="inherit">
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ backgroundColor: theme.palette.background.default }}>
            <Paper sx={{ 
              display: 'flex',
              alignItems: 'center',
              mb: 3,
              p: 2,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
              boxShadow: theme.shadows[1]
            }}>
              <Avatar
                src={selectedChannel?.safeLogoUrl}
                alt={selectedChannel?.name}
                sx={{ width: 60, height: 60, mr: 2 }}
              />
              <Box>
                <Typography variant="h6">{selectedChannel?.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedChannel?.category_name}
                </Typography>
              </Box>
            </Paper>
            
            <Typography variant="h6" gutterBottom>
              Programação Atual
            </Typography>
            
            {currentPrograms.find(p => p.channel_id === selectedChannel?.id) ? (
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {currentPrograms.find(p => p.channel_id === selectedChannel?.id).title}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {currentPrograms.find(p => p.channel_id === selectedChannel?.id).description || 
                   'Nenhuma descrição disponível.'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(currentPrograms.find(p => p.channel_id === selectedChannel?.id).start_time).toLocaleString()} - {' '}
                  {new Date(currentPrograms.find(p => p.channel_id === selectedChannel?.id).end_time).toLocaleString()}
                </Typography>
              </Paper>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Nenhuma informação de programação disponível no momento.
              </Typography>
            )}
            
            <Typography variant="h6" gutterBottom>
              Próximos Programas
            </Typography>
            
            <Paper sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Funcionalidade de programação completa em desenvolvimento
              </Typography>
            </Paper>
          </DialogContent>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default ChannelsPage;