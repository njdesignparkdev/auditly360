import HeroSection, {
  HeroSectionComponentData,
} from "@/components/home/hero-section";
import GridOverlay from "@/components/ui/grid-layer";
import { Footer } from "@/components/home/Footer-section";
import TestimonialSlider from "@/components/home/Testimonial-section";
import HowItWorks from "@/components/home/HowitsWork-section";
import { FeaturesSection } from "@/components/home/features-section";
import WhyChooseUsSection from "@/components/home/WhyChooseUs-Section";
import FaqSection from "@/components/home/faq-section";
import CtaSection from "@/components/home/cta-section";
import PricingSection from "@/components/home/Pricing-section";

const heroSectionData: HeroSectionComponentData = {
  navbar: {
    logoText: "Auditly360",
    navLinks: [
      { text: "Features", href: "#features" },
      { text: "How it Works", href: "#how-it-works" },
      { text: "Testimonials", href: "#testimonials" },
      { text: "Pricing", href: "#pricing" },
    ],
    authLinks: [
      { type: "link", text: "Sign In", href: "/login" },
      { type: "button-primary", text: "Get Started", href: "/signup" },
    ],
  },
  heroContent: {
    subheadline: "Introducing Auditly360 v2.0",
    headline: "Transform Your Website Performance Effortlessly",
    description:
      "AI-powered audits that identify issues, optimize performance, and boost your SEO rankings in seconds. Streamline your workflow and stay ahead of the curve.",
    secondaryCtaText: "Explore Features",
    secondaryCtaLink: "#features",
    primaryCtaText: "Start Free Audit",
    primaryCtaLink: "/signup",
  },
  appPreview: {
    headerControls: {
      filters: [
        { label: "Audit Type", icon: "document", dropdown: true },
        { label: "Status", icon: "info", dropdown: true },
        { label: "Date Range", icon: "calendar", dropdown: true },
        { label: "Site", icon: "folder", dropdown: true },
      ],
      actions: [
        { type: "button-outline", text: "Export Report", icon: "upload" },
        { type: "button-primary", text: "Run New Audit", icon: "plus" },
      ],
    },
    appDataTable: {
      headers: [
        { id: "name", label: "Page Name", icon: "document" },
        { id: "assignee", label: "Analyst", icon: "user" },
        { id: "status", label: "SEO Health", icon: "info" },
        { id: "dueDate", label: "Last Scan", icon: "calendar" },
        { id: "project", label: "Domain", icon: "folder" },
      ],
      data: [
        {
          id: 1,
          name: "Homepage Performance",
          assignee: ["System AI"],
          status: "Optimized",
          dueDate: "2024-01-20",
          project: "auditly360.com",
          statusColor: "#22c55e",
        },
        {
          id: 2,
          name: "Product Page SEO",
          assignee: ["Alex Reed"],
          status: "Improving",
          dueDate: "2024-01-18",
          project: "auditly360.com",
          statusColor: "#3b82f6",
        },
        {
          id: 3,
          name: "Blog Content Audit",
          assignee: ["System AI"],
          status: "Review Needed",
          dueDate: "2024-01-15",
          project: "auditly360.com",
          statusColor: "#f59e0b",
        },
        {
          id: 4,
          name: "API Documentation",
          assignee: ["Tech Team"],
          status: "Critical Fix",
          dueDate: "2024-01-10",
          project: "docs.auditly360.com",
          statusColor: "#ef4444",
        },
        {
          id: 5,
          name: "Landing Page V2",
          assignee: ["Sarah Chen"],
          status: "Improving",
          dueDate: "2024-01-05",
          project: "auditly360.com",
          statusColor: "#3b82f6",
        },
      ],
    },
  },
};

import { PageBackground } from "@/components/ui/page-background";

export default function Page() {
  return (
    <GridOverlay>
      <PageBackground />
      {/* Hero Section includes Navbar */}
      <HeroSection data={heroSectionData} />

      {/* Main Content Container - Matches grid padding structure */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative">
          {/* Features Section */}
          <section id="features" className="scroll-mt-32 py-12">
            <div className="pb-0 relative z-10">
              <FeaturesSection />
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="scroll-mt-32 py-12">
            <HowItWorks />
          </section>

          {/* Why Choose Us Section */}
          <section className="py-12">
            <WhyChooseUsSection />
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="scroll-mt-32 py-12">
            <TestimonialSlider />
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="scroll-mt-24 py-12">
            <PricingSection />
          </section>

          {/* FAQ Section */}
          <section className="py-12">
            <FaqSection />
          </section>

          {/* CTA Section */}
          <section className="py-12 pb-24">
            <CtaSection />
          </section>
        </div>
      </div>

      {/* Footer - Outside main container */}
      <Footer />
    </GridOverlay>
  );
}
