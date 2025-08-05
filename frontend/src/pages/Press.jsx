import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Press = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Imprensa
      </Typography>
      <Box sx={{ whiteSpace: 'pre-line', fontSize: '1rem', color: 'text.primary' }}>
        {`Para solicitações de imprensa e informações oficiais sobre a empresa, entre em contato conosco.

Nossa equipe de comunicação está disponível para fornecer materiais, entrevistas e esclarecimentos.

Email: imprensa@iptvpro.com.br
Telefone: (61) 99999-9999`}
      </Box>
    </Container>
  );
};

export default Press;
