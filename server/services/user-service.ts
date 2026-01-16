import { UserModel } from "../models/user-model.js";
import { User, Tier } from "../types/index.js";
import Stripe from "stripe";
import logger from "../config/logger.js";

class UserService {
  private userModel: UserModel;
  private stripe: Stripe;

  constructor(stripe?: Stripe) {
    this.userModel = new UserModel();
    // Use provided Stripe instance or create a new one
    this.stripe = stripe || new Stripe(process.env.STRIPE_SECRET_KEY!);
  }

  async createUser(data: User): Promise<User> {
    return this.userModel.createUser(data);
  }

  async getUser(id: string): Promise<User | null> {
    return this.userModel.getUser(id);
  }

  async updateUserSubscription(
    userId: string,
    updates: {
      tier?: string;
      stripe_customer_id?: string | null;
      stripe_subscription_id?: string | null;
      stripe_subscription_status?: string | null;
    }
  ): Promise<User | null> {
    return this.userModel.updateUserSubscription(userId, updates);
  }

  async getUserByStripeCustomerId(customerId: string): Promise<User | null> {
    return this.userModel.getUserByStripeCustomerId(customerId);
  }

  /**
   * Handle checkout session completed
   * This is called when a user completes the checkout process
   */
  async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    if (!customerId || !subscriptionId) {
      logger.warn('Checkout session completed but missing customer or subscription ID', {
        sessionId: session.id,
      });
      return;
    }

    // Find user by customer ID
    const user = await this.getUserByStripeCustomerId(customerId);
    if (!user) {
      logger.warn('User not found for customer ID:', customerId);
      return;
    }

    // Get subscription details from Stripe
    const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);

    // Update user with subscription info
    await this.updateUserSubscription(user.id, {
      tier: Tier.PREMIUM,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      stripe_subscription_status: subscription.status,
    });

    logger.info('User subscription activated', {
      userId: user.id,
      subscriptionId,
      status: subscription.status,
    });
  }

  /**
   * Handle subscription created or updated
   */
  async handleSubscriptionCreatedOrUpdated(subscription: Stripe.Subscription): Promise<void> {
    const customerId = subscription.customer as string;
    const subscriptionId = subscription.id;

    if (!customerId) {
      logger.warn('Subscription event missing customer ID', { subscriptionId });
      return;
    }

    // Find user by customer ID
    const user = await this.getUserByStripeCustomerId(customerId);
    if (!user) {
      logger.warn('User not found for customer ID:', customerId);
      return;
    }

    // Determine tier based on subscription status
    const isActive = ['active', 'trialing'].includes(subscription.status);
    const tier = isActive ? Tier.PREMIUM : Tier.FREE;

    // Update user with subscription info
    await this.updateUserSubscription(user.id, {
      tier,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      stripe_subscription_status: subscription.status,
    });

    logger.info('User subscription updated', {
      userId: user.id,
      subscriptionId,
      status: subscription.status,
      tier,
    });
  }

  /**
   * Handle subscription deleted (cancelled)
   */
  async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    const customerId = subscription.customer as string;
    const subscriptionId = subscription.id;

    if (!customerId) {
      logger.warn('Subscription deletion event missing customer ID', { subscriptionId });
      return;
    }

    // Find user by customer ID
    const user = await this.getUserByStripeCustomerId(customerId);
    if (!user) {
      logger.warn('User not found for customer ID:', customerId);
      return;
    }

    // Update user to free tier
    await this.updateUserSubscription(user.id, {
      tier: Tier.FREE,
      stripe_subscription_id: null,
      stripe_subscription_status: 'canceled',
      // Keep customer_id in case they want to resubscribe
    });

    logger.info('User subscription cancelled', {
      userId: user.id,
      subscriptionId,
    });
  }
}

export default UserService;

