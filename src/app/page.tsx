"use client";

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
import Process from "@/components/digiman/process";
import Testimonials from "@/components/digiman/testimonials";
import Faq from "@/components/digiman/faq";
import CtaSection from "@/components/digiman/cta";
import Footer from "@/components/digiman/footer";
import FloatingWidgets from "@/components/digiman/floating-widgets";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#050d0a]">
      <Preloader />
      <ScrollProgress />
      <CursorGlow />
      <Navbar />

      <main className="flex-1">
        <Hero />
        <Marquee />
        <Stats />
        <SevenHeavens />
        <Services />
        <WhyUs />
        <Process />
        <Testimonials />
        <Faq />
        <CtaSection />
      </main>

      <Footer />
      <FloatingWidgets />
    </div>
  );
}
