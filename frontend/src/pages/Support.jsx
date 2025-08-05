import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Support = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Suporte
      </Typography>
      <Box sx={{ whiteSpace: 'pre-line', fontSize: '1rem', color: 'text.primary' }}>
        {`Central de Ajuda: Encontre respostas para as dúvidas mais comuns e tutoriais.

Contato: Fale conosco para suporte personalizado e atendimento ao cliente.

Status do Serviço: Verifique o status atual dos nossos serviços e eventuais interrupções.

Reportar Problema: Informe qualquer problema técnico ou falha que você tenha encontrado.`}
      </Box>
    </Container>
  );
};

export default Support;
