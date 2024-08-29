import React from 'react';
import backend from '../../backend.js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_live_51P1b6CFeM20IjPbpMSmzRkg8L6nQ9ZlrB3IWyI5fZgILdiXbQmMHwSwJkj74xakb1UEk9R8JxrTChbwgp6ygbpFK00pTmfIGgF');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      // Use your backend module to call the create-payment-intent route
      const { data } = await backend.post('/payment/create-payment-intent', {
        amount: 1000, // Example amount in cents
      });

      const clientSecret = data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        // Handle errors in payment submission here
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          // Handle successful payment here
        }
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle backend or network errors here
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>Pay</button>
    </form>
  );
};

const PaymentPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default PaymentPage;
