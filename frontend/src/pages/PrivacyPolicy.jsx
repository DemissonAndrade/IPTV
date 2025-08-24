import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  useTheme
} from '@mui/material';

const PrivacyPolicy = () => {
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
          Política de Privacidade
        </Typography>

        <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            1. Introdução
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Esta Política de Privacidade descreve como o StreamFlix coleta, usa e compartilha suas 
            informações pessoais quando você usa nosso serviço. Ao usar nosso serviço, você concorda 
            com a coleta e uso de informações de acordo com esta política.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            2. Informações que Coletamos
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Podemos coletar os seguintes tipos de informações:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3, textAlign: 'justify' }}>
            <li><strong>Informações pessoais:</strong> nome, email, data de nascimento, informações de pagamento</li>
            <li><strong>Dados de uso:</strong> histórico de visualização, preferências, interações com o serviço</li>
            <li><strong>Dados técnicos:</strong> endereço IP, tipo de dispositivo, navegador, localização</li>
            <li><strong>Cookies e tecnologias similares:</strong> para melhorar a experiência do usuário</li>
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            3. Como Usamos Suas Informações
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Utilizamos suas informações para:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3, textAlign: 'justify' }}>
            <li>Fornecer e manter nosso serviço</li>
            <li>Personalizar sua experiência de visualização</li>
            <li>Processar pagamentos e assinaturas</li>
            <li>Enviar comunicações importantes sobre o serviço</li>
            <li>Melhorar e desenvolver novos recursos</li>
            <li>Prevenir fraudes e garantir a segurança</li>
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            4. Compartilhamento de Informações
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Podemos compartilhar suas informações com:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3, textAlign: 'justify' }}>
            <li><strong>Prestadores de serviço:</strong> processadores de pagamento, hospedagem, analytics</li>
            <li><strong>Parceiros de conteúdo:</strong> para fins de licenciamento e relatórios</li>
            <li><strong>Autoridades legais:</strong> quando exigido por lei ou para proteger nossos direitos</li>
            <li><strong>Empresas afiliadas:</strong> para operações comerciais consistentes</li>
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Nunca vendemos suas informações pessoais para terceiros.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            5. Cookies e Tecnologias de Rastreamento
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Utilizamos cookies e tecnologias similares para:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3, textAlign: 'justify' }}>
            <li>Lembrar suas preferências e configurações</li>
            <li>Analisar o uso do serviço e melhorar o desempenho</li>
            <li>Fornecer anúncios relevantes (quando aplicável)</li>
            <li>Garantir a segurança da conta</li>
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Você pode controlar o uso de cookies através das configurações do seu navegador.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            6. Segurança das Informações
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações, 
            incluindo criptografia, controles de acesso e monitoramento contínuo. No entanto, 
            nenhum método de transmissão ou armazenamento eletrônico é 100% seguro.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            7. Seus Direitos
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            De acordo com a LGPD, você tem o direito de:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3, textAlign: 'justify' }}>
            <li>Acessar suas informações pessoais</li>
            <li>Corrigir informações imprecisas</li>
            <li>Solicitar a exclusão de seus dados</li>
            <li>Opôr-se ao processamento de seus dados</li>
            <li>Solicitar a portabilidade de dados</li>
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Para exercer esses direitos, entre em contato conosco através dos canais indicados abaixo.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            8. Retenção de Dados
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os fins 
            descritos nesta política, a menos que um período de retenção mais longo seja exigido 
            ou permitido por lei.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            9. Alterações nesta Política
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre 
            quaisquer alterações publicando a nova política nesta página e atualizando a data de 
            "Última atualização".
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            10. Contato
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco:
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Email: privacidade@streamflix.com<br />
            Telefone: (11) 9999-8888<br />
            Endereço: Av. Paulista, 1000 - São Paulo/SP - CEP: 01310-100
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Encarregado de Proteção de Dados: João Silva<br />
            Email: dpo@streamflix.com
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;
