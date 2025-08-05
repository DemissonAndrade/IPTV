import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Careers = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Carreiras
      </Typography>
      <Box sx={{ whiteSpace: 'pre-line', fontSize: '1rem', color: 'text.primary' }}>
        {`Junte-se à nossa equipe e faça parte de um ambiente inovador e dinâmico.

Estamos sempre em busca de talentos apaixonados por tecnologia e entretenimento para crescer conosco.

Oferecemos oportunidades de desenvolvimento profissional, ambiente colaborativo e benefícios competitivos.

Confira nossas vagas abertas e envie seu currículo para fazer parte da revolução do streaming.`}
      </Box>
    </Container>
  );
};

export default Careers;
