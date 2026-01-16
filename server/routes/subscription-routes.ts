import express, { NextFunction, Request, Response } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import Stripe from 'stripe';
import { AuthenticatedRequest } from '../types/index.js';
import { ApiError } from '../common/error.js';
import logger from '../config/logger.js';
import UserService from '../services/user-service.js';

const subscriptionRouter = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const userService = new UserService(stripe);

/**
 * Creates a Stripe Checkout Session for subscription
 *
 * Price ID Explanation:
 * - A Price ID (e.g., "price_1234567890abcdef") is a unique identifier for a Stripe Price
 * - Prices define: amount, currency, and billing interval (monthly, yearly, etc.)
 * - You create Prices in the Stripe Dashboard or via API, linked to Products
 */
subscriptionRouter.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Get user from authenticated request (set by requireAuth middleware)
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError('Unauthorized', 401);
    }

    const account = await stripe.accounts.retrieve();
    console.log({
      id: account.id,
      email: account.email,
      country: account.country,
      charges_enabled: account.charges_enabled,
    });

    // Get or create Stripe customer
    let customerId = req.user?.stripe_customer_id;

    if (!customerId) {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: req.user?.email,
        metadata: {
          userId: userId,
        },
      });
      customerId = customer.id;

      // Save customer ID to user
      await userService.updateUserSubscription(userId, {
        stripe_customer_id: customerId,
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      billing_address_collection: 'auto',
      line_items: [
        {
          price: process.env.STRIPE_PREMIUM_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_DOMAIN}/cancel`,
      metadata: {
        userId: userId,
      },
    });

    if (!session.url) {
      throw new ApiError('Failed to create checkout session', 500);
    }

    res.json({ url: session.url });
  } catch (error: any) {
    logger.error('Stripe checkout session error:', error);
    next(error);
  }
});

/**
 * Stripe Webhook Handler Function
 * Handles subscription events: created, updated, deleted
 * 
 * IMPORTANT: This endpoint must use express.raw() middleware to verify webhook signatures
 * The webhook secret should be set in STRIPE_WEBHOOK_SECRET environment variable
 * Note: The raw middleware is applied in server/index.ts before express.json()
 */
subscriptionRouter.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response, next: NextFunction) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    logger.error('STRIPE_WEBHOOK_SECRET is not set');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    logger.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await userService.handleCheckoutSessionCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await userService.handleSubscriptionCreatedOrUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await userService.handleSubscriptionDeleted(subscription);
        break;
      }

      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (error: any) {
    logger.error('Error processing webhook event:', error);
    next(error);
  }
});

export default subscriptionRouter;
