import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

// Imagens padrão como fallback
const DEFAULT_BG = 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D&w=1000&q=80';
const DEFAULT_MOVIE = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Nnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60';
const DEFAULT_SERIES = 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTB8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&w=500&q=60';
const DEFAULT_CATEGORIES = 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTl8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&w=500&q=60';

const StyledContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${DEFAULT_BG})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    zIndex: -1,
    filter: 'blur(2px)',
  }
}));

const GlowText = styled(Typography)(({ theme }) => ({
  textShadow: `0 0 10px ${theme.palette.primary.main}, 0 0 20px ${theme.palette.primary.main}`,
  animation: 'pulse 2s infinite alternate',
  '@keyframes pulse': {
    from: { textShadow: `0 0 10px ${theme.palette.primary.main}` },
    to: { textShadow: `0 0 20px ${theme.palette.primary.main}, 0 0 30px ${theme.palette.primary.light}` }
  }
}));

const SpaceCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  height: 300,
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3)`,
  transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  '&:hover': {
    transform: 'translateY(-10px) scale(1.03)',
    boxShadow: `0 12px 40px rgba(30, 144, 255, 0.4)`,
    '&::after': {
      opacity: 1
    }
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(45deg, transparent, ${alpha(theme.palette.primary.main, 0.2)}, transparent)`,
    opacity: 0,
    transition: 'opacity 0.5s ease'
  }
}));

const DashboardPage = () => {
  try {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const cards = [
      {
        title: 'Filmes',
        description: 'Explore o universo cinematográfico',
        image: DEFAULT_MOVIE,
        path: '/movies',
        icon: '🎬'
      },
      {
        title: 'Séries',
        description: 'Viaje por temporadas infinitas',
        image: DEFAULT_SERIES,
        path: '/series',
        icon: '📺'
      },
      {
        title: 'Categorias',
        description: 'Navegue pelas galáxias de conteúdo',
        image: DEFAULT_CATEGORIES,
        path: '/categories',
        icon: '🌌'
      }
    ];

    const handleCardClick = (path) => {
      navigate(path);
    };

    return (
      <StyledContainer maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <GlowText
            variant={isMobile ? 'h3' : 'h2'}
            component="h1"
            gutterBottom
            fontWeight="bold"
            color="primary"
          >
            Bem-vindo ao CosmosTV
          </GlowText>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ 
              maxWidth: 700, 
              mx: 'auto',
              textShadow: '0 0 8px rgba(255,255,255,0.3)'
            }}
          >
            Explore um universo de entretenimento com nossa coleção premium de filmes e séries
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {cards.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.title}>
              <SpaceCard>
                <CardActionArea 
                  onClick={() => handleCardClick(card.path)}
                  sx={{ height: '100%' }}
                >
                  <Box
                    sx={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url(${card.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      height: '100%',
                      width: '100%',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      p: 3,
                      color: '#fff'
                    }}
                  >
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        fontSize: '2rem',
                        opacity: 0.8
                      }}
                    >
                      {card.icon}
                    </Box>
                    
                    <Box sx={{ position: 'relative', zIndex: 2 }}>
                      <Typography 
                        variant="h5" 
                        fontWeight="bold" 
                        gutterBottom
                        sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                      >
                        {card.title}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 2,
                          textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                        }}
                      >
                        {card.description}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{
                          borderWidth: 2,
                          fontWeight: 'bold',
                          '&:hover': {
                            borderWidth: 2,
                            backgroundColor: alpha(theme.palette.primary.main, 0.1)
                          }
                        }}
                      >
                        Explorar
                      </Button>
                    </Box>
                  </Box>
                </CardActionArea>
              </SpaceCard>
            </Grid>
          ))}
        </Grid>

        <Box textAlign="center" mt={8}>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              maxWidth: 600, 
              mx: 'auto',
              textShadow: '0 0 8px rgba(255,255,255,0.2)'
            }}
          >
            "Não estamos destinados a salvar o mundo. Estamos destinados a deixá-lo." - Interstellar
          </Typography>
        </Box>
      </StyledContainer>
    );
  } catch (error) {
    console.error('Error in DashboardPage:', error);
    return (
      <Container maxWidth="lg" sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Ocorreu um erro ao carregar a página
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Por favor, tente recarregar a página ou volte mais tarde
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 3 }}
          onClick={() => window.location.reload()}
        >
          Recarregar Página
        </Button>
      </Container>
    );
  }
};

export default DashboardPage;