const request = require('supertest');
const app = require('../server');

describe('Plans Routes', () => {
  it('should list all active plans', async () => {
    const res = await request(app).get('/api/plans');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should get plan by ID', async () => {
    // First get all plans to get a valid ID
    const allPlansRes = await request(app).get('/api/plans');
    const plans = allPlansRes.body.data;
    if (plans.length === 0) {
      return;
    }
    const planId = plans[0].id || plans[0]._id || plans[0].ID;
    const res = await request(app).get(`/api/plans/${planId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('id', planId);
  });
});
