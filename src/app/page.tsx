import type { Metadata } from "next";
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
import Offices from "@/components/digiman/offices";
import Footer from "@/components/digiman/footer";
import FloatingWidgets from "@/components/digiman/floating-widgets";
import ContactForm from "@/components/digiman/contact-form";
import PageViewTracker from "@/components/digiman/pageview-tracker";
import { LocaleProvider } from "@/components/i18n/locale-provider";
import MotionProvider from "@/components/digiman/motion-provider";

// Konten dikelola via Panel Admin — selalu ambil data terbaru
export const dynamic = "force-dynamic";

// SEO dinamis: meta title & description dikelola dari Panel Admin > Pengaturan
export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  const keywords = settings.metaKeywords
    ? settings.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
    : undefined;
  return {
    title: settings.metaTitle,
    description: settings.metaDescription,
    ...(keywords ? { keywords } : {}),
    ...(settings.googleSiteVerification
      ? { verification: { google: settings.googleSiteVerification } }
      : {}),
    openGraph: {
      title: settings.metaTitle,
      description: settings.metaDescription,
      url: "https://digiman.id",
      siteName: "DIGIMAN.ID",
      type: "website",
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.metaTitle,
      description: settings.metaDescription,
    },
  };
}

export default async function Home() {
  const data = await getSiteData();
  const s = data.settings;

  // Urutan & visibilitas section dikendalikan dari Panel Admin > Tampilan
  const enabled = data.sections.filter((sec) => sec.enabled);
  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <Hero waNumber={s.waNumber} headline={s.heroHeadline} sub={s.heroSub} rotatingWords={s.heroWords} />
    ),
    marquee: <Marquee />,
    stats: (
      <Stats clients={s.statClients} experts={s.statExperts} layers={s.statLayers} success={s.statSuccess} />
    ),
    "seven-heavens": <SevenHeavens />,
    services: <Services items={data.services} waNumber={s.waNumber} />,
    "why-us": <WhyUs />,
    team: <TeamStructure members={data.team} />,
    offices: (
      <Offices offices={data.offices} waDisplay={s.waDisplay} hours={s.hours} waNumber={s.waNumber} />
    ),
    process: <Process />,
    testimonials: <Testimonials items={data.testimonials} />,
    faq: <Faq faqs={data.faqs} />,
    cta: <CtaSection waNumber={s.waNumber} waDisplay={s.waDisplay} email={s.email} address={s.addressShort} />,
    "contact-form": s.contactFormEnabled ? (
      <ContactForm services={data.services.map((sv) => sv.title)} />
    ) : null,
  };

  return (
    <LocaleProvider>
      <MotionProvider>
      <PageViewTracker />
      <div className="relative flex min-h-screen flex-col bg-[#050d0a]">
        <Preloader logoUrl={s.logoUrl} />
        <ScrollProgress />
        <CursorGlow />
        <Navbar logoUrl={s.logoUrl} />

        <main className="flex-1">
          {enabled.map((sec) => {
            const node = sectionMap[sec.key];
            return node ? <div key={sec.key}>{node}</div> : null;
          })}
        </main>

        <Footer
          logoUrl={s.logoUrl}
          waNumber={s.waNumber}
          waDisplay={s.waDisplay}
          email={s.email}
          addressFull={s.addressFull}
          hours={s.hours}
          instagram={s.instagram}
          linkedin={s.linkedin}
          tiktok={s.tiktok}
          offices={data.offices}
        />
        <FloatingWidgets waNumber={s.waNumber} />
      </div>
      </MotionProvider>
    </LocaleProvider>
  );
}
