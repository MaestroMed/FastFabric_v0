import type { Route } from "./+types/confidentialite";
import { Header } from '~/components/layout/Header';
import { Footer } from '~/components/layout/Footer';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Politique de confidentialité — FastFabric" },
    { name: "description", content: "Politique de confidentialité de FastFabric - Protection de vos données personnelles" },
  ];
}

export default function Confidentialite() {
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Politique de confidentialité</h1>
          
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                Chez FastFabric, nous accordons une importance capitale à la protection de vos données 
                personnelles. Cette politique de confidentialité explique comment nous collectons, 
                utilisons et protégeons vos informations lorsque vous utilisez notre site web et nos services.
              </p>
              <p className="text-gray-600">
                En utilisant notre site, vous acceptez les pratiques décrites dans cette politique.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Données collectées</h2>
              <p className="text-gray-600 mb-4">
                Nous collectons les données suivantes :
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Données d'identification</h3>
              <ul className="text-gray-600 space-y-2 list-disc list-inside mb-4">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone (optionnel)</li>
                <li>Nom de l'entreprise (optionnel)</li>
              </ul>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Données de projet</h3>
              <ul className="text-gray-600 space-y-2 list-disc list-inside mb-4">
                <li>Informations sur votre projet web</li>
                <li>Préférences de design (couleurs, style)</li>
                <li>Contenus fournis (textes, images, logo)</li>
              </ul>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Données de navigation</h3>
              <ul className="text-gray-600 space-y-2 list-disc list-inside">
                <li>Adresse IP</li>
                <li>Type de navigateur</li>
                <li>Pages visitées</li>
                <li>Durée des visites</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Utilisation des données</h2>
              <p className="text-gray-600 mb-4">
                Vos données sont utilisées pour :
              </p>
              <ul className="text-gray-600 space-y-2 list-disc list-inside">
                <li>Traiter et exécuter vos commandes de sites web</li>
                <li>Vous contacter concernant votre projet</li>
                <li>Vous envoyer des emails transactionnels (confirmation, suivi, livraison)</li>
                <li>Améliorer nos services et votre expérience utilisateur</li>
                <li>Générer des factures et respecter nos obligations légales</li>
                <li>Vous informer de nos nouvelles offres (avec votre consentement)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Base légale du traitement</h2>
              <p className="text-gray-600 mb-4">
                Le traitement de vos données repose sur :
              </p>
              <ul className="text-gray-600 space-y-2 list-disc list-inside">
                <li><strong>L'exécution du contrat :</strong> pour traiter vos commandes</li>
                <li><strong>L'obligation légale :</strong> pour la facturation et la comptabilité</li>
                <li><strong>L'intérêt légitime :</strong> pour améliorer nos services</li>
                <li><strong>Le consentement :</strong> pour les communications marketing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Partage des données</h2>
              <p className="text-gray-600 mb-4">
                Vos données peuvent être partagées avec :
              </p>
              <ul className="text-gray-600 space-y-2 list-disc list-inside mb-4">
                <li><strong>Stripe :</strong> pour le traitement sécurisé des paiements</li>
                <li><strong>Resend :</strong> pour l'envoi d'emails transactionnels</li>
                <li><strong>Supabase :</strong> pour le stockage sécurisé des données</li>
              </ul>
              <p className="text-gray-600">
                Ces prestataires sont tenus contractuellement de protéger vos données et de ne les 
                utiliser que pour les services convenus.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Durée de conservation</h2>
              <p className="text-gray-600 mb-4">
                Vos données sont conservées pendant :
              </p>
              <ul className="text-gray-600 space-y-2 list-disc list-inside">
                <li>Données de commande : 10 ans (obligations comptables)</li>
                <li>Données de projet : 3 ans après la dernière interaction</li>
                <li>Données de navigation : 13 mois</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Vos droits</h2>
              <p className="text-gray-600 mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="text-gray-600 space-y-2 list-disc list-inside mb-4">
                <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
                <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
                <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
                <li><strong>Droit à la limitation :</strong> restreindre le traitement</li>
                <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                <li><strong>Droit d'opposition :</strong> vous opposer au traitement</li>
              </ul>
              <p className="text-gray-600">
                Pour exercer ces droits, contactez-nous à : 
                <a href="mailto:privacy@fastfabric.fr" className="text-[var(--accent)] hover:underline"> privacy@fastfabric.fr</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies</h2>
              <p className="text-gray-600 mb-4">
                Nous utilisons des cookies pour :
              </p>
              <ul className="text-gray-600 space-y-2 list-disc list-inside mb-4">
                <li><strong>Cookies essentiels :</strong> fonctionnement du site et sécurité</li>
                <li><strong>Cookies de performance :</strong> analyse anonyme de l'utilisation</li>
                <li><strong>Cookies fonctionnels :</strong> mémorisation de vos préférences</li>
              </ul>
              <p className="text-gray-600">
                Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Sécurité</h2>
              <p className="text-gray-600 mb-4">
                Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données :
              </p>
              <ul className="text-gray-600 space-y-2 list-disc list-inside">
                <li>Chiffrement SSL/TLS pour toutes les communications</li>
                <li>Stockage sécurisé des données avec chiffrement au repos</li>
                <li>Accès restreint aux données personnelles</li>
                <li>Paiements sécurisés via Stripe (certifié PCI-DSS)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modifications</h2>
              <p className="text-gray-600">
                Nous pouvons mettre à jour cette politique de confidentialité. Toute modification 
                significative sera communiquée par email ou via une notification sur le site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact</h2>
              <p className="text-gray-600 mb-4">
                Pour toute question concernant cette politique ou vos données personnelles :
              </p>
              <ul className="text-gray-600 space-y-2">
                <li><strong>Email :</strong> <a href="mailto:privacy@fastfabric.fr" className="text-[var(--accent)] hover:underline">privacy@fastfabric.fr</a></li>
                <li><strong>Adresse :</strong> [Adresse à compléter]</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Vous avez également le droit d'introduire une réclamation auprès de la CNIL 
                (Commission Nationale de l'Informatique et des Libertés).
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


