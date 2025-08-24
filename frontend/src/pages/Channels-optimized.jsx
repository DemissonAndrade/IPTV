import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Paper
} from '@mui/material';
import { PlayArrow, Close, Search } from '@mui/icons-material';
import { channelsService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ChannelsPage = () => {
  const { isAuthenticated } = useAuth();
  
  // Estados simplificados
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [page, setPage] = useState(1);
  
  const ITEMS_PER_PAGE = 20;

  // Carregar canais com paginação
  const loadChannels = useCallback(async () => {
    try {
      setLoading(true);
      const response = await channelsService.getChannels({
        page,
        limit: ITEMS_PER_PAGE,
        search: searchTerm
      });
      
      setChannels(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar canais:', err);
      setError('Erro ao carregar canais');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  // Filtrar canais localmente
  const filteredChannels = useMemo(() => {
    if (!searchTerm) return channels;
    return channels.filter(channel => 
      channel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [channels, searchTerm]);

  const handlePlayChannel = (channel) => {
    if (!isAuthenticated) {
      setError('Faça login para assistir');
      return;
    }
    setSelectedChannel(channel);
    setPlayerOpen(true);
  };

  // Card simplificado
  const SimpleChannelCard = ({ channel }) => (
    <Card sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)'
      }
    }}>
      <CardMedia
        component="img"
        height="120"
        image={channel.logo_url || `https://via.placeholder.com/300x120/1976d2/fff?text=${encodeURIComponent(channel.name)}`}
        alt={channel.name}
        sx={{ objectFit: 'contain', p: 1 }}
      />
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h6" noWrap sx={{ fontSize: '1rem', mb: 1 }}>
          {channel.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {channel.category_name || 'TV'}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          size="small"
          fullWidth
          startIcon={<PlayArrow />}
          onClick={() => handlePlayChannel(channel)}
        >
          Assistir
        </Button>
      </Box>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Cabeçalho simples */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Canais de TV
      </Typography>

      {/* Barra de busca simples */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar canal..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
      </Paper>

      {/* Mensagem de erro */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Lista de canais */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {filteredChannels.length > 0 ? (
            <Grid container spacing={2}>
              {filteredChannels.map((channel) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={channel.id}>
                  <SimpleChannelCard channel={channel} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Nenhum canal encontrado
              </Typography>
            </Paper>
          )}

          {/* Paginação simples */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 1 }}>
            <Button 
              variant="outlined" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setPage(p => p + 1)}
              disabled={filteredChannels.length < ITEMS_PER_PAGE}
            >
              Próximo
            </Button>
          </Box>
        </>
      )}

      {/* Modal do player */}
      <Dialog
        open={playerOpen}
        onClose={() => setPlayerOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {selectedChannel?.name}
          <IconButton onClick={() => setPlayerOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#000' }}>
          <Typography variant="h6" color="white">
            Player de Vídeo
          </Typography>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ChannelsPage;
