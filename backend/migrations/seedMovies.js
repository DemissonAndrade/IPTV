const { query } = require('../config/database');

const seedMovies = async () => {
  try {
    const movies = [
      {
        titulo: 'Inception',
        descricao: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
        capa_url: 'https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg',
        tipo: 'filme',
        ano: 2010,
        duracao: 148,
        genero: 'Sci-Fi',
        stream_url: 'https://megafilmeshd.com.br/stream/inception.m3u8'
      },
      {
        titulo: 'The Matrix',
        descricao: 'A computer hacker learns about the true nature of his reality and his role in the war against its controllers.',
        capa_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        tipo: 'filme',
        ano: 1999,
        duracao: 136,
        genero: 'Action',
        stream_url: 'https://cineflixhd.com.br/stream/matrix.m3u8'
      },
      {
        titulo: 'Interstellar',
        descricao: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        capa_url: 'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
        tipo: 'filme',
        ano: 2014,
        duracao: 169,
        genero: 'Adventure',
        stream_url: 'https://iptvflix.com/stream/interstellar.m3u8'
      }
    ];

    for (const movie of movies) {
      await query(
        `INSERT INTO vod_content (titulo, descricao, capa_url, tipo, ano, duracao, genero, stream_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (titulo) DO UPDATE SET stream_url = EXCLUDED.stream_url`,
        [movie.titulo, movie.descricao, movie.capa_url, movie.tipo, movie.ano, movie.duracao, movie.genero, movie.stream_url]
      );
    }

    console.log('Seed de filmes atualizada com URLs reais com sucesso.');
  } catch (error) {
    console.error('Erro ao atualizar filmes:', error);
  }
};

seedMovies();
