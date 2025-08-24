import React, { useState, useEffect, useMemo } from 'react';
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
  Collapse,
  Divider,
  Avatar,
  Paper,
  Badge,
  alpha,
  Fade,
  Zoom,
  useScrollTrigger,
  Fab
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
  Star,
  KeyboardArrowUp
} from '@mui/icons-material';
import { channelsService, categoryService, epgService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Tema personalizado com cores suaves e harmoniosas
const theme = createTheme({
  palette: {
    primary: {
      main: '#5C6BC0', // Azul suave
      light: '#8E99F3',
      dark: '#26418F',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#78909C', // Cinza azulado suave
      light: '#A7C0CD',
      dark: '#4B636E'
    },
    background: {
      default: '#F5F7FA', // Cinza muito claro com tom azulado
      paper: '#FFFFFF'
    },
    text: {
      primary: '#37474F', // Azul escuro suave
      secondary: '#546E7A'
    },
    success: {
      main: '#66BB6A', // Verde suave
      light: '#81C784',
      dark: '#388E3C'
    },
    warning: {
      main: '#FFA726', // Laranja suave
      light: '#FFB74D',
      dark: '#F57C00'
    },
    error: {
      main: '#EF5350', // Vermelho suave
      light: '#E57373',
      dark: '#D32F2F'
    },
    info: {
      main: '#29B6F6', // Azul claro suave
      light: '#4FC3F7',
      dark: '#0288D1'
    }
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '2.125rem',
      letterSpacing: '-0.5px'
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem'
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.25rem'
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    },
    button: {
      textTransform: 'none',
      fontWeight: 500
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#E0E0E0',
              borderWidth: '1.5px'
            },
            '&:hover fieldset': {
              borderColor: '#5C6BC0'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#5C6BC0',
              borderWidth: '2px'
            }
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }
      }
    }
  }
});

// Componente para scroll to top
function ScrollTop(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#back-to-top-anchor',
    );
    if (anchor) {
      anchor.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

// Componente de Card de Canal
const ChannelCard = React.memo(({ channel, isFavorite, onPlay, onShowEPG, onToggleFavorite, getCurrentProgram }) => {
  const program = getCurrentProgram(channel.id);
  
  return (
    <Fade in timeout={800}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Cabeçalho com logo */}
        <Box sx={{ 
          height: 140,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: alpha(theme.palette.primary.light, 0.08),
          p: 2,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Efeito de gradiente sutil */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            opacity: 0.7
          }} />
          
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            badgeContent={
              isFavorite ? (
                <Star sx={{ 
                  fontSize: 20, 
                  color: theme.palette.warning.main,
                  filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))'
                }} />
              ) : null
            }
          >
            <CardMedia
              component="img"
              image={channel.safeLogoUrl}
              alt={channel.name}
              sx={{
                maxHeight: 80,
                maxWidth: '100%',
                objectFit: 'contain',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
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
              sx={{ 
                position: 'absolute',
                top: 12,
                right: 12,
                fontWeight: 'bold',
                fontSize: '0.65rem',
                height: 20,
                backgroundColor: alpha(theme.palette.primary.main, 0.9),
                color: 'white'
              }}
            />
          )}
        </Box>
        
        {/* Corpo do card */}
        <CardContent sx={{ flexGrow: 1, p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Typography variant="h6" noWrap sx={{ 
            mb: 1.5, 
            fontWeight: 600,
            color: theme.palette.text.primary
          }}>
            {channel.name}
          </Typography>
          
          {/* Metadados do canal */}
          <Box sx={{ display: 'flex', gap: 0.75, mb: 1.5, flexWrap: 'wrap' }}>
            {channel.category_name && (
              <Chip 
                label={channel.category_name} 
                size="small" 
                icon={<Category fontSize="small" />}
                sx={{ 
                  fontSize: '0.7rem',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.dark
                }}
              />
            )}
            {channel.language && (
              <Chip 
                label={channel.language} 
                size="small" 
                icon={<Language fontSize="small" />}
                sx={{ 
                  fontSize: '0.7rem',
                  backgroundColor: alpha(theme.palette.info.main, 0.1),
                  color: theme.palette.info.dark
                }}
              />
            )}
          </Box>
          
          {/* Programação atual */}
          {program && (
            <Box sx={{ 
              mb: 2,
              p: 1.5,
              backgroundColor: alpha(theme.palette.primary.main, 0.03),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 500 }}>
                AGORA:
              </Typography>
              <Typography variant="body2" fontWeight={600} noWrap sx={{ color: theme.palette.text.primary }}>
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
            pt: program ? 0 : 1
          }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<PlayArrow />}
              onClick={() => onPlay(channel)}
              sx={{ 
                flex: 1,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                fontWeight: 600
              }}
            >
              Assistir
            </Button>
            
            <IconButton
              onClick={() => onShowEPG(channel)}
              size="small"
              sx={{ 
                border: `1px solid ${alpha(theme.palette.info.main, 0.5)}`,
                color: theme.palette.info.main,
                '&:hover': { 
                  backgroundColor: alpha(theme.palette.info.main, 0.1) 
                }
              }}
            >
              <Info fontSize="small" />
            </IconButton>
            
            <IconButton
              onClick={() => onToggleFavorite(channel.id)}
              size="small"
              sx={{ 
                border: `1px solid ${isFavorite ? theme.palette.warning.main : alpha(theme.palette.text.secondary, 0.3)}`,
                color: isFavorite ? theme.palette.warning.main : theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: isFavorite ? alpha(theme.palette.warning.main, 0.1) : alpha(theme.palette.text.secondary, 0.05)
                }
              }}
            >
              {isFavorite ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
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
    const colors = ['5C6BC0', '78909C', '66BB6A', 'FFA726', '29B6F6'];
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

  // Memoized channel list
  const channelCategories = useMemo(() => Object.entries(channels), [channels]);

  return (
    <ThemeProvider theme={theme}>
      <Box id="back-to-top-anchor" />
      <Container maxWidth="xl" sx={{ 
        py: 3, 
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh'
      }}>
        {/* Cabeçalho */}
        <Paper sx={{ 
          mb: 3,
          p: 2.5,
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: theme.palette.primary.contrastText,
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
          borderRadius: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LiveTv sx={{ fontSize: 42, mr: 2, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                StreamFlix
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Sua plataforma de streaming favorita
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Barra de busca */}
        <Paper sx={{ 
          mb: 3, 
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[1],
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}>
          <Search sx={{ 
            color: alpha(theme.palette.primary.main, 0.7), 
            mr: 2, 
            fontSize: 32 
          }} />
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar canais..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '1.1rem',
                '& input': {
                  color: theme.palette.text.primary,
                  padding: '12px 14px',
                  '&::placeholder': {
                    color: alpha(theme.palette.text.secondary, 0.6),
                    opacity: 1
                  }
                }
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
            py: 1.5,
            color: theme.palette.primary.main,
            borderColor: alpha(theme.palette.primary.main, 0.3),
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            fontSize: '1rem',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              borderColor: theme.palette.primary.main
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
            boxShadow: theme.shadows[1],
            borderRadius: 3
          }}>
            <Grid container spacing={2}>
              {/* Categoria */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel sx={{ 
                    color: theme.palette.text.secondary,
                    '&.Mui-focused': {
                      color: theme.palette.primary.main
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Category sx={{ mr: 1, fontSize: '1rem' }} /> 
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
                        display: 'flex',
                        alignItems: 'center'
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          borderRadius: 2,
                          marginTop: 1,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                          '& .MuiMenuItem-root': {
                            padding: '10px 16px',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.08)
                            },
                            '&.Mui-selected': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.16)
                            }
                          }
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
                  <InputLabel sx={{ 
                    color: theme.palette.text.secondary,
                    '&.Mui-focused': {
                      color: theme.palette.primary.main
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <HighQuality sx={{ mr: 1, fontSize: '1rem' }} /> 
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
                        display: 'flex',
                        alignItems: 'center'
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          borderRadius: 2,
                          marginTop: 1,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                        }
                      }
                    }}
                  >
                    <MenuItem value="">Todas</MenuItem>
                    {['SD', 'HD', 'FHD', '4K'].map((q) => (
                      <MenuItem key={q} value={q}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ 
                            width: 20, 
                            height: 20, 
                            mr: 1.5,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            color: 'white',
                            backgroundColor: 
                              q === '4K' ? theme.palette.warning.main : 
                              q === 'FHD' ? theme.palette.success.main : 
                              q === 'HD' ? theme.palette.info.main : theme.palette.secondary.main
                          }}>
                            {q}
                          </Box>
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
                  <InputLabel sx={{ 
                    color: theme.palette.text.secondary,
                    '&.Mui-focused': {
                      color: theme.palette.primary.main
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Language sx={{ mr: 1, fontSize: '1rem' }} /> 
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
                        display: 'flex',
                        alignItems: 'center'
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          borderRadius: 2,
                          marginTop: 1,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                        }
                      }
                    }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="pt-BR">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          component="img" 
                          src="https://flagcdn.com/w20/br.png" 
                          sx={{ width: 20, height: 15, mr: 1.5, borderRadius: 0.5 }} 
                        />
                        Português
                      </Box>
                    </MenuItem>
                    <MenuItem value="en">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          component="img" 
                          src="https://flagcdn.com/w20/us.png" 
                          sx={{ width: 20, height: 15, mr: 1.5, borderRadius: 0.5 }} 
                        />
                        Inglês
                      </Box>
                    </MenuItem>
                    <MenuItem value="es">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          component="img" 
                          src="https://flagcdn.com/w20/es.png" 
                          sx={{ width: 20, height: 15, mr: 1.5, borderRadius: 0.5 }} 
                        />
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
                    borderColor: alpha(theme.palette.error.main, 0.5),
                    backgroundColor: alpha(theme.palette.error.main, 0.05),
                    '&:hover': { 
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                      borderColor: theme.palette.error.main
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
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              alignItems: 'center'
            }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Conteúdo principal */}
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: '400px',
            color: theme.palette.text.secondary
          }}>
            <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
            <Typography variant="h6">
              Carregando canais...
            </Typography>
          </Box>
        ) : (
          <>
            {channelCategories.length > 0 ? (
              <Box>
                {channelCategories.map(([categoryName, channelsInCategory]) => (
                  <Paper 
                    key={categoryName} 
                    sx={{ 
                      mb: 4, 
                      borderRadius: 3, 
                      overflow: 'hidden',
                      boxShadow: theme.shadows[2],
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                    }}
                  >
                    <Box 
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2.5,
                        background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                        color: theme.palette.primary.dark,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.secondary.main, 0.08)})`
                        }
                      }}
                      onClick={() => toggleCategory(categoryName)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Theaters sx={{ mr: 1.5, color: theme.palette.primary.main }} />
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          {categoryName}
                        </Typography>
                        <Chip 
                          label={`${channelsInCategory.length} canais`} 
                          sx={{ 
                            ml: 2,
                            backgroundColor: alpha(theme.palette.primary.main, 0.15),
                            color: theme.palette.primary.dark,
                            fontWeight: 500
                          }} 
                        />
                      </Box>
                      {expandedCategories[categoryName] ? 
                        <ExpandLess sx={{ color: theme.palette.primary.main }} /> : 
                        <ExpandMore sx={{ color: theme.palette.primary.main }} />
                      }
                    </Box>

                    <Collapse in={expandedCategories[categoryName] !== false}>
                      <Grid container spacing={2.5} sx={{ p: 3, backgroundColor: theme.palette.background.paper }}>
                        {channelsInCategory.map((channel) => (
                          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={channel.id}>
                            <ChannelCard 
                              channel={channel} 
                              isFavorite={favoriteChannelIds.has(channel.id)}
                              onPlay={handlePlayChannel}
                              onShowEPG={handleShowEPG}
                              onToggleFavorite={handleToggleFavorite}
                              getCurrentProgram={getCurrentProgram}
                            />
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
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[1],
                border: `1px dashed ${alpha(theme.palette.text.secondary, 0.2)}`
              }}>
                <Search sx={{ fontSize: 60, color: alpha(theme.palette.text.secondary, 0.4), mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Nenhum canal encontrado
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Tente ajustar os filtros de busca ou limpar os filtros atuais
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
                  sx={{
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
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
          PaperProps={{
            sx: {
              borderRadius: window.innerWidth < 900 ? 0 : 3,
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            color: theme.palette.primary.contrastText,
            py: 2,
            pr: 2
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {selectedChannel?.name}
            </Typography>
            <IconButton 
              onClick={() => setPlayerDialogOpen(false)}
              color="inherit"
              sx={{ 
                '&:hover': {
                  backgroundColor: alpha('#fff', 0.1)
                }
              }}
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
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            color: theme.palette.primary.contrastText,
            py: 2,
            pr: 2
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Programação - {selectedChannel?.name}
            </Typography>
            <IconButton 
              onClick={() => setEpgDialogOpen(false)} 
              color="inherit"
              sx={{ 
                '&:hover': {
                  backgroundColor: alpha('#fff', 0.1)
                }
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ 
            backgroundColor: theme.palette.background.default,
            p: 0
          }}>
            <Paper sx={{ 
              display: 'flex',
              alignItems: 'center',
              m: 3,
              p: 2.5,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              boxShadow: theme.shadows[1]
            }}>
              <Avatar
                src={selectedChannel?.safeLogoUrl}
                alt={selectedChannel?.name}
                sx={{ width: 60, height: 60, mr: 2 }}
              />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {selectedChannel?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedChannel?.category_name}
                </Typography>
              </Box>
            </Paper>
            
            <Box sx={{ px: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Programação Atual
              </Typography>
              
              {currentPrograms.find(p => p.channel_id === selectedChannel?.id) ? (
                <Paper sx={{ p: 2.5, mb: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    {currentPrograms.find(p => p.channel_id === selectedChannel?.id).title}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ color: theme.palette.text.secondary }}>
                    {currentPrograms.find(p => p.channel_id === selectedChannel?.id).description || 
                    'Nenhuma descrição disponível.'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(currentPrograms.find(p => p.channel_id === selectedChannel?.id).start_time).toLocaleString()} - {' '}
                    {new Date(currentPrograms.find(p => p.channel_id === selectedChannel?.id).end_time).toLocaleString()}
                  </Typography>
                </Paper>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Nenhuma informação de programação disponível no momento.
                </Typography>
              )}
              
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
                Próximos Programas
              </Typography>
              
              <Paper sx={{ p: 2.5, borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Funcionalidade de programação completa em desenvolvimento
                </Typography>
              </Paper>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Botão de scroll to top */}
        <ScrollTop>
          <Fab
            color="primary"
            size="medium"
            aria-label="voltar ao topo"
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
              }
            }}
          >
            <KeyboardArrowUp sx={{ color: 'white' }} />
          </Fab>
        </ScrollTop>
      </Container>
    </ThemeProvider>
  );
};

export default ChannelsPage;