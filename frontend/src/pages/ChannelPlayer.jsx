import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  Favorite,
  FavoriteBorder,
  Share,
  Info
} from '@mui/icons-material';
import VideoPlayer from '../components/VideoPlayer';
import api from '../services/api';

const ChannelPlayer = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  
  const [channel, setChannel] = useState(null);
  const [streamData, setStreamData] = useState(null);
  const [epgData, setEpgData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [watchTime, setWatchTime] = useState(0);

  useEffect(() => {
    loadChannelData();
    loadStreamData();
    loadEPGData();
  }, [channelId]);

  const loadChannelData = async () => {
    try {
      const response = await api.get(`/channels/${channelId}`);
      if (response.data.success) {
        setChannel(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar canal:', error);
      setError('Erro ao carregar informações do canal');
    }
  };

  const loadStreamData = async () => {
    try {
      const response = await api.get(`/channels/${channelId}/stream`);
      if (response.success) {
        setStreamData(response.data);
      } else {
        setError('Stream não encontrado');
      }
    } catch (error) {
      console.error('Erro ao carregar stream:', error);
      setError('Erro ao carregar stream do canal');
    } finally {
      setLoading(false);
    }
  };

  const loadEPGData = async () => {
    try {
      const response = await api.get(`/streaming/epg/${channelId}`);
      if (response.data.success) {
        setEpgData(response.data.data.programs || []);
      }
    } catch (error) {
      console.error('Erro ao carregar EPG:', error);
    }
  };

  const handleProgress = (progress) => {
    setWatchTime(prev => prev + 1);
    
    // Enviar analytics a cada 30 segundos
    if (watchTime % 30 === 0) {
      api.post('/streaming/analytics/view', {
        user_id: 1, // Pegar do contexto de auth
        content_id: channelId,
        content_type: 'channel',
        watch_time: watchTime,
        device: 'web'
      }).catch(console.error);
    }
  };

  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/channels/${channelId}/favorite`);
      } else {
        await api.post(`/channels/${channelId}/favorite`);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: channel?.nome,
        text: channel?.descricao,
        url: window.location.href
      });
    } else {
      // Fallback para copiar URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getCurrentProgram = () => {
    const now = new Date();
    return epgData.find(program => {
      const start = new Date(program.start_time);
      const end = new Date(program.end_time);
      return now >= start && now <= end;
    });
  };

  const getUpcomingPrograms = () => {
    const now = new Date();
    return epgData.filter(program => {
      const start = new Date(program.start_time);
      return start > now;
    }).slice(0, 5);
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

  const currentProgram = getCurrentProgram();
  const upcomingPrograms = getUpcomingPrograms();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {channel?.nome}
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
          <VideoPlayer
            streamUrl={streamData?.stream_url}
            title={currentProgram?.title || channel?.nome}
            onProgress={handleProgress}
            autoPlay={true}
          />
          
          {/* Informações do servidor */}
          {streamData?.server_info && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Informações do Servidor
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
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Programa atual */}
          {currentProgram && (
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Agora no Ar
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {currentProgram.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {currentProgram.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip size="small" label={currentProgram.category} />
                  <Chip size="small" label={currentProgram.rating} />
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Informações do canal */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sobre o Canal
              </Typography>
              <Typography variant="body2" paragraph>
                {channel?.descricao}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip size="small" label={channel?.categoria_nome} />
                <Chip size="small" label={channel?.qualidade} />
              </Box>
            </CardContent>
          </Card>

          {/* Próximos programas */}
          {upcomingPrograms.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Próximos Programas
                </Typography>
                <List dense>
                  {upcomingPrograms.map((program) => (
                    <ListItem key={program.id} divider>
                      <ListItemText
                        primary={program.title}
                        secondary={`${new Date(program.start_time).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - ${program.category}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChannelPlayer;

