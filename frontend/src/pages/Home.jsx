import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  IconButton,
} from '@mui/material';
import {
  PlayArrow,
  FavoriteBorder,
  AccessTime,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { vodService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [featuredContent, setFeaturedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const featuredResponse = await vodService.getFeatured();
        if (featuredResponse.success) {
          setFeaturedContent(featuredResponse.data);
        }
      } catch (err) {
        setError('Erro ao carregar conteúdo. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleWatchContent = (contentId, type) => {
    if (!isAuthenticated) return navigate('/login');
    navigate(`/watch/${type}/${contentId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Filmes & Séries em Destaque
      </Typography>
      <Grid container spacing={2}>
        {featuredContent.map((content) => (
          <Grid item xs={6} sm={4} md={3} key={content.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'background.paper',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
              onClick={() => handleWatchContent(content.id, content.tipo)}
            >
              <CardMedia
                component="img"
                height="180"
                image={content.capa_url || '/placeholder.jpg'}
                alt={content.titulo}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" noWrap>
                  {content.titulo}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {content.genero || 'Gênero Desconhecido'}
                </Typography>
                <Box mt={1} display="flex" alignItems="center" gap={1}>
                  {content.duracao && (
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <AccessTime fontSize="small" />
                      <Typography variant="caption">
                        {Math.floor(content.duracao / 60)}h {content.duracao % 60}min
                      </Typography>
                    </Box>
                  )}
                  {content.ano && <Chip label={content.ano} size="small" />}
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<PlayArrow />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWatchContent(content.id, content.tipo);
                  }}
                >
                  Assistir
                </Button>
                <IconButton size="small">
                  <FavoriteBorder />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {!isAuthenticated && (
        <Paper
          sx={{
            mt: 6,
            p: 4,
            textAlign: 'center',
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Crie sua conta gratuita
          </Typography>
          <Typography variant="body1">
            Tenha acesso a todo o conteúdo premium agora mesmo!
          </Typography>
          <Box mt={2}>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              onClick={() => navigate('/register')}
              sx={{ mr: 2 }}
            >
              Criar Conta
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/plans')}
              sx={{ color: 'white', borderColor: 'white' }}
            >
              Ver Planos
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default Home;
