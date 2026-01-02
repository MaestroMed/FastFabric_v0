/**
 * Invoice generation service
 * Generates PDF invoices for completed orders
 */

import { getAppConfig } from './env.server';
import type { Order, Offer } from './supabase.server';

interface InvoiceData {
  order: Order;
  offer: Offer;
  invoiceNumber: string;
}

/**
 * Generate a unique invoice number
 */
export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FF-${year}${month}-${random}`;
}

/**
 * Calculate invoice amounts
 */
export function calculateInvoiceAmounts(amountTTC: number) {
  const tvaRate = 0.20; // 20% TVA
  const amountHT = amountTTC / (1 + tvaRate);
  const amountTVA = amountTTC - amountHT;
  
  return {
    amountHT: Math.round(amountHT * 100) / 100,
    amountTVA: Math.round(amountTVA * 100) / 100,
    amountTTC: amountTTC,
    tvaRate: tvaRate * 100,
  };
}

/**
 * Generate invoice HTML (can be converted to PDF using a service like Puppeteer, wkhtmltopdf, etc.)
 */
export function generateInvoiceHTML(data: InvoiceData): string {
  const { order, offer, invoiceNumber } = data;
  const amounts = calculateInvoiceAmounts(order.amount_ttc);
  const invoiceDate = new Date().toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Facture ${invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1d1d1f; line-height: 1.5; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
    .logo { font-size: 28px; font-weight: 800; }
    .logo span { margin-right: 8px; }
    .invoice-info { text-align: right; }
    .invoice-number { font-size: 24px; font-weight: 700; color: #0071e3; }
    .invoice-date { color: #86868b; margin-top: 4px; }
    .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
    .party h3 { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #86868b; margin-bottom: 12px; }
    .party p { margin-bottom: 4px; }
    .party strong { font-weight: 600; }
    .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    .table th { text-align: left; padding: 12px; background: #f5f5f7; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e5e5e7; }
    .table td { padding: 16px 12px; border-bottom: 1px solid #e5e5e7; }
    .table .amount { text-align: right; }
    .table .description { color: #86868b; font-size: 14px; margin-top: 4px; }
    .totals { margin-left: auto; width: 280px; }
    .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .totals-row.total { font-size: 18px; font-weight: 700; border-top: 2px solid #1d1d1f; padding-top: 12px; margin-top: 8px; }
    .totals-row .label { color: #86868b; }
    .totals-row.total .label { color: #1d1d1f; }
    .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e5e5e7; font-size: 12px; color: #86868b; }
    .footer p { margin-bottom: 4px; }
    .payment-info { background: #f5f5f7; padding: 20px; border-radius: 12px; margin-top: 30px; }
    .payment-info h4 { font-size: 14px; font-weight: 600; margin-bottom: 8px; }
    .paid-stamp { color: #22c55e; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">
      <span>⚡</span>FastFabric
    </div>
    <div class="invoice-info">
      <div class="invoice-number">${invoiceNumber}</div>
      <div class="invoice-date">${invoiceDate}</div>
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <h3>Vendeur</h3>
      <p><strong>FastFabric SAS</strong></p>
      <p>[Adresse à compléter]</p>
      <p>SIRET : [Numéro à compléter]</p>
      <p>TVA : [Numéro à compléter]</p>
    </div>
    <div class="party">
      <h3>Client</h3>
      <p><strong>${order.customer.firstName} ${order.customer.lastName}</strong></p>
      ${order.customer.company ? `<p>${order.customer.company}</p>` : ''}
      <p>${order.customer.email}</p>
      ${order.customer.phone ? `<p>${order.customer.phone}</p>` : ''}
    </div>
  </div>

  <table class="table">
    <thead>
      <tr>
        <th>Description</th>
        <th>Quantité</th>
        <th class="amount">Prix unitaire HT</th>
        <th class="amount">Total HT</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <strong>${offer.name}</strong>
          <div class="description">
            Projet : ${order.project_details.name}<br>
            Pages : ${order.selected_pages?.join(', ') || '-'}
          </div>
        </td>
        <td>1</td>
        <td class="amount">${amounts.amountHT.toFixed(2)} €</td>
        <td class="amount">${amounts.amountHT.toFixed(2)} €</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <span class="label">Total HT</span>
      <span>${amounts.amountHT.toFixed(2)} €</span>
    </div>
    <div class="totals-row">
      <span class="label">TVA (${amounts.tvaRate}%)</span>
      <span>${amounts.amountTVA.toFixed(2)} €</span>
    </div>
    <div class="totals-row total">
      <span class="label">Total TTC</span>
      <span>${amounts.amountTTC.toFixed(2)} €</span>
    </div>
  </div>

  <div class="payment-info">
    <h4>Informations de paiement</h4>
    <p>Commande n° : ${order.order_number}</p>
    <p>Paiement par carte bancaire</p>
    <p class="paid-stamp" style="margin-top: 10px;">✓ Payé</p>
  </div>

  <div class="footer">
    <p>FastFabric SAS — Capital social : [Montant] € — RCS : [Ville et numéro]</p>
    <p>Sites web sur mesure en 2 heures — contact@fastfabric.fr</p>
    <p style="margin-top: 12px; font-style: italic;">
      En cas de retard de paiement, une pénalité de 3 fois le taux d'intérêt légal sera exigible, 
      ainsi qu'une indemnité forfaitaire pour frais de recouvrement de 40 euros (Art. L.441-10 du Code de commerce).
    </p>
  </div>
</body>
</html>
  `;
}

/**
 * Create invoice record and return data
 * In production, this would generate a PDF and store it
 */
export async function createInvoice(order: Order, offer: Offer): Promise<{
  invoiceNumber: string;
  html: string;
  amounts: ReturnType<typeof calculateInvoiceAmounts>;
}> {
  const invoiceNumber = generateInvoiceNumber();
  const amounts = calculateInvoiceAmounts(order.amount_ttc);
  const html = generateInvoiceHTML({ order, offer, invoiceNumber });

  // In production:
  // 1. Convert HTML to PDF using puppeteer or similar
  // 2. Upload PDF to Supabase Storage
  // 3. Save invoice record to database
  // 4. Return the PDF URL

  return {
    invoiceNumber,
    html,
    amounts,
  };
}


