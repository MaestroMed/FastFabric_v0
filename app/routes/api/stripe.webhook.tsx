import type { Route } from "./+types/stripe.webhook";
import { verifyWebhookSignature } from '~/lib/stripe.server';
import { localStore } from '~/lib/store';
import { sendOrderConfirmation, sendAdminNewOrderNotification } from '~/lib/email.server';
import { getAppConfig } from '~/lib/env.server';

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  const payload = await request.text();
  const event = verifyWebhookSignature(payload, signature);

  if (!event) {
    // In demo mode, just acknowledge
    console.log('[Webhook Demo] Received webhook without verification');
    return new Response('OK (demo mode)', { status: 200 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const orderId = session.metadata?.order_id || session.client_reference_id;
        
        if (orderId) {
          // Update order status
          const order = localStore.updateOrder(orderId, {
            status: 'new',
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string,
            paid_at: new Date().toISOString(),
          });

          if (order) {
            const offers = localStore.getOffers();
            const offer = offers.find(o => o.id === order.offer_id);
            const appConfig = getAppConfig();

            // Send confirmation emails
            await sendOrderConfirmation({
              orderNumber: order.order_number,
              customerName: `${order.customer.firstName} ${order.customer.lastName}`,
              customerEmail: order.customer.email,
              projectName: order.project_details.name,
              offerName: offer?.name || 'Site web',
              amount: order.amount_ttc,
              trackingUrl: `${appConfig.url}/suivi/${order.order_number}`,
            });

            await sendAdminNewOrderNotification({
              orderNumber: order.order_number,
              customerName: `${order.customer.firstName} ${order.customer.lastName}`,
              customerEmail: order.customer.email,
              projectName: order.project_details.name,
              offerName: offer?.name || 'Site web',
              amount: order.amount_ttc,
              trackingUrl: `${appConfig.url}/suivi/${order.order_number}`,
            });
          }
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        const orderId = session.metadata?.order_id || session.client_reference_id;
        
        if (orderId) {
          // Mark order as cancelled
          localStore.updateOrder(orderId, { status: 'cancelled' });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response('Webhook handler failed', { status: 500 });
  }
}

export function loader() {
  return new Response('Method not allowed', { status: 405 });
}


