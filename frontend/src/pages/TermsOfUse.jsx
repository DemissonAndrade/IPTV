import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  useTheme
} from '@mui/material';

const TermsOfUse = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            textAlign: 'center',
            mb: 4
          }}
        >
          Termos de Uso
        </Typography>

        <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            1. Aceitação dos Termos
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Ao acessar e usar o StreamFlix, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
            Se você não concordar com qualquer parte destes termos, não poderá usar nosso serviço.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            2. Serviços Oferecidos
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            O StreamFlix oferece acesso a conteúdo de streaming incluindo filmes, séries e canais de TV ao vivo. 
            O acesso está sujeito à disponibilidade e pode variar de acordo com sua localização.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            3. Conta do Usuário
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Para acessar determinados recursos do serviço, você precisará criar uma conta. Você é responsável por:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3, textAlign: 'justify' }}>
            <li>Manter a confidencialidade de suas credenciais de login</li>
            <li>Toda a atividade que ocorre em sua conta</li>
            <li>Fornecer informações precisas e atualizadas</li>
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            4. Propriedade Intelectual
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Todo o conteúdo disponível no StreamFlix, incluindo filmes, séries, programas de TV, imagens, 
            textos, gráficos, logotipos e software, é propriedade do StreamFlix ou de seus licenciadores 
            e está protegido por leis de direitos autorais.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            5. Uso Aceitável
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Você concorda em não:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3, textAlign: 'justify' }}>
            <li>Reproduzir, distribuir ou modificar qualquer conteúdo sem autorização</li>
            <li>Usar o serviço para fins ilegais ou não autorizados</li>
            <li>Tentar acessar áreas restritas do sistema</li>
            <li>Interferir no funcionamento normal do serviço</li>
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            6. Limitação de Responsabilidade
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            O StreamFlix não se responsabiliza por interrupções no serviço, perda de dados ou quaisquer 
            danos indiretos resultantes do uso ou incapacidade de usar o serviço.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            7. Modificações nos Termos
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. 
            As alterações entrarão em vigor imediatamente após a publicação. 
            O uso continuado do serviço constitui aceitação dos termos modificados.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            8. Lei Aplicável
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Estes Termos de Uso são regidos pelas leis do Brasil. 
            Qualquer disputa relacionada a estes termos será resolvida nos tribunais competentes do Brasil.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            9. Contato
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco em:
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Email: legal@streamflix.com<br />
            Endereço: Av. Paulista, 1000 - São Paulo/SP
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default TermsOfUse;
