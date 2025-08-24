import React from 'react';
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Paper
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Telegram as TelegramIcon,
  HelpOutline as HelpIcon,
  PlayCircle as PlayIcon,
  Settings as SettingsIcon,
  Payment as PaymentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Help = () => {
  const navigate = useNavigate();

  const faqItems = [
    {
      question: "Como faço para começar a assistir?",
      answer: "Após adquirir seu plano, você receberá um e-mail com as instruções de acesso. Instale o aplicativo recomendado, insira seus dados de login e comece a assistir imediatamente. Temos tutoriais passo a passo para cada dispositivo."
    },
    {
      question: "Em quais dispositivos posso usar?",
      answer: "Nosso serviço funciona em: Smart TVs Samsung e LG, Android TV, TV Box, Amazon Fire TV Stick, Celulares Android e iOS, Tablets, Computadores Windows e Mac, Chromecast e Apple TV."
    },
    {
      question: "O que fazer se o serviço parar de funcionar?",
      answer: "Primeiro, verifique sua conexão com a internet. Se estiver tudo certo, tente reiniciar o aplicativo ou dispositivo. Se o problema persistir, entre em contato com nosso suporte 24h via WhatsApp (61) 99295-1411."
    },
    {
      question: "Posso usar em mais de um dispositivo ao mesmo tempo?",
      answer: "Cada plano permite o uso em um dispositivo por vez. Para usar em múltiplos dispositivos simultaneamente, você pode adquirir planos adicionais com desconto especial."
    },
    {
      question: "Como renovo meu plano?",
      answer: "Você pode renovar diretamente pelo site em 'Meu Perfil' ou entrar em contato via WhatsApp. Oferecemos descontos para renovações antecipadas e planos anuais."
    },
    {
      question: "O serviço tem canais em HD?",
      answer: "Sim! A maioria dos canais está disponível em Full HD (1080p) e alguns em 4K. A qualidade se ajusta automaticamente de acordo com sua conexão."
    }
  ];

  const quickGuides = [
    {
      title: "Instalação Smart TV",
      icon: <PlayIcon />,
      steps: [
        "Baixe o aplicativo Smart IPTV ou IPTV Smarters",
        "Abra o aplicativo e anote o MAC Address",
        "Envie o MAC para nosso WhatsApp junto com seu login",
        "Aguarde 5 minutos e reinicie a TV"
      ]
    },
    {
      title: "Configuração Android",
      icon: <SettingsIcon />,
      steps: [
        "Baixe o IPTV Smarters Pro na Play Store",
        "Abra o app e escolha 'Login com Xtream Codes'",
        "Insira: Username, Password e URL fornecidos",
        "Clique em 'Add User' e pronto!"
      ]
    },
    {
      title: "Pagamento Facilitado",
      icon: <PaymentIcon />,
      steps: [
        "Escolha seu plano no site",
        "Pague via Pix, cartão ou boleto",
        "Envie o comprovante pelo WhatsApp",
        "Receba seus dados de acesso em até 10 minutos"
      ]
    }
  ];

  const contactMethods = [
    {
      icon: <WhatsAppIcon />,
      title: "WhatsApp",
      value: "(61) 99295-1411",
      description: "Suporte 24 horas, todos os dias",
      action: () => window.open('https://wa.me/5561992951411', '_blank')
    },
    {
      icon: <TelegramIcon />,
      title: "Telegram",
      value: "@IPTVProSuporte",
      description: "Canal oficial para atualizações",
      action: () => window.open('https://t.me/IPTVProSuporte', '_blank')
    },
    {
      icon: <EmailIcon />,
      title: "E-mail",
      value: "contato@iptvpro.com.br",
      description: "Resposta em até 2 horas úteis",
      action: () => window.location.href = 'mailto:contato@iptvpro.com.br'
    },
    {
      icon: <PhoneIcon />,
      title: "Telefone",
      value: "(61) 99295-1411",
      description: "Chamadas e WhatsApp",
      action: () => window.location.href = 'tel:+5561992951411'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" gutterBottom fontWeight="bold" color="primary">
          Central de Ajuda
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Estamos aqui para ajudar você 24 horas por dia, 7 dias por semana
        </Typography>
      </Box>

      {/* Quick Contact Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {contactMethods.map((contact, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
              onClick={contact.action}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ color: 'primary.main', mb: 1 }}>
                  {contact.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {contact.title}
                </Typography>
                <Typography variant="body2" color="primary" fontWeight="bold">
                  {contact.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {contact.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Start Guides */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Guias Rápidos de Instalação
        </Typography>
        <Grid container spacing={3}>
          {quickGuides.map((guide, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ color: 'primary.main', mr: 1 }}>
                      {guide.icon}
                    </Box>
                    <Typography variant="h6">
                      {guide.title}
                    </Typography>
                  </Box>
                  <List dense>
                    {guide.steps.map((step, stepIndex) => (
                      <ListItem key={stepIndex} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <CheckIcon fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={step}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Perguntas Frequentes
        </Typography>
        <Paper elevation={0} sx={{ bgcolor: 'background.default', p: 2 }}>
          {faqItems.map((item, index) => (
            <Accordion key={index} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="medium">
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      </Box>

      {/* Troubleshooting Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Solução de Problemas
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WarningIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">Problemas Comuns</Typography>
                </Box>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Tela preta ou travando"
                      secondary="Reinicie o app e verifique sua internet"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Áudio sem sincronia"
                      secondary="Ajuste o delay de áudio nas configurações"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Canais offline"
                      secondary="Aguarde 5 minutos ou entre em contato"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TimeIcon color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6">Horários de Atendimento</Typography>
                </Box>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="WhatsApp"
                      secondary="24 horas por dia, 7 dias por semana"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="E-mail"
                      secondary="Resposta em até 2 horas úteis"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Telefone"
                      secondary="9h às 22h - Segunda a Domingo"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Contact Form Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Ainda Precisa de Ajuda?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Nossa equipe está pronta para ajudar você com qualquer dúvida
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<WhatsAppIcon />}
          onClick={() => window.open('https://wa.me/5561992951411', '_blank')}
          sx={{ mr: 2 }}
        >
          Falar no WhatsApp
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<EmailIcon />}
          onClick={() => window.location.href = 'mailto:contato@iptvpro.com.br'}
        >
          Enviar E-mail
        </Button>
      </Box>
    </Container>
  );
};

export default Help;
