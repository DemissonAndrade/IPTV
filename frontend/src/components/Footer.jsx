import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  IconButton,
  useTheme
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              StreamFlix
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              A melhor plataforma de streaming para filmes, séries e TV ao vivo. 
              Assista onde quiser, quando quiser.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                sx={{ 
                  color: theme.palette.common.white,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main
                  }
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                sx={{ 
                  color: theme.palette.common.white,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main
                  }
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                sx={{ 
                  color: theme.palette.common.white,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main
                  }
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                sx={{ 
                  color: theme.palette.common.white,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main
                  }
                }}
              >
                <YouTubeIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Navegação
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component="button"
                onClick={() => handleNavigation('/movies')}
                sx={{ 
                  color: theme.palette.common.white,
                  opacity: 0.8,
                  '&:hover': { 
                    opacity: 1,
                    textDecoration: 'none'
                  }
                }}
              >
                Filmes
              </Link>
              <Link
                component="button"
                onClick={() => handleNavigation('/series')}
                sx={{ 
                  color: theme.palette.common.white,
                  opacity: 0.8,
                  '&:hover': { 
                    opacity: 1,
                    textDecoration: 'none'
                  }
                }}
              >
                Séries
              </Link>
              <Link
                component="button"
                onClick={() => handleNavigation('/channels')}
                sx={{ 
                  color: theme.palette.common.white,
                  opacity: 0.8,
                  '&:hover': { 
                    opacity: 1,
                    textDecoration: 'none'
                  }
                }}
              >
                TV ao Vivo
              </Link>
              <Link
                component="button"
                onClick={() => handleNavigation('/search')}
                sx={{ 
                  color: theme.palette.common.white,
                  opacity: 0.8,
                  '&:hover': { 
                    opacity: 1,
                    textDecoration: 'none'
                  }
                }}
              >
                Buscar
              </Link>
            </Box>
          </Grid>

          {/* Legal */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component="button"
                onClick={() => handleNavigation('/terms')}
                sx={{ 
                  color: theme.palette.common.white,
                  opacity: 0.8,
                  '&:hover': { 
                    opacity: 1,
                    textDecoration: 'none'
                  }
                }}
              >
                Termos de Uso
              </Link>
              <Link
                component="button"
                onClick={() => handleNavigation('/privacy')}
                sx={{ 
                  color: theme.palette.common.white,
                  opacity: 0.8,
                  '&:hover': { 
                    opacity: 1,
                    textDecoration: 'none'
                  }
                }}
              >
                Política de Privacidade
              </Link>
              <Link
                component="button"
                onClick={() => handleNavigation('/about')}
                sx={{ 
                  color: theme.palette.common.white,
                  opacity: 0.8,
                  '&:hover': { 
                    opacity: 1,
                    textDecoration: 'none'
                  }
                }}
              >
                Sobre Nós
              </Link>
            </Box>
          </Grid>

          {/* Support */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Suporte
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Precisa de ajuda? Entre em contato com nossa equipe de suporte.
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Email: suporte@streamflix.com
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Telefone: (11) 9999-9999
            </Typography>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: `1px solid ${theme.palette.primary.main}`,
            pt: 3,
            mt: 4,
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © {currentYear} StreamFlix. Todos os direitos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
