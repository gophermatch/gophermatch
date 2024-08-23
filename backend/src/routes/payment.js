import { stripeSecretKey } from '../env.js';
import { Router } from 'express';
import { createErrorObj } from './routeutil.js'
import Stripe from 'stripe'
const router = Router()

const stripe = Stripe(stripeSecretKey); // Use the imported secret key

// TODO: Unused, delete or no?

// Assuming you're using Express
router.post('/create-payment-intent', async (req, res) => {
    try {
      const { amount } = req.body; // Amount should be in cents
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        // You can add more options here as needed
      });
  
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  });

  export default router
  