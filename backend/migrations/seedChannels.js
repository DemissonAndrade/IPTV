const { query } = require('../config/database');

const seedChannels = async () => {
  try {
    const channels = [
      // Example channels - replace with real open and closed channels data
      {
        nome: 'Canal Aberto 1',
        logo_url: 'https://example.com/logo1.png',
        qualidade: 'HD',
        categoria_id: 1,
        idioma: 'pt-BR',
        pais: 'BR',
        stream_url: 'https://streaming.example.com/canalaberto1.m3u8',
      },
      {
        nome: 'Canal Fechado 1',
        logo_url: 'https://example.com/logo2.png',
        qualidade: 'FHD',
        categoria_id: 2,
        idioma: 'pt-BR',
        pais: 'BR',
        stream_url: 'https://streaming.example.com/canalfechado1.m3u8',
      },
      // Add more channels as needed
    ];

    for (const channel of channels) {
      await query(
        `INSERT INTO canais (nome, logo_url, qualidade, categoria_id, idioma, pais, stream_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (nome) DO UPDATE SET
           logo_url = EXCLUDED.logo_url,
           qualidade = EXCLUDED.qualidade,
           categoria_id = EXCLUDED.categoria_id,
           idioma = EXCLUDED.idioma,
           pais = EXCLUDED.pais,
           stream_url = EXCLUDED.stream_url`,
        [
          channel.nome,
          channel.logo_url,
          channel.qualidade,
          channel.categoria_id,
          channel.idioma,
          channel.pais,
          channel.stream_url,
        ]
      );
    }

    console.log('Seed de canais atualizada com sucesso.');
  } catch (error) {
    console.error('Erro ao atualizar canais:', error);
  }
};

seedChannels();
