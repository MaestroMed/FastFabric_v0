import type { Route } from "./+types/cgv";
import { Header } from '~/components/layout/Header';
import { Footer } from '~/components/layout/Footer';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Conditions Générales de Vente — FastFabric" },
    { name: "description", content: "CGV de FastFabric - Sites web sur mesure en 2 heures" },
  ];
}

export default function CGV() {
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Conditions Générales de Vente</h1>
          
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 1 - Objet</h2>
              <p className="text-gray-600 mb-4">
                Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles 
                entre FastFabric et ses clients dans le cadre de la prestation de services de création 
                de sites web.
              </p>
              <p className="text-gray-600">
                Toute commande implique l'acceptation sans réserve des présentes CGV.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 2 - Services proposés</h2>
              <p className="text-gray-600 mb-4">
                FastFabric propose des services de création de sites web sur mesure, comprenant :
              </p>
              <ul className="text-gray-600 space-y-2 list-disc list-inside mb-4">
                <li>One Page : Landing page responsive avec formulaire de contact</li>
                <li>Site Vitrine : Site multi-pages complet avec animations</li>
                <li>Sur Mesure : Projet personnalisé selon les besoins du client</li>
              </ul>
              <p className="text-gray-600">
                Les caractéristiques détaillées de chaque offre sont précisées sur le site et dans 
                le récapitulatif de commande.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 3 - Prix</h2>
              <p className="text-gray-600 mb-4">
                Les prix sont indiqués en euros TTC (Toutes Taxes Comprises). FastFabric se réserve 
                le droit de modifier ses tarifs à tout moment. Les prestations seront facturées sur 
                la base des tarifs en vigueur au moment de la validation de la commande.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 4 - Commande et paiement</h2>
              <p className="text-gray-600 mb-4">
                La commande est validée après :
              </p>
              <ol className="text-gray-600 space-y-2 list-decimal list-inside mb-4">
                <li>Remplissage du formulaire de commande avec toutes les informations requises</li>
                <li>Validation du récapitulatif de commande</li>
                <li>Paiement intégral par carte bancaire via notre plateforme sécurisée Stripe</li>
              </ol>
              <p className="text-gray-600 mb-4">
                Pour les projets "Sur Mesure", un devis personnalisé est établi avant tout engagement.
              </p>
              <p className="text-gray-600">
                Un email de confirmation est envoyé au client dès la validation du paiement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 5 - Délais de livraison</h2>
              <p className="text-gray-600 mb-4">
                Les délais de livraison indicatifs sont :
              </p>
              <ul className="text-gray-600 space-y-2 list-disc list-inside mb-4">
                <li>One Page : 2 à 4 heures</li>
                <li>Site Vitrine : 4 à 8 heures</li>
                <li>Sur Mesure : selon devis</li>
              </ul>
              <p className="text-gray-600">
                Ces délais sont donnés à titre indicatif et supposent que le client ait fourni 
                l'ensemble des éléments nécessaires (textes, images, logo, etc.).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 6 - Révisions</h2>
              <p className="text-gray-600 mb-4">
                Chaque offre inclut un nombre de révisions :
              </p>
              <ul className="text-gray-600 space-y-2 list-disc list-inside mb-4">
                <li>One Page : 1 révision incluse</li>
                <li>Site Vitrine : 2 révisions incluses</li>
                <li>Sur Mesure : selon devis</li>
              </ul>
              <p className="text-gray-600">
                Des révisions supplémentaires peuvent être facturées selon un tarif communiqué au préalable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 7 - Droit de rétractation</h2>
              <p className="text-gray-600 mb-4">
                Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation 
                ne s'applique pas aux prestations de services pleinement exécutées avant la fin du 
                délai de rétractation et dont l'exécution a commencé après accord préalable exprès 
                du consommateur.
              </p>
              <p className="text-gray-600">
                En validant sa commande, le client accepte expressément que l'exécution de la prestation 
                commence immédiatement et renonce à son droit de rétractation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 8 - Propriété intellectuelle</h2>
              <p className="text-gray-600 mb-4">
                À la livraison finale et après paiement intégral, le client devient propriétaire du 
                site web créé. FastFabric conserve toutefois le droit d'utiliser les réalisations 
                à des fins de démonstration et de promotion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 9 - Responsabilité</h2>
              <p className="text-gray-600 mb-4">
                FastFabric s'engage à mettre en œuvre tous les moyens nécessaires à la bonne exécution 
                de ses prestations. Sa responsabilité ne pourra être engagée en cas de :
              </p>
              <ul className="text-gray-600 space-y-2 list-disc list-inside mb-4">
                <li>Retard dû à un manque d'informations de la part du client</li>
                <li>Dysfonctionnement lié à l'hébergement choisi par le client</li>
                <li>Modifications apportées par le client après livraison</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 10 - Protection des données</h2>
              <p className="text-gray-600">
                Les données personnelles collectées sont traitées conformément à notre 
                <a href="/confidentialite" className="text-[var(--accent)] hover:underline"> Politique de confidentialité</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 11 - Litiges</h2>
              <p className="text-gray-600 mb-4">
                En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. 
                À défaut d'accord, les tribunaux français seront seuls compétents.
              </p>
              <p className="text-gray-600">
                Conformément aux dispositions du Code de la consommation, le client peut recourir 
                à un médiateur de la consommation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 12 - Contact</h2>
              <p className="text-gray-600">
                Pour toute question relative aux présentes CGV : 
                <a href="mailto:contact@fastfabric.fr" className="text-[var(--accent)] hover:underline"> contact@fastfabric.fr</a>
              </p>
            </section>
          </div>

          <p className="text-sm text-gray-400 mt-12">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </main>
      
      <Footer />
    </>
  );
}


