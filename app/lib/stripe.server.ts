/**
 * Stripe integration for payment processing
 */

import Stripe from 'stripe';
import { getStripeConfig, hasStripe, getAppConfig } from './env.server';

let stripeClient: Stripe | null = null;

function getStripe(): Stripe | null {
  if (stripeClient) return stripeClient;
  
  const config = getStripeConfig();
  if (!config.secretKey) return null;
  
  stripeClient = new Stripe(config.secretKey, {
    apiVersion: '2024-12-18.acacia',
  });
  
  return stripeClient;
}

export interface CreateCheckoutParams {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  productName: string;
  amount: number; // in cents
  successUrl?: string;
  cancelUrl?: string;
}

/**
 * Create a Stripe Checkout Session
 */
export async function createCheckoutSession(params: CreateCheckoutParams): Promise<{
  success: boolean;
  sessionId?: string;
  url?: string;
  error?: string;
}> {
  const stripe = getStripe();
  const appConfig = getAppConfig();
  
  if (!stripe) {
    // Demo mode - simulate successful checkout
    return {
      success: true,
      sessionId: `demo_session_${Date.now()}`,
      url: `${appConfig.url}/commander/confirmation/${params.orderId}?demo=true`,
    };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: params.customerEmail,
      client_reference_id: params.orderId,
      metadata: {
        order_id: params.orderId,
        order_number: params.orderNumber,
      },
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: params.productName,
              description: `Commande ${params.orderNumber}`,
            },
            unit_amount: params.amount,
          },
          quantity: 1,
        },
      ],
      success_url: params.successUrl || `${appConfig.url}/commander/confirmation/${params.orderId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: params.cancelUrl || `${appConfig.url}/commander/paiement?cancelled=true`,
    });

    return {
      success: true,
      sessionId: session.id,
      url: session.url || undefined,
    };
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur de paiement',
    };
  }
}

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event | null {
  const stripe = getStripe();
  const config = getStripeConfig();
  
  if (!stripe || !config.webhookSecret) {
    return null;
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, config.webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return null;
  }
}

/**
 * Retrieve a checkout session
 */
export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session | null> {
  const stripe = getStripe();
  if (!stripe) return null;

  try {
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return null;
  }
}

/**
 * Get Stripe public key for frontend
 */
export function getStripePublicKey(): string {
  return getStripeConfig().publicKey;
}

