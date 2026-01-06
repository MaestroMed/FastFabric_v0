import type { Route } from "./+types/home";
import { Header } from '~/components/layout/Header';
import { Footer } from '~/components/layout/Footer';
import { Hero } from '~/components/landing/Hero';
import { StatsBar } from '~/components/landing/StatsBar';
import { ProjectsCarousel } from '~/components/landing/ProjectsCarousel';
import { Process } from '~/components/landing/Process';
import { Pricing } from '~/components/landing/Pricing';
import { FAQ } from '~/components/landing/FAQ';
import { Testimonials } from '~/components/landing/Testimonials';
import { FinalCTA } from '~/components/landing/FinalCTA';
import { localStore } from '~/lib/store';
import { 
  RecentOrderNotification, 
  UrgencyBar, 
  WhatsAppButton 
} from '~/components/conversion';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FastFabric — Sites Web Sur Mesure en 2 Heures" },
    { name: "description", content: "Votre site web professionnel livré en 2 heures. Design sur mesure, qualité premium, prix fixe. One Page 299€, Site Vitrine 599€. Commandez maintenant." },
    { property: "og:title", content: "FastFabric — Sites Web Sur Mesure en 2 Heures" },
    { property: "og:description", content: "Votre site web professionnel livré en 2 heures. Design sur mesure, qualité premium, prix fixe." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}

export async function clientLoader() {
  const offers = localStore.getOffers();
  const projects = localStore.getProjects();
  const tags = localStore.getTags();
  const stats = localStore.getStats();
  const faq = localStore.getVisibleFaq();
  const testimonials = localStore.getFeaturedTestimonials();
  
  return { offers, projects, tags, stats, faq, testimonials };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { offers, projects, tags, stats, faq, testimonials } = loaderData;

  return (
    <>
      {/* Urgency bar at the top */}
      <UrgencyBar />
      
      <Header />
      
      <main>
        <Hero stats={stats} />
        <StatsBar />
        <ProjectsCarousel projects={projects} tags={tags} />
        <Process />
        <Pricing offers={offers} />
        {testimonials.length > 0 && <Testimonials testimonials={testimonials} />}
        <FAQ faqItems={faq} />
        <FinalCTA />
      </main>
      
      <Footer />

      {/* Conversion widgets */}
      <RecentOrderNotification />
      <WhatsAppButton phoneNumber="33757847424" />
    </>
  );
}
