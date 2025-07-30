import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CircularProgress,
  Alert,
  Chip,
  Button,
  Pagination
} from '@mui/material';
import { vodService } from '@/services/api';
import { useNavigate } from 'react-router-dom';

const Series = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8; // Number of series per page
  const navigate = useNavigate();

  useEffect(() => {
    const loadSeries = async () => {
      setLoading(true);
      try {
        const response = await vodService.getSeries({ page, limit });
        setSeries(response.data || []);
        setTotalPages(response.pagination?.totalPages || 1);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar séries:', err);
        setError('Erro ao carregar séries. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    loadSeries();
  }, [page]);

  const handleSerieClick = (serieId) => {
    navigate(`/vod/${serieId}`);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4, color: 'white' }}>
        Séries
      </Typography>

      {series.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Nenhuma série disponível no momento
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            {series.map((serie) => (
              <Grid item xs={12} sm={6} md={4} key={serie.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card 
                  sx={{ 
                    width: '100%',
                    maxWidth: 240,
                    backgroundColor: '#1e1e1e',
                    color: 'white',
                    borderRadius: 3,
                    boxShadow: 6,
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.08)',
                      boxShadow: '0 12px 24px rgba(25, 118, 210, 0.9)',
                    },
                    display: 'flex', 
                    flexDirection: 'column',
                    height: '100%',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSerieClick(serie.id)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={serie.capa_url || '/placeholder-series.jpg'}
                    alt={serie.titulo}
                    sx={{ objectFit: 'cover', borderRadius: '12px 12px 0 0' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {serie.titulo}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip 
                        label={serie.ano_inicio} 
                        size="small" 
                        sx={{ mr: 1 }} 
                      />
                      <Chip 
                        label={serie.genero} 
                        size="small" 
                        color="primary" 
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {serie.descricao?.length > 100 
                        ? `${serie.descricao.substring(0, 100)}...` 
                        : serie.descricao}
                    </Typography>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSerieClick(serie.id);
                      }}
                    >
                      Ver Temporadas
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
              shape="rounded"
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default Series;
