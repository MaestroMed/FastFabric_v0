import type { Route } from "./+types/stripe.create-checkout";
import { createCheckoutSession } from '~/lib/stripe.server';

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    
    const { orderId, orderNumber, customerEmail, customerName, productName, amount } = body;

    if (!orderId || !orderNumber || !customerEmail || !amount) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await createCheckoutSession({
      orderId,
      orderNumber,
      customerEmail,
      customerName: customerName || 'Client',
      productName: productName || 'Site web FastFabric',
      amount: Math.round(amount * 100), // Convert to cents
    });

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 500 });
    }

    return Response.json({
      sessionId: result.sessionId,
      url: result.url,
    });
  } catch (error) {
    console.error('Checkout creation error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export function loader() {
  return new Response('Method not allowed', { status: 405 });
}


