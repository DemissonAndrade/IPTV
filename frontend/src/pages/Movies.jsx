import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Box,
  Button
} from '@mui/material';
import { vodService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const carregarFilmes = async () => {
      try {
        const response = await vodService.getMovies();
        setMovies(response.data);
      } catch (error) {
        console.error('Erro ao carregar filmes:', error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    carregarFilmes();
  }, []);

  const handleMovieClick = (movieId) => {
    if (isAuthenticated) {
      navigate(`/vod/${movieId}`);
    } else {
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress color="inherit" size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: 'bold', mb: 4, color: 'white' }}
      >
        Filmes
      </Typography>

      {movies.length === 0 ? (
        <Typography variant="h6" color="text.secondary">
          Nenhum filme encontrado.
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} key={movie.id} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card
                sx={{
                  width: 240,
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
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={movie.capa_url || '/sem-imagem.jpg'}
                  alt={movie.titulo}
                  sx={{ objectFit: 'cover', borderRadius: '12px 12px 0 0', cursor: 'pointer' }}
                  onClick={() => handleMovieClick(movie.id)}
                />
                <CardContent sx={{ flexGrow: 1, p: 2, cursor: 'pointer' }} onClick={() => handleMovieClick(movie.id)}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={movie.titulo}
                  >
                    {movie.titulo}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="gray"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {movie.descricao || 'Sem descrição'}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="lightgray"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    {movie.genero || 'Gênero não informado'} • {movie.ano || '----'} • {movie.duracao ? `${movie.duracao} min` : '--'}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    Assistir
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Movies;
