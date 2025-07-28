const express = require('express');
const { fetchPopularMovies, fetchMovieDetails } = require('../controllers/tmdbController');

const router = express.Router();

// Route to get popular movies from TMDb
router.get('/popular', fetchPopularMovies);

// Route to get movie details by TMDb ID
router.get('/movie/:tmdbId', fetchMovieDetails);

module.exports = router;
