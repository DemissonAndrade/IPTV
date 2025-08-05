import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const About = () => {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Sobre Nós
            </Typography>
            <Box sx={{ whiteSpace: 'pre-line', fontSize: '1rem', color: 'text.primary' }}>
                {`A IPTV Pro nasceu com um propósito claro: entregar uma experiência de TV moderna, acessível e de alta qualidade para todos. Reunimos o melhor da tecnologia IPTV com um catálogo extenso de canais ao vivo, filmes, séries, desenhos, esportes e muito mais — tudo em um só lugar.

Por que escolher a IPTV Pro?

✅ Estabilidade e Qualidade
Nosso sistema é desenvolvido para garantir fluidez, sem travamentos e com qualidade Full HD e 4K (quando disponível).
Trabalhamos com servidores próprios e sistemas de proteção contra quedas.

✅ Suporte 24h
Nossa equipe está disponível todos os dias, a qualquer hora, para resolver dúvidas ou ajudar com configurações. Atendimento rápido via WhatsApp, Telegram ou e-mail.

✅ Compatibilidade Total
Funciona em Smart TVs (Samsung, LG, Android TV), TV Box, Celulares Android/iOS, Computadores, Fire Stick e muito mais. Você escolhe onde quer assistir.

✅ Conteúdo Atualizado
Canais nacionais e internacionais, Pay-Per-View, filmes e séries sempre atualizados, com suporte a conteúdo sob demanda (VOD).

✅ Acesso Imediato
Após a confirmação do plano, você recebe seus dados de acesso em poucos minutos. Tudo prático, rápido e sem burocracia.

📍 Estamos localizados no Brasil e atendemos clientes em todo o território nacional, com um serviço confiável, acessível e suporte técnico sempre disponível.

💬 Mais do que uma assinatura, oferecemos uma nova forma de assistir TV.
Seja bem-vindo(a) à revolução do entretenimento com a IPTV Pro.`}
            </Box>
        </Container>
    );
};

export default About;
