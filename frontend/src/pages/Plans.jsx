import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Check,
  Star,
  Devices,
  Hd,
  Speed,
  Support,
} from '@mui/icons-material';
import { plansService } from '@/services/api';
import { useAuth } from '../contexts/AuthContext';

const Plans = () => {
  const { isAuthenticated, user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const response = await plansService.getAll();
        // Adiciona conversão segura para número
        const formattedPlans = (response.data || []).map(plan => ({
          ...plan,
          preco: parseFloat(plan.preco) || 0
        }));
        setPlans(formattedPlans);
      } catch (err) {
        console.error('Erro ao carregar planos:', err);
        setError('Erro ao carregar planos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  const getFeaturesByPlan = (plan) => {
    const baseFeatures = [
      'Acesso a todos os canais',
      'Suporte 24/7',
      'Sem anúncios',
      'Múltiplas plataformas',
    ];

    const qualityFeatures = {
      'SD': ['Qualidade SD (480p)'],
      'HD': ['Qualidade HD (720p)', 'Qualidade SD (480p)'],
      'FHD': ['Qualidade Full HD (1080p)', 'Qualidade HD (720p)', 'Qualidade SD (480p)'],
      '4K': ['Qualidade 4K (2160p)', 'Qualidade Full HD (1080p)', 'Qualidade HD (720p)', 'Qualidade SD (480p)'],
    };

    const deviceFeatures = [
      `${plan.dispositivos_simultaneos} dispositivo${plan.dispositivos_simultaneos > 1 ? 's' : ''} simultâneo${plan.dispositivos_simultaneos > 1 ? 's' : ''}`,
    ];

    return [
      ...baseFeatures,
      ...qualityFeatures[plan.qualidade_max] || [],
      ...deviceFeatures,
    ];
  };

  const getPopularPlan = () => {
    if (plans.length >= 3) {
      return plans[1]._id;
    }
    return null;
  };

  const handleSelectPlan = (planId) => {
    if (!isAuthenticated) {
      window.location.href = `/register?plan=${planId}`;
    } else {
      console.log('Alterar plano para:', planId);
    }
  };

  // Função para formatar o preço de forma segura
  const formatPrice = (price) => {
    try {
      // Remove caracteres não numéricos e converte para float
      const numericValue = typeof price === 'string'
        ? parseFloat(price.replace(/[^\d.,]/g, '').replace(',', '.'))
        : Number(price);
      
      // Verifica se é um número válido
      if (isNaN(numericValue)) {
        console.warn('Valor de preço inválido:', price);
        return '0,00';
      }
      
      // Formata para 2 casas decimais e substitui ponto por vírgula
      return numericValue.toFixed(2).replace('.', ',');
    } catch (error) {
      console.error('Erro ao formatar preço:', error);
      return '0,00';
    }
  };

  const renderPlanCard = (plan, index) => {
    const isPopular = plan._id === getPopularPlan();
    const isCurrentPlan = isAuthenticated && user?.plano === plan._id;
    const features = getFeaturesByPlan(plan);

    return (
      <Grid item xs={12} md={4} key={plan._id}>
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            border: isPopular ? '2px solid' : '1px solid',
            borderColor: isPopular ? 'primary.main' : 'divider',
            transform: isPopular ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: isPopular ? 'scale(1.08)' : 'scale(1.02)',
            },
          }}
        >
          {isPopular && (
            <Chip
              label="Mais Popular"
              color="primary"
              sx={{
                position: 'absolute',
                top: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1,
                fontWeight: 'bold',
              }}
            />
          )}

          {isCurrentPlan && (
            <Chip
              label="Plano Atual"
              color="success"
              sx={{
                position: 'absolute',
                top: isPopular ? 20 : -10,
                right: 16,
                zIndex: 1,
                fontWeight: 'bold',
              }}
            />
          )}

          <CardContent sx={{ flexGrow: 1, p: 3, pt: isPopular ? 4 : 3 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontWeight: 'bold',
                  mb: 1,
                  color: isPopular ? 'primary.main' : 'text.primary',
                }}
              >
                {plan.nome}
              </Typography>

              <Typography
                variant="h3"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  mb: 1,
                }}
              >
                R$ {formatPrice(plan.preco)}
                <Typography
                  component="span"
                  variant="h6"
                  sx={{ color: 'text.secondary', fontWeight: 'normal' }}
                >
                  /mês
                </Typography>
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {plan.descricao}
              </Typography>
            </Box>

            <List sx={{ mb: 3 }}>
              {features.map((feature, i) => (
                <ListItem key={i} sx={{ py: 0.5, px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Check color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={feature}
                    primaryTypographyProps={{
                      variant: 'body2',
                    }}
                  />
                </ListItem>
              ))}
            </List>

            <Box sx={{ mt: 'auto' }}>
              <Button
                fullWidth
                variant={isPopular ? 'contained' : 'outlined'}
                size="large"
                onClick={() => handleSelectPlan(plan._id)}
                disabled={isCurrentPlan}
                sx={{
                  py: 1.5,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
              >
                {isCurrentPlan
                  ? 'Plano Atual'
                  : isAuthenticated
                  ? 'Alterar Plano'
                  : 'Escolher Plano'
                }
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
          Escolha seu Plano
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
          Desfrute da melhor experiência de streaming com nossos planos flexíveis
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 8 }}>
        {plans.map(renderPlanCard)}
      </Grid>
    </Container>
  );
};

export default Plans;