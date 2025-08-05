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
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { vodService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

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

  // Configurações responsivas para cards compactos
  const getCardStyles = () => {
    if (isMobile) {
      return {
        maxWidth: 160,
        imageRatio: '120%', // Proporção mais compacta
        titleVariant: 'subtitle2',
        titleLines: 2,
        descLines: 2,
        fontSize: '0.75rem',
        padding: 1
      };
    }
    if (isTablet) {
      return {
        maxWidth: 180,
        imageRatio: '130%',
        titleVariant: 'subtitle1',
        titleLines: 2,
        descLines: 2,
        fontSize: '0.8rem',
        padding: 1.5
      };
    }
    return {
      maxWidth: 200, // Reduzido de 280 para 200
      imageRatio: '140%',
      titleVariant: 'subtitle1',
      titleLines: 2,
      descLines: 3,
      fontSize: '0.875rem',
      padding: 2
    };
  };

  const cardStyles = getCardStyles();

  return (
    <Container maxWidth="xl" sx={{ py: isMobile ? 1 : 3 }}>
      <Typography
        variant={isMobile ? 'h6' : 'h5'}
        component="h1"
        sx={{ 
          fontWeight: 'bold', 
          mb: isMobile ? 1 : 3, 
          color: 'white',
          textAlign: isMobile ? 'center' : 'left'
        }}
      >
        Filmes
      </Typography>

      {movies.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center">
          Nenhum filme encontrado.
        </Typography>
      ) : (
        <Grid 
          container 
          spacing={isMobile ? 1.5 : 2} 
          justifyContent="center"
          alignItems="stretch"
        >
          {movies.map((movie) => (
            <Grid 
              item 
              xs={6}  // 2 cards por linha em mobile
              sm={4}  // 3 cards por linha em tablet
              md={3}  // 4 cards por linha em desktop médio
              lg={2.4} // 5 cards por linha em desktop grande
              key={movie.id}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Card
                sx={{
                  width: '100%',
                  maxWidth: cardStyles.maxWidth,
                  backgroundColor: '#1e1e1e',
                  color: 'white',
                  borderRadius: 2,
                  boxShadow: 2,
                  transition: isMobile ? 'none' : 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: isMobile ? 'none' : 'scale(1.03)',
                    boxShadow: isMobile ? 2 : '0 8px 16px rgba(25, 118, 210, 0.7)',
                  },
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ 
                  position: 'relative',
                  paddingTop: cardStyles.imageRatio,
                  overflow: 'hidden',
                  borderRadius: '8px 8px 0 0',
                  cursor: 'pointer'
                }} onClick={() => handleMovieClick(movie.id)}>
                  <CardMedia
                    component="img"
                    image={movie.capa_url || '/sem-imagem.jpg'}
                    alt={movie.titulo}
                    sx={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
                <CardContent sx={{ 
                  flexGrow: 1, 
                  p: cardStyles.padding,
                  pb: `${cardStyles.padding / 2}px !important`
                }}>
                  <Typography
                    variant={cardStyles.titleVariant}
                    sx={{
                      fontWeight: 'bold',
                      mb: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: cardStyles.titleLines,
                      WebkitBoxOrient: 'vertical',
                      minHeight: `${cardStyles.titleLines * 1.2}em`,
                      fontSize: cardStyles.fontSize
                    }}
                    title={movie.titulo}
                  >
                    {movie.titulo}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: cardStyles.descLines,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minHeight: `${cardStyles.descLines * 1.2}em`,
                      mb: 0.5,
                      fontSize: `calc(${cardStyles.fontSize} - 0.05rem)`
                    }}
                  >
                    {movie.descricao || 'Sem descrição'}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ 
                      display: 'block',
                      mt: 'auto',
                      fontSize: `calc(${cardStyles.fontSize} - 0.1rem)`
                    }}
                  >
                    {movie.genero || 'Gênero não informado'} • {movie.ano || '----'} • {movie.duracao ? `${movie.duracao} min` : '--'}
                  </Typography>
                </CardContent>
                <Box sx={{ 
                  p: cardStyles.padding, 
                  pt: 0,
                  pb: `${cardStyles.padding}px !important`
                }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleMovieClick(movie.id)}
                    size="small"
                    sx={{
                      py: 0.3,
                      fontSize: cardStyles.fontSize
                    }}
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