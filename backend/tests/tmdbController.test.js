const request = require('supertest');
const app = require('../server');

describe('TMDb Controller', () => {
  it('should fetch popular movies', async () => {
    const res = await request(app).get('/api/tmdb/popular');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should fetch movie details by tmdbId', async () => {
    const tmdbId = 550; // Example TMDb movie ID (Fight Club)
    const res = await request(app).get(`/api/tmdb/movie/${tmdbId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('id', tmdbId);
  });
});
