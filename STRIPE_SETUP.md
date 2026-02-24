# Stripe Payment Integration Guide

This guide explains how to complete the Stripe payment integration for the Marital Desk application.

## Prerequisites

1. Stripe Account - Create one at [stripe.com](https://stripe.com)
2. Node.js and npm installed
3. The payment gateway is already integrated into the codebase

## Setup Instructions

### 1. Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. You'll find:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 2. Configure Environment Variables

Update the `.env` file in the server directory:

```env
STRIPE_SECRET_KEY="sk_test_your_actual_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_actual_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_test_your_webhook_secret"
CLIENT_URL="http://localhost:5173"  # Your React app URL
```

### 3. Restart the Server

```bash
npm run dev
```

### 4. Install Frontend Dependencies

The Stripe React packages are already installed:
- `@stripe/react-stripe-js`
- `@stripe/stripe-js`

## How It Works

### Payment Flow

1. **User initiates payment** → Clicks "Pay Now" on Payment.jsx
2. **Create Checkout Session** → Backend creates Stripe Checkout session
3. **Redirect to Stripe** → User fills card details on Stripe hosted page
4. **Payment Processing** → Stripe processes the payment
5. **Success/Cancel Redirect** → User redirected to success or cancel page
6. **Verify Payment** → Backend verifies the payment status

### API Endpoints

#### Create Checkout Session
```
POST /api/v1/marital-desk/marriage-applications/checkout
Content-Type: application/json
Authorization: Bearer {token}

{
    "price": 2500,
    "userName": "John Doe",
    "userEmail": "john@example.com"
}

Response:
{
    "url": "https://checkout.stripe.com/...",
    "sessionId": "cs_test_..."
}
```

#### Verify Payment Success
```
POST /api/v1/marital-desk/marriage-applications/payment-success
Content-Type: application/json
Authorization: Bearer {token}

{
    "sessionId": "cs_test_..."
}

Response:
{
    "success": true,
    "transactionId": "TXN-...",
    "customerEmail": "john@example.com",
    "amount": 2500,
    "paymentStatus": "paid"
}
```

#### Verify Payment Session
```
GET /api/v1/marital-desk/marriage-applications/payment/verify/{sessionId}
Authorization: Bearer {token}

Response:
{
    "sessionId": "cs_test_...",
    "paymentStatus": "paid",
    "customerEmail": "john@example.com",
    "amount": 2500
}
```

## Frontend Components

### Payment.jsx
- Displays payment details breakdown
- Shows total amount to be paid
- Initiates checkout session
- Handles errors gracefully

### PaymentSuccess.jsx
- Verifies payment with backend
- Generates PDF receipt
- Displays transaction details
- Provides download and navigation options

### PaymentCancel.jsx
- Informs user about cancellation
- No charges made
- Option to retry payment

## Important Notes

### Currency Handling
- Stripe primarily uses USD for testing
- Platform displays amounts in BDT (৳)
- Conversion done client-side for display purposes
- Backend handles amount in the smallest unit (cents for USD)

### Testing

Use Stripe's test cards:

| Card Number | Description |
|---|---|
| 4242 4242 4242 4242 | Successful charge |
| 4000 0000 0000 0002 | Card declined |
| 378282246310005 | American Express |

Use any future expiration date and any 3-digit CVC.

### Authentication

All payment endpoints require JWT authentication. Include the token in the `Authorization` header:
```
Authorization: Bearer {your_jwt_token}
```

## Troubleshooting

### Issue: "Invalid API Key"
- Check that `STRIPE_SECRET_KEY` is correctly set in `.env`
- Ensure you're using the secret key (starts with `sk_`), not the publishable key

### Issue: "Payment not completed"
- Verify session ID is being passed correctly
- Check that payment was completed on Stripe's hosted page
- Review Stripe Dashboard for payment status

### Issue: "CORS errors"
- Ensure `CLIENT_URL` is whitelisted in CORS settings if needed
- Check that the frontend and backend are on correct URLs

### Issue: "Redirect URLs not working"
- Verify `CLIENT_URL` in `.env` matches your actual frontend URL
- Check that routes exist for `/dashboard/marriage-applications/payment/success` and `/cancel`

## Production Considerations

1. **Use Live Keys**: Replace test keys with live keys when going to production
2. **HTTPS**: Ensure your application uses HTTPS
3. **PCI Compliance**: Store payment information securely; never store card data
4. **Webhooks**: Implement webhook handling for asynchronous payment events
5. **Error Handling**: Implement comprehensive error handling and logging
6. **Rate Limiting**: Consider rate limiting payment endpoints

## Documentation

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Testing Guide](https://stripe.com/docs/testing)

## Support

For issues with Stripe integration:
1. Check Stripe Dashboard for payment details
2. Review browser console for errors
3. Check server logs
4. Contact Stripe support if issues persist
