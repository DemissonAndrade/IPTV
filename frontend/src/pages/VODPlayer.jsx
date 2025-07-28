import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Rating,
  Divider
} from '@mui/material';
import {
  ArrowBack,
  Favorite,
  FavoriteBorder,
  Share,
  PlayArrow,
  Download
} from '@mui/icons-material';
import VideoPlayer from '../components/VideoPlayer';
import api from '../services/api';

const VODPlayer = () => {
  const { contentId } = useParams();
  const navigate = useNavigate();
  
  const [content, setContent] = useState(null);
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    loadContentData();
    loadStreamData();
  }, [contentId]);

  const loadContentData = async () => {
    try {
      const response = await api.get(`/vod/movies/${contentId}`);
      console.log('Resposta loadContentData:', response);
      if (response.success) {
        setContent(response.data);
      } else {
        setError('Conteúdo não encontrado');
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error);
      setError('Erro ao carregar informações do conteúdo');
    }
  };

  const loadStreamData = async () => {
    try {
      const response = await api.get(`/vod/movies/${contentId}/stream`);
      console.log('Resposta loadStreamData:', response);
      if (response.success) {
        setStreamData(response.data);
      } else {
        setError('Stream não encontrado');
      }
    } catch (error) {
      console.error('Erro ao carregar stream:', error);
      setError('Erro ao carregar stream do conteúdo');
    } finally {
      setLoading(false);
    }
  };

  const handleProgress = (progress) => {
    setWatchTime(prev => prev + 1);
    
    // Enviar analytics a cada 30 segundos
    if (watchTime % 30 === 0) {
      api.post('/streaming/analytics/view', {
        user_id: 1, // Pegar do contexto de auth
        content_id: contentId,
        content_type: 'vod',
        watch_time: watchTime,
        device: 'web'
      }).catch(console.error);
    }
  };

  const handleFavorite = async () => {
    try {
      // Simular toggle de favorito
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: content?.titulo,
        text: content?.descricao,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {content?.titulo}
        </Typography>
        <Tooltip title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
          <IconButton onClick={handleFavorite}>
            {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Compartilhar">
          <IconButton onClick={handleShare}>
            <Share />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {/* Player */}
        <Grid item xs={12} md={8}>
          {isPlaying ? (
            <VideoPlayer
              streamUrl={streamData?.stream_url}
              title={content?.titulo}
              onProgress={handleProgress}
              autoPlay={true}
            />
          ) : (
            <Card sx={{ position: 'relative', backgroundColor: '#000' }}>
              <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${content?.capa_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)'
                    }}
                  />
                  <IconButton
                    onClick={handlePlay}
                    sx={{
                      backgroundColor: 'rgba(255,107,53,0.9)',
                      color: 'white',
                      width: 80,
                      height: 80,
                      zIndex: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(255,107,53,1)'
                      }
                    }}
                  >
                    <PlayArrow sx={{ fontSize: 40 }} />
                  </IconButton>
                </Box>
              </Box>
            </Card>
          )}
          
          {/* Informações do servidor */}
          {streamData?.server_info && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Informações do Stream
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    label={`Servidor: ${streamData.server_info.name}`}
                    variant="outlined"
                  />
                  <Chip 
                    label={`Localização: ${streamData.server_info.location}`}
                    variant="outlined"
                  />
                  <Chip 
                    label={`Carga: ${streamData.server_info.load}%`}
                    variant="outlined"
                    color={streamData.server_info.load > 70 ? 'error' : 'success'}
                  />
                  <Chip 
                    label={`Formato: ${streamData.format}`}
                    variant="outlined"
                  />
                  {streamData.quality_levels && (
                    <Chip 
                      label={`Qualidades: ${streamData.quality_levels.join(', ')}`}
                      variant="outlined"
                    />
                  )}
                </Box>
                
                {/* Legendas disponíveis */}
                {streamData.subtitles && streamData.subtitles.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Legendas Disponíveis:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {streamData.subtitles.map((subtitle, index) => (
                        <Chip 
                          key={index}
                          size="small"
                          label={subtitle.language === 'pt-BR' ? 'Português' : 'Inglês'}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Informações do conteúdo */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informações
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Ano
                </Typography>
                <Typography variant="body1">
                  {content?.ano}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Duração
                </Typography>
                <Typography variant="body1">
                  {formatDuration(content?.duracao)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Gênero
                </Typography>
                <Chip size="small" label={content?.genero} />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Avaliação
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={content?.rating / 2} precision={0.1} readOnly />
                  <Typography variant="body2">
                    {content?.rating}/10
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" paragraph>
                {content?.descricao}
              </Typography>

              {content?.diretor && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Diretor
                  </Typography>
                  <Typography variant="body1">
                    {content.diretor}
                  </Typography>
                </Box>
              )}

              {content?.elenco && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Elenco Principal
                  </Typography>
                  <Typography variant="body1">
                    {content.elenco.join(', ')}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VODPlayer;

