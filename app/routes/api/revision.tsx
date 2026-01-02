import type { Route } from "./+types/revision";
import { localStore } from '~/lib/store';
import { sendRevisionRequestNotification } from '~/lib/email.server';

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const { orderId, feedback, zones } = body;

    if (!orderId || !feedback) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get order
    const order = localStore.getOrderById(orderId);
    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if revisions are allowed
    const offers = localStore.getOffers();
    const offer = offers.find(o => o.id === order.offer_id);
    const maxRevisions = offer?.max_revisions || 1;
    const revisionsUsed = order.revisions_used || 0;

    if (revisionsUsed >= maxRevisions) {
      return Response.json({ error: 'Maximum revisions reached' }, { status: 400 });
    }

    // Create revision
    const revision = localStore.createRevision(orderId, feedback, zones || []);

    // Send notification to admin
    await sendRevisionRequestNotification({
      orderNumber: order.order_number,
      customerName: `${order.customer.firstName} ${order.customer.lastName}`,
      projectName: order.project_details.name,
      feedback,
    });

    return Response.json({ 
      success: true, 
      revision,
      revisionsLeft: maxRevisions - revisionsUsed - 1,
    });
  } catch (error) {
    console.error('Revision creation error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export function loader() {
  return new Response('Method not allowed', { status: 405 });
}


