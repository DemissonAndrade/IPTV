import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Sobre': [
      { text: 'Quem Somos', href: '/about' },
      { text: 'Carreiras', href: '/careers' },
      { text: 'Imprensa', href: '/press' },
      { text: 'Blog', href: '/blog' },
    ],
    'Suporte': [
      { text: 'Central de Ajuda', href: '/help' },
      { text: 'Contato', href: '/contact' },
      { text: 'Status do Serviço', href: '/status' },
      { text: 'Reportar Problema', href: '/report' },
    ],
    'Legal': [
      { text: 'Termos de Uso', href: '/terms' },
      { text: 'Política de Privacidade', href: '/privacy' },
      { text: 'Cookies', href: '/cookies' },
      { text: 'DMCA', href: '/dmca' },
    ],
  };

  const socialLinks = [
    { icon: <Facebook />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <Twitter />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <Instagram />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <YouTube />, href: 'https://youtube.com', label: 'YouTube' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#121212',
        color: 'white',
        py: 3,
        mt: 'auto',
        fontSize: '0.875rem',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* Logo e descrição */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 1,
              }}
            >
              IPTV Pro
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              A melhor plataforma de streaming de TV e filmes do Brasil. 
              Assista aos seus canais favoritos, filmes e séries em alta qualidade, 
              quando e onde quiser.
            </Typography>
            
            {/* Informações de contato */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Email sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body2">contato@iptvpro.com.br</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Phone sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body2">(11) 9999-9999</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body2">São Paulo, SP - Brasil</Typography>
              </Box>
            </Box>

            {/* Redes sociais */}
            <Box>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Links do footer */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <Grid item xs={12} sm={6} md={2.67} key={category}>
              <Typography
                variant="subtitle1"
                component="div"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                {category}
              </Typography>
              <Box>
                {links.map((link) => (
                  <Link
                    key={link.text}
                    href={link.href}
                    sx={{
                      display: 'block',
                      color: 'text.secondary',
                      textDecoration: 'none',
                      mb: 0.5,
                      fontSize: '0.85rem',
                      '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {link.text}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Copyright e informações legais */}
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
              © {currentYear} IPTV Pro. Todos os direitos reservados.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mr: 1, fontSize: '0.75rem' }}>
                Desenvolvido por Manus AI
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                v1.0.0
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Aviso legal */}
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '0.7rem',
              lineHeight: 1.4,
            }}
          >
            Este serviço é destinado apenas para conteúdo licenciado e autorizado. 
            O uso indevido pode resultar na suspensão da conta. 
            Consulte nossos Termos de Uso para mais informações.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

