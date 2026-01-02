/**
 * Email service using Resend
 */

import { getEmailConfig, hasEmail, getAppConfig } from './env.server';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Send an email via Resend API
 */
async function sendEmail(params: SendEmailParams): Promise<EmailResult> {
  const config = getEmailConfig();
  
  if (!config.apiKey) {
    console.log('[Email Demo Mode]', params.subject, 'to:', params.to);
    return { success: true, id: `demo_${Date.now()}` };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: config.from,
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Email send error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur d\'envoi' 
    };
  }
}

// ============================================
// EMAIL TEMPLATES
// ============================================

const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FastFabric</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f7; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .logo { text-align: center; margin-bottom: 24px; }
    .logo-text { font-size: 24px; font-weight: 800; color: #1d1d1f; }
    h1 { color: #1d1d1f; font-size: 24px; margin: 0 0 16px; }
    p { color: #424245; line-height: 1.6; margin: 0 0 16px; }
    .button { display: inline-block; background: #0071e3; color: white !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin: 16px 0; }
    .button:hover { background: #0077ED; }
    .info-box { background: #f5f5f7; border-radius: 12px; padding: 16px; margin: 16px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e5e7; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #86868b; }
    .info-value { color: #1d1d1f; font-weight: 600; }
    .footer { text-align: center; margin-top: 32px; color: #86868b; font-size: 14px; }
    .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 500; }
    .status-new { background: #e3f2fd; color: #1976d2; }
    .status-progress { background: #f3e5f5; color: #7b1fa2; }
    .status-review { background: #fff3e0; color: #f57c00; }
    .status-complete { background: #e8f5e9; color: #388e3c; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">
        <span class="logo-text">⚡ FastFabric</span>
      </div>
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} FastFabric. Tous droits réservés.</p>
      <p>Sites web sur mesure en 2 heures.</p>
    </div>
  </div>
</body>
</html>
`;

// ============================================
// EMAIL SENDERS
// ============================================

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  projectName: string;
  offerName: string;
  amount: number;
  trackingUrl: string;
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(data: OrderEmailData): Promise<EmailResult> {
  const content = `
    <h1>Merci pour votre commande ! 🎉</h1>
    <p>Bonjour ${data.customerName},</p>
    <p>Votre commande a bien été reçue et notre équipe se met au travail immédiatement.</p>
    
    <div class="info-box">
      <div class="info-row">
        <span class="info-label">N° de commande</span>
        <span class="info-value">${data.orderNumber}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Projet</span>
        <span class="info-value">${data.projectName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Offre</span>
        <span class="info-value">${data.offerName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Montant TTC</span>
        <span class="info-value">${data.amount}€</span>
      </div>
    </div>
    
    <p>Vous pouvez suivre l'avancement de votre projet à tout moment :</p>
    <p style="text-align: center;">
      <a href="${data.trackingUrl}" class="button">Suivre ma commande</a>
    </p>
    
    <p>À très vite !</p>
    <p><strong>L'équipe FastFabric</strong></p>
  `;

  return sendEmail({
    to: data.customerEmail,
    subject: `✅ Commande ${data.orderNumber} confirmée - FastFabric`,
    html: baseTemplate(content),
  });
}

/**
 * Send quote request confirmation
 */
export async function sendQuoteConfirmation(data: Omit<OrderEmailData, 'amount'>): Promise<EmailResult> {
  const content = `
    <h1>Demande de devis reçue ! 📋</h1>
    <p>Bonjour ${data.customerName},</p>
    <p>Nous avons bien reçu votre demande de devis et nous l'étudions avec attention.</p>
    
    <div class="info-box">
      <div class="info-row">
        <span class="info-label">Référence</span>
        <span class="info-value">${data.orderNumber}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Projet</span>
        <span class="info-value">${data.projectName}</span>
      </div>
    </div>
    
    <p><strong>Prochaine étape :</strong> Notre équipe analyse vos besoins et vous enverra un devis personnalisé sous 24h maximum.</p>
    
    <p>Vous pouvez suivre l'état de votre demande :</p>
    <p style="text-align: center;">
      <a href="${data.trackingUrl}" class="button">Voir ma demande</a>
    </p>
    
    <p>À très vite !</p>
    <p><strong>L'équipe FastFabric</strong></p>
  `;

  return sendEmail({
    to: data.customerEmail,
    subject: `📋 Demande de devis ${data.orderNumber} - FastFabric`,
    html: baseTemplate(content),
  });
}

interface StatusUpdateData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  projectName: string;
  newStatus: string;
  statusLabel: string;
  trackingUrl: string;
  message?: string;
}

/**
 * Send status update email
 */
export async function sendStatusUpdate(data: StatusUpdateData): Promise<EmailResult> {
  const statusColors: Record<string, string> = {
    in_progress: 'status-progress',
    review: 'status-review',
    completed: 'status-complete',
  };

  const statusEmojis: Record<string, string> = {
    in_progress: '🚀',
    review: '👀',
    completed: '✅',
  };

  const content = `
    <h1>Mise à jour de votre commande ${statusEmojis[data.newStatus] || '📢'}</h1>
    <p>Bonjour ${data.customerName},</p>
    
    <p>Le statut de votre projet <strong>${data.projectName}</strong> a été mis à jour :</p>
    
    <p style="text-align: center; margin: 24px 0;">
      <span class="status ${statusColors[data.newStatus] || 'status-new'}">${data.statusLabel}</span>
    </p>
    
    ${data.message ? `<p>${data.message}</p>` : ''}
    
    <p style="text-align: center;">
      <a href="${data.trackingUrl}" class="button">Voir les détails</a>
    </p>
    
    <p>À très vite !</p>
    <p><strong>L'équipe FastFabric</strong></p>
  `;

  return sendEmail({
    to: data.customerEmail,
    subject: `${statusEmojis[data.newStatus] || '📢'} ${data.statusLabel} - Commande ${data.orderNumber}`,
    html: baseTemplate(content),
  });
}

/**
 * Send project delivered email
 */
export async function sendProjectDelivered(data: OrderEmailData & { deliveryUrl?: string }): Promise<EmailResult> {
  const content = `
    <h1>Votre site est prêt ! 🎉</h1>
    <p>Bonjour ${data.customerName},</p>
    
    <p>Excellente nouvelle ! Votre projet <strong>${data.projectName}</strong> est terminé et prêt à être livré.</p>
    
    ${data.deliveryUrl ? `
    <p style="text-align: center;">
      <a href="${data.deliveryUrl}" class="button">Voir mon site</a>
    </p>
    ` : ''}
    
    <p>Vous pouvez accéder à tous les détails et fichiers depuis votre espace de suivi :</p>
    <p style="text-align: center;">
      <a href="${data.trackingUrl}" class="button">Accéder à ma commande</a>
    </p>
    
    <div class="info-box">
      <p style="margin: 0;"><strong>💡 Besoin de modifications ?</strong></p>
      <p style="margin: 8px 0 0;">Vous pouvez demander des révisions directement depuis votre espace de suivi.</p>
    </div>
    
    <p>Merci de votre confiance !</p>
    <p><strong>L'équipe FastFabric</strong></p>
  `;

  return sendEmail({
    to: data.customerEmail,
    subject: `🎉 Votre site est prêt ! - Commande ${data.orderNumber}`,
    html: baseTemplate(content),
  });
}

/**
 * Send admin notification for new order
 */
export async function sendAdminNewOrderNotification(data: OrderEmailData): Promise<EmailResult> {
  const config = getEmailConfig();
  const appConfig = getAppConfig();
  
  const content = `
    <h1>Nouvelle commande ! 🔔</h1>
    
    <div class="info-box">
      <div class="info-row">
        <span class="info-label">N° de commande</span>
        <span class="info-value">${data.orderNumber}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Client</span>
        <span class="info-value">${data.customerName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Email</span>
        <span class="info-value">${data.customerEmail}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Projet</span>
        <span class="info-value">${data.projectName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Offre</span>
        <span class="info-value">${data.offerName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Montant TTC</span>
        <span class="info-value">${data.amount}€</span>
      </div>
    </div>
    
    <p style="text-align: center;">
      <a href="${appConfig.url}/admin/commandes" class="button">Voir dans le backoffice</a>
    </p>
  `;

  return sendEmail({
    to: config.adminEmail,
    subject: `🔔 Nouvelle commande ${data.orderNumber} - ${data.amount}€`,
    html: baseTemplate(content),
  });
}

/**
 * Send revision request notification to admin
 */
export async function sendRevisionRequestNotification(data: {
  orderNumber: string;
  customerName: string;
  projectName: string;
  feedback: string;
}): Promise<EmailResult> {
  const config = getEmailConfig();
  const appConfig = getAppConfig();
  
  const content = `
    <h1>Demande de révision 🔄</h1>
    
    <div class="info-box">
      <div class="info-row">
        <span class="info-label">Commande</span>
        <span class="info-value">${data.orderNumber}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Client</span>
        <span class="info-value">${data.customerName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Projet</span>
        <span class="info-value">${data.projectName}</span>
      </div>
    </div>
    
    <p><strong>Feedback du client :</strong></p>
    <div class="info-box">
      <p style="margin: 0; white-space: pre-wrap;">${data.feedback}</p>
    </div>
    
    <p style="text-align: center;">
      <a href="${appConfig.url}/admin/commandes" class="button">Traiter la révision</a>
    </p>
  `;

  return sendEmail({
    to: config.adminEmail,
    subject: `🔄 Révision demandée - ${data.orderNumber}`,
    html: baseTemplate(content),
  });
}


