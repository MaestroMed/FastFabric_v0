import type { Route } from "./+types/mentions-legales";
import { Header } from '~/components/layout/Header';
import { Footer } from '~/components/layout/Footer';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mentions légales — FastFabric" },
    { name: "description", content: "Mentions légales du site FastFabric - Sites web sur mesure en 2 heures" },
  ];
}

export default function MentionsLegales() {
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Mentions légales</h1>
          
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Éditeur du site</h2>
              <p className="text-gray-600 mb-4">
                Le site FastFabric est édité par :
              </p>
              <ul className="text-gray-600 space-y-2">
                <li><strong>Raison sociale :</strong> FastFabric SAS</li>
                <li><strong>Siège social :</strong> [Adresse à compléter]</li>
                <li><strong>Capital social :</strong> [Montant à compléter] €</li>
                <li><strong>RCS :</strong> [Numéro à compléter]</li>
                <li><strong>SIRET :</strong> [Numéro à compléter]</li>
                <li><strong>N° TVA intracommunautaire :</strong> [Numéro à compléter]</li>
                <li><strong>Email :</strong> contact@fastfabric.fr</li>
                <li><strong>Directeur de la publication :</strong> [Nom à compléter]</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Hébergement</h2>
              <p className="text-gray-600 mb-4">
                Le site est hébergé par :
              </p>
              <ul className="text-gray-600 space-y-2">
                <li><strong>Hébergeur :</strong> [Nom de l'hébergeur]</li>
                <li><strong>Adresse :</strong> [Adresse de l'hébergeur]</li>
                <li><strong>Téléphone :</strong> [Numéro de téléphone]</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Propriété intellectuelle</h2>
              <p className="text-gray-600 mb-4">
                L'ensemble du contenu du site FastFabric (structure, textes, logos, images, vidéos, 
                éléments graphiques, etc.) est la propriété exclusive de FastFabric ou de ses partenaires.
              </p>
              <p className="text-gray-600 mb-4">
                Toute reproduction, représentation, modification, publication, adaptation de tout ou 
                partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, 
                sauf autorisation écrite préalable de FastFabric.
              </p>
              <p className="text-gray-600">
                Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il 
                contient sera considérée comme constitutive d'une contrefaçon et poursuivie conformément 
                aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Limitation de responsabilité</h2>
              <p className="text-gray-600 mb-4">
                FastFabric s'efforce de fournir sur le site des informations aussi précises que possible. 
                Toutefois, FastFabric ne pourra être tenue responsable des omissions, des inexactitudes 
                et des carences dans la mise à jour, qu'elles soient de son fait ou du fait des tiers 
                partenaires qui lui fournissent ces informations.
              </p>
              <p className="text-gray-600">
                Tous les informations indiquées sur le site sont données à titre indicatif et sont 
                susceptibles d'évoluer. Par ailleurs, les renseignements figurant sur le site ne sont 
                pas exhaustifs. Ils sont donnés sous réserve de modifications ayant été apportées depuis 
                leur mise en ligne.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Liens hypertextes</h2>
              <p className="text-gray-600 mb-4">
                Le site peut contenir des liens hypertextes vers d'autres sites internet. FastFabric 
                ne peut être tenue responsable du contenu de ces sites externes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Droit applicable</h2>
              <p className="text-gray-600">
                Les présentes mentions légales sont régies par le droit français. En cas de litige, 
                les tribunaux français seront seuls compétents.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact</h2>
              <p className="text-gray-600">
                Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter 
                à l'adresse : <a href="mailto:contact@fastfabric.fr" className="text-[var(--accent)] hover:underline">contact@fastfabric.fr</a>
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


