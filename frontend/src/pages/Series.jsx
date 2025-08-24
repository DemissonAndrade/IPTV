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
  Pagination,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { vodService } from '@/services/api';
import { useNavigate } from 'react-router-dom';

import { useSearchParams } from 'react-router-dom';

const Series = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12; // Aumentei para 12 já que os cards serão menores
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  useEffect(() => {
    const loadSeries = async () => {
      setLoading(true);
      try {
        let response;
        if (category) {
          response = await vodService.getSeriesByCategory(category, { page, limit });
        } else {
          response = await vodService.getSeries({ page, limit });
        }
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
  }, [page, category]);

  const handleSerieClick = (serieId) => {
    navigate(`/vod/${serieId}`);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Configurações responsivas para cards compactos
  const getCardStyles = () => {
    if (isMobile) {
      return {
        maxWidth: 150,
        imageRatio: '120%',
        titleVariant: 'subtitle2',
        titleLines: 2,
        descLines: 2,
        fontSize: '0.75rem',
        padding: 1,
        gridColumns: {
          xs: 6, // 2 cards por linha
          sm: 4, // 3 cards por linha
          md: 3, // 4 cards por linha
          lg: 2.4 // 5 cards por linha
        }
      };
    }
    if (isTablet) {
      return {
        maxWidth: 180,
        imageRatio: '130%',
        titleVariant: 'subtitle1',
        titleLines: 2,
        descLines: 3,
        fontSize: '0.8rem',
        padding: 1.5,
        gridColumns: {
          xs: 6,
          sm: 4,
          md: 3,
          lg: 2.4
        }
      };
    }
    return {
      maxWidth: 200,
      imageRatio: '140%',
      titleVariant: 'subtitle1',
      titleLines: 2,
      descLines: 3,
      fontSize: '0.875rem',
      padding: 2,
      gridColumns: {
        xs: 6,
        sm: 4,
        md: 3,
        lg: 2.4
      }
    };
  };

  const cardStyles = getCardStyles();

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
    <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 4 }}>
      <Typography 
        variant={isMobile ? 'h5' : 'h4'} 
        component="h1" 
        sx={{ 
          fontWeight: 'bold', 
          mb: isMobile ? 2 : 4, 
          color: 'white',
          textAlign: isMobile ? 'center' : 'left'
        }}
      >
        Séries
      </Typography>

      {series.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Nenhuma série disponível no momento
          </Typography>
        </Box>
      ) : (
        <>
          <Grid 
            container 
            spacing={isMobile ? 1.5 : 2} 
            justifyContent="center"
            alignItems="stretch"
          >
            {series.map((serie) => (
              <Grid 
                item 
                xs={cardStyles.gridColumns.xs}
                sm={cardStyles.gridColumns.sm}
                md={cardStyles.gridColumns.md}
                lg={cardStyles.gridColumns.lg}
                key={serie.id}
                sx={{ display: 'flex', justifyContent: 'center' }}
              >
                <Card 
                  sx={{ 
                    width: '100%',
                    maxWidth: cardStyles.maxWidth,
                    backgroundColor: '#1e1e1e',
                    color: 'white',
                    borderRadius: 2,
                    boxShadow: 3,
                    transition: isMobile ? 'none' : 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: isMobile ? 'none' : 'scale(1.03)',
                      boxShadow: isMobile ? 3 : '0 8px 16px rgba(25, 118, 210, 0.7)',
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSerieClick(serie.id)}
                >
                  <Box sx={{ 
                    position: 'relative',
                    paddingTop: cardStyles.imageRatio,
                    overflow: 'hidden',
                    borderRadius: '8px 8px 0 0',
                  }}>
                    <CardMedia
                      component="img"
                      image={serie.capa_url || '/placeholder-series.jpg'}
                      alt={serie.titulo}
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
                    >
                      {serie.titulo}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 0.5,
                      mb: 0.5
                    }}>
                      <Chip 
                        label={serie.ano_inicio || '----'} 
                        size="small" 
                        sx={{ 
                          fontSize: `calc(${cardStyles.fontSize} - 0.15rem)`,
                          height: '20px'
                        }} 
                      />
                      <Chip 
                        label={serie.genero || 'Gênero'} 
                        size="small" 
                        color="primary"
                        sx={{ 
                          fontSize: `calc(${cardStyles.fontSize} - 0.15rem)`,
                          height: '20px'
                        }}
                      />
                    </Box>
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
                        mb: 1,
                        fontSize: `calc(${cardStyles.fontSize} - 0.05rem)`
                      }}
                    >
                      {serie.descricao || 'Sem descrição'}
                    </Typography>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSerieClick(serie.id);
                      }}
                      sx={{
                        py: 0.3,
                        fontSize: cardStyles.fontSize,
                        mt: 'auto'
                      }}
                    >
                      Ver Temporadas
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
              size={isMobile ? 'small' : 'medium'}
              siblingCount={isMobile ? 0 : 1}
              boundaryCount={isMobile ? 1 : 2}
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default Series;