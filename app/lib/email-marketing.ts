/**
 * Email Marketing Integration - Brevo (ex-Sendinblue)
 * 
 * Configuration:
 * 1. Create a Brevo account at https://www.brevo.com (gratuit jusqu'à 300 emails/jour)
 * 2. Get your API key from Settings > API Keys
 * 3. Replace BREVO_API_KEY in your environment variables
 * 
 * Email Sequences:
 * - Abandon de formulaire: J+1, J+3, J+7
 * - Post-commande: confirmation, suivi, demande d'avis
 * - Newsletter mensuelle: nouveaux articles, promotions
 */

// Types
export interface EmailContact {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  attributes?: Record<string, string | number | boolean>;
}

export interface EmailCampaign {
  templateId: number;
  subject: string;
  to: EmailContact[];
  params?: Record<string, string | number>;
}

// Brevo API configuration
const BREVO_CONFIG = {
  apiKey: import.meta.env.VITE_BREVO_API_KEY || 'YOUR_BREVO_API_KEY',
  baseUrl: 'https://api.brevo.com/v3',
  senderEmail: 'contact@fastfabric.fr',
  senderName: 'FastFabric',
};

// Email template IDs (to be configured in Brevo dashboard)
export const EMAIL_TEMPLATES = {
  // Abandon de formulaire
  ABANDON_J1: 1, // "Vous n'avez pas terminé votre commande"
  ABANDON_J3: 2, // "Votre projet web vous attend"
  ABANDON_J7: 3, // "Dernière chance : -10% sur votre site"
  
  // Post-commande
  ORDER_CONFIRMATION: 4, // "Commande confirmée - on se met au travail !"
  ORDER_IN_PROGRESS: 5, // "Votre site est en cours de création"
  ORDER_DELIVERED: 6, // "Votre site est prêt ! 🎉"
  ORDER_REVIEW_REQUEST: 7, // "Votre avis compte - 1 minute pour nous noter"
  
  // Newsletter
  NEWSLETTER_MONTHLY: 8, // Newsletter mensuelle
  WELCOME: 9, // Email de bienvenue
};

// Brevo list IDs (to be configured in Brevo dashboard)
export const EMAIL_LISTS = {
  PROSPECTS: 1, // Visiteurs qui ont donné leur email
  CLIENTS: 2, // Clients ayant commandé
  NEWSLETTER: 3, // Inscrits à la newsletter
  ABANDONED_CART: 4, // Abandon de formulaire
};

/**
 * Add a contact to Brevo
 */
export async function addContact(contact: EmailContact, listIds: number[] = []): Promise<boolean> {
  if (BREVO_CONFIG.apiKey === 'YOUR_BREVO_API_KEY') {
    console.log('[Brevo] API key not configured. Contact would be added:', contact);
    return true;
  }

  try {
    const response = await fetch(`${BREVO_CONFIG.baseUrl}/contacts`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_CONFIG.apiKey,
      },
      body: JSON.stringify({
        email: contact.email,
        attributes: {
          FIRSTNAME: contact.firstName || '',
          LASTNAME: contact.lastName || '',
          PHONE: contact.phone || '',
          ...contact.attributes,
        },
        listIds: listIds.length > 0 ? listIds : [EMAIL_LISTS.PROSPECTS],
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[Brevo] Error adding contact:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Brevo] Error:', error);
    return false;
  }
}

/**
 * Send a transactional email
 */
export async function sendTransactionalEmail(
  templateId: number,
  to: EmailContact,
  params: Record<string, string | number> = {}
): Promise<boolean> {
  if (BREVO_CONFIG.apiKey === 'YOUR_BREVO_API_KEY') {
    console.log('[Brevo] API key not configured. Email would be sent:', { templateId, to, params });
    return true;
  }

  try {
    const response = await fetch(`${BREVO_CONFIG.baseUrl}/smtp/email`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_CONFIG.apiKey,
      },
      body: JSON.stringify({
        templateId,
        to: [{ email: to.email, name: to.firstName || to.email }],
        params: {
          FIRSTNAME: to.firstName || 'Client',
          ...params,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[Brevo] Error sending email:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Brevo] Error:', error);
    return false;
  }
}

/**
 * Schedule abandon cart emails
 */
export async function scheduleAbandonEmails(contact: EmailContact): Promise<void> {
  // Add to abandoned cart list
  await addContact(contact, [EMAIL_LISTS.ABANDONED_CART]);
  
  // Store scheduling info in localStorage for demo
  // In production, this would be handled by Brevo automation
  const abandonedCarts = JSON.parse(localStorage.getItem('fastfabric_abandoned_carts') || '[]');
  abandonedCarts.push({
    email: contact.email,
    firstName: contact.firstName,
    abandonedAt: new Date().toISOString(),
    emailsSent: [],
  });
  localStorage.setItem('fastfabric_abandoned_carts', JSON.stringify(abandonedCarts));
  
  console.log('[Brevo] Abandon cart sequence scheduled for:', contact.email);
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(
  contact: EmailContact,
  orderDetails: {
    orderNumber: string;
    serviceName: string;
    amount: number;
    estimatedDelivery: string;
  }
): Promise<boolean> {
  // Move from prospects to clients list
  await addContact(contact, [EMAIL_LISTS.CLIENTS]);
  
  // Remove from abandoned cart list (if was there)
  // In production, this is handled by Brevo automation
  
  return sendTransactionalEmail(EMAIL_TEMPLATES.ORDER_CONFIRMATION, contact, {
    ORDER_NUMBER: orderDetails.orderNumber,
    SERVICE_NAME: orderDetails.serviceName,
    AMOUNT: orderDetails.amount,
    ESTIMATED_DELIVERY: orderDetails.estimatedDelivery,
  });
}

/**
 * Send order delivered email
 */
export async function sendOrderDelivered(
  contact: EmailContact,
  orderDetails: {
    orderNumber: string;
    serviceName: string;
    siteUrl?: string;
  }
): Promise<boolean> {
  return sendTransactionalEmail(EMAIL_TEMPLATES.ORDER_DELIVERED, contact, {
    ORDER_NUMBER: orderDetails.orderNumber,
    SERVICE_NAME: orderDetails.serviceName,
    SITE_URL: orderDetails.siteUrl || '',
  });
}

/**
 * Send review request email (7 days after delivery)
 */
export async function sendReviewRequest(contact: EmailContact): Promise<boolean> {
  return sendTransactionalEmail(EMAIL_TEMPLATES.ORDER_REVIEW_REQUEST, contact, {
    REVIEW_URL: 'https://g.page/r/fastfabric/review', // Replace with actual Google review link
  });
}

/**
 * Subscribe to newsletter
 */
export async function subscribeNewsletter(email: string, firstName?: string): Promise<boolean> {
  const success = await addContact(
    { email, firstName },
    [EMAIL_LISTS.NEWSLETTER]
  );
  
  if (success) {
    // Send welcome email
    await sendTransactionalEmail(EMAIL_TEMPLATES.WELCOME, { email, firstName });
  }
  
  return success;
}

/**
 * Track form abandonment (client-side)
 */
export function trackFormAbandonment(): void {
  if (typeof window === 'undefined') return;
  
  // Check if user started but didn't complete the order form
  const formData = sessionStorage.getItem('fastfabric_order_form');
  if (!formData) return;
  
  const data = JSON.parse(formData);
  if (data.email && !data.completed) {
    // Schedule abandon emails
    scheduleAbandonEmails({
      email: data.email,
      firstName: data.name,
    });
  }
}

/**
 * Save form progress (for abandon tracking)
 */
export function saveFormProgress(data: {
  email?: string;
  name?: string;
  phone?: string;
  step: number;
  completed: boolean;
}): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('fastfabric_order_form', JSON.stringify({
    ...data,
    lastUpdated: new Date().toISOString(),
  }));
}

/**
 * Clear form progress (after successful order)
 */
export function clearFormProgress(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('fastfabric_order_form');
}

// Email template examples for Brevo (HTML)
export const EMAIL_TEMPLATE_EXAMPLES = {
  abandonJ1: `
    <h1>Bonjour {{params.FIRSTNAME}} !</h1>
    <p>Vous avez commencé à créer votre site web avec FastFabric mais n'avez pas terminé votre commande.</p>
    <p>Votre projet vous attend :</p>
    <ul>
      <li>Livraison en 2 heures</li>
      <li>Design sur mesure</li>
      <li>À partir de 299€</li>
    </ul>
    <a href="https://fastfabric.fr/commander">Reprendre ma commande</a>
  `,
  
  orderConfirmation: `
    <h1>Merci pour votre commande, {{params.FIRSTNAME}} ! 🎉</h1>
    <p>Votre commande n°{{params.ORDER_NUMBER}} a bien été reçue.</p>
    <p><strong>Récapitulatif :</strong></p>
    <ul>
      <li>Service : {{params.SERVICE_NAME}}</li>
      <li>Montant : {{params.AMOUNT}}€</li>
      <li>Livraison estimée : {{params.ESTIMATED_DELIVERY}}</li>
    </ul>
    <p>Notre équipe se met au travail immédiatement !</p>
    <a href="https://fastfabric.fr/suivi/{{params.ORDER_NUMBER}}">Suivre ma commande</a>
  `,
};

