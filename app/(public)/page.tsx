import HeroSection from "@/components/home/hero";
import { TrackShipmentSection } from "@/components/home/track-shipment-section";

import { CostCalculatorSection } from "@/components/home/cost-calculator-section";
import { PersonaExperienceSection } from "@/components/home/persona-experience-section";
import { CoverageSection } from "@/components/home/coverage-section";

import { CtaSection } from "@/components/home/cta-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { FeaturesBentoSection } from "@/components/home/features-bento-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20 selection:text-primary">
      {/* 1. Hero Section with Split Value Prop & 3D Logistics Visual Stage */}
      <HeroSection />

      {/* 2. Live Interactive Parcel Tracking Tool */}
      <TrackShipmentSection />

      {/* 3. 4-Step Interactive Logistics Pipeline */}
      <HowItWorksSection />

      {/* 4. Enterprise Feature Matrix & Bento Visual Showcase */}
      <FeaturesBentoSection />

      {/* 5. Dynamic Weight & Rate Cost Calculator */}
      <CostCalculatorSection />

      {/* 6. Persona Experience Tabs (Senders, Riders, Hubs, Enterprise) */}
      <PersonaExperienceSection />

      {/* 7. Nationwide Hub Coverage & District Directory */}
      <CoverageSection />

      {/* 8. Merchant & Fleet Testimonials */}
      <TestimonialsSection />
      {/* 9. Final Radiant Call-to-Action */}
      <CtaSection />
    </div>
  );
}
