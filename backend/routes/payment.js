const express = require('express');
const { createCheckoutSession, handleWebhook } = require('../controllers/paymentController');
const router = express.Router();

// Route to create Stripe checkout session
router.post('/checkout', createCheckoutSession);

// Stripe webhook endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
