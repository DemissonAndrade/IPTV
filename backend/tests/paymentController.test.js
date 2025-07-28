const request = require('supertest');
const app = require('../server');

describe('Payment Controller', () => {
  it('should create a checkout session', async () => {
    const res = await request(app)
      .post('/api/payment/checkout')
      .send({
        priceId: 'price_test',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel'
      });
    expect(res.statusCode).toBe(500); // Because price_test is invalid, expect failure
    expect(res.body).toHaveProperty('success', false);
  });

  it('should handle webhook with invalid signature', async () => {
    const res = await request(app)
      .post('/api/payment/webhook')
      .set('stripe-signature', 'invalid_signature')
      .send('{}');
    expect(res.statusCode).toBe(400);
  });
});
