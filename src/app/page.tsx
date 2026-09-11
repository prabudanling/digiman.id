import { getSiteData } from "@/lib/site-data";
import Preloader from "@/components/digiman/preloader";
import ScrollProgress from "@/components/digiman/scroll-progress";
import CursorGlow from "@/components/digiman/cursor-glow";
import Navbar from "@/components/digiman/navbar";
import Hero from "@/components/digiman/hero";
import Marquee from "@/components/digiman/marquee";
import Stats from "@/components/digiman/stats";
import SevenHeavens from "@/components/digiman/seven-heavens";
import Services from "@/components/digiman/services";
import WhyUs from "@/components/digiman/why-us";
import TeamStructure from "@/components/digiman/team-structure";
import Process from "@/components/digiman/process";
import Testimonials from "@/components/digiman/testimonials";
import Faq from "@/components/digiman/faq";
import CtaSection from "@/components/digiman/cta";
import Footer from "@/components/digiman/footer";
import FloatingWidgets from "@/components/digiman/floating-widgets";

// Konten dikelola via Panel Admin — selalu ambil data terbaru
export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getSiteData();
  const s = data.settings;

  return (
    <div className="relative flex min-h-screen flex-col bg-[#050d0a]">
      <Preloader logoUrl={s.logoUrl} />
      <ScrollProgress />
      <CursorGlow />
      <Navbar logoUrl={s.logoUrl} />

      <main className="flex-1">
        <Hero waNumber={s.waNumber} />
        <Marquee />
        <Stats
          clients={s.statClients}
          experts={s.statExperts}
          layers={s.statLayers}
          success={s.statSuccess}
        />
        <SevenHeavens />
        <Services items={data.services} />
        <WhyUs />
        <TeamStructure members={data.team} />
        <Process />
        <Testimonials items={data.testimonials} />
        <Faq faqs={data.faqs} />
        <CtaSection
          waNumber={s.waNumber}
          waDisplay={s.waDisplay}
          email={s.email}
          address={s.addressShort}
        />
      </main>

      <Footer
        logoUrl={s.logoUrl}
        waNumber={s.waNumber}
        waDisplay={s.waDisplay}
        email={s.email}
        addressFull={s.addressFull}
      />
      <FloatingWidgets waNumber={s.waNumber} />
    </div>
  );
}
