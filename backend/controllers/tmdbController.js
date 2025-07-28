const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Fetch popular movies from TMDb
const fetchPopularMovies = async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'pt-BR',
        page: 1,
      },
    });
    res.json({ success: true, data: response.data.results });
  } catch (error) {
    console.error('Erro ao buscar filmes populares TMDb:', error);
    res.status(500).json({ success: false, error: 'Erro ao buscar filmes populares' });
  }
};

// Fetch movie details by TMDb ID
const fetchMovieDetails = async (req, res) => {
  const { tmdbId } = req.params;
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${tmdbId}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'pt-BR',
      },
    });
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Erro ao buscar detalhes do filme TMDb:', error);
    res.status(500).json({ success: false, error: 'Erro ao buscar detalhes do filme' });
  }
};

module.exports = {
  fetchPopularMovies,
  fetchMovieDetails,
};
