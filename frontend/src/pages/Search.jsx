import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Pagination,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  PlayCircle as PlayIcon,
  Movie as MovieIcon,
  LiveTv as LiveTvIcon,
  Tv as TvIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Mock data for demonstration
  const mockData = {
    movies: [
      { id: 1, title: 'Avengers: Endgame', type: 'movie', year: 2019, genre: 'Ação', image: 'https://via.placeholder.com/300x450?text=Avengers' },
      { id: 2, title: 'The Shawshank Redemption', type: 'movie', year: 1994, genre: 'Drama', image: 'https://via.placeholder.com/300x450?text=Shawshank' },
      { id: 3, title: 'Inception', type: 'movie', year: 2010, genre: 'Ficção Científica', image: 'https://via.placeholder.com/300x450?text=Inception' },
    ],
    series: [
      { id: 4, title: 'Breaking Bad', type: 'series', year: 2008, genre: 'Drama', image: 'https://via.placeholder.com/300x450?text=Breaking+Bad' },
      { id: 5, title: 'Stranger Things', type: 'series', year: 2016, genre: 'Ficção Científica', image: 'https://via.placeholder.com/300x450?text=Stranger+Things' },
      { id: 6, title: 'The Crown', type: 'series', year: 2016, genre: 'Drama', image: 'https://via.placeholder.com/300x450?text=The+Crown' },
    ],
    channels: [
      { id: 7, title: 'Globo', type: 'channel', genre: 'Entretenimento', image: 'https://via.placeholder.com/300x450?text=Globo' },
      { id: 8, title: 'ESPN', type: 'channel', genre: 'Esportes', image: 'https://via.placeholder.com/300x450?text=ESPN' },
      { id: 9, title: 'Cartoon Network', type: 'channel', genre: 'Infantil', image: 'https://via.placeholder.com/300x450?text=Cartoon+Network' },
    ]
  };

  useEffect(() => {
    if (searchTerm) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, filterType]);

  const performSearch = () => {
    setLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      try {
        let results = [];
        
        if (filterType === 'all' || filterType === 'movies') {
          results = [...results, ...mockData.movies.map(item => ({...item, type: 'movie'}))];
        }
        if (filterType === 'all' || filterType === 'series') {
          results = [...results, ...mockData.series.map(item => ({...item, type: 'series'}))];
        }
        if (filterType === 'all' || filterType === 'channels') {
          results = [...results, ...mockData.channels.map(item => ({...item, type: 'channel'}))];
        }

        // Filter by search term
        const filteredResults = results.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.genre.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setSearchResults(filteredResults);
        setTotalPages(Math.ceil(filteredResults.length / 12));
        setCurrentPage(1);
      } catch (err) {
        setError('Erro ao buscar conteúdo. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };

  const handleItemClick = (item) => {
    switch (item.type) {
      case 'movie':
        navigate(`/movies/${item.id}`);
        break;
      case 'series':
        navigate(`/series/${item.id}`);
        break;
      case 'channel':
        navigate(`/channels/${item.id}`);
        break;
      default:
        navigate(`/movies`);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'movie':
        return <MovieIcon fontSize="small" />;
      case 'series':
        return <TvIcon fontSize="small" />;
      case 'channel':
        return <LiveTvIcon fontSize="small" />;
      default:
        return <PlayIcon fontSize="small" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'movie':
        return 'Filme';
      case 'series':
        return 'Série';
      case 'channel':
        return 'Canal';
      default:
        return 'Conteúdo';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
          Buscar Conteúdo
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Encontre filmes, séries e canais disponíveis em nossa plataforma
        </Typography>
      </Box>

      {/* Search Form - Centralized and Enhanced */}
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 6, textAlign: 'center' }}>
        <Box sx={{ maxWidth: 700, mx: 'auto' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar filmes, séries, canais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 3,
                height: 60,
                fontSize: '1.1rem',
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
                boxShadow: theme.shadows[3],
                '&:hover': {
                  boxShadow: theme.shadows[6],
                },
                '&.Mui-focused': {
                  boxShadow: theme.shadows[8],
                }
              },
              mb: 2
            }}
          />
          <FormControl sx={{ minWidth: 200, mx: 'auto' }}>
            <InputLabel id="filter-type-label">Tipo de Conteúdo</InputLabel>
            <Select
              labelId="filter-type-label"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="Tipo de Conteúdo"
              sx={{ 
                borderRadius: 3,
                height: 48,
                '& .MuiOutlinedInput-root': {
                  boxShadow: theme.shadows[2],
                }
              }}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="movies">Filmes</MenuItem>
              <MenuItem value="series">Séries</MenuItem>
              <MenuItem value="channels">Canais</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Search Results */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && searchResults.length === 0 && searchTerm && (
        <Box sx={{ textAlign: 'center', my: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum resultado encontrado para "{searchTerm}"
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tente buscar com termos diferentes ou verifique a ortografia
          </Typography>
        </Box>
      )}

      {!loading && searchResults.length > 0 && (
        <>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4 }}>
            Resultados da Busca ({searchResults.length})
          </Typography>
          <Grid container spacing={4}>
            {searchResults.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { 
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[6]
                    },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onClick={() => handleItemClick(item)}
                >
                  <CardMedia
                    component="img"
                    height="240"
                    image={item.image}
                    alt={item.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Chip 
                        icon={getTypeIcon(item.type)} 
                        label={getTypeLabel(item.type)} 
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                      />
                    </Box>
                    <Typography variant="h6" component="h3" noWrap gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.year && `${item.year} • `}{item.genre}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="primary"
                size="large"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}

      {!searchTerm && (
        <Box sx={{ textAlign: 'center', my: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Comece a buscar para encontrar conteúdo
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Digite o nome de um filme, série ou canal na barra de busca acima
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Search;