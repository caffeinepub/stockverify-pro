import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  ArrowRight,
  Award,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  Factory,
  Gem,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Monitor,
  Package,
  Phone,
  Pill,
  QrCode,
  RefreshCcw,
  ShieldCheck,
  Shirt,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  Truck,
  Users,
  Warehouse,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SiFacebook, SiInstagram, SiLinkedin } from "react-icons/si";
import { toast } from "sonner";
import { useActor } from "./hooks/useActor";

// ===== COUNTER HOOK =====
function useCounterAnimation(end: number, duration = 2000, suffix = "") {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.floor(eased * end));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return { count, ref, suffix };
}

// ===== STAT COUNTER COMPONENT =====
function StatCounter({
  end,
  suffix,
  label,
}: { end: number; suffix: string; label: string }) {
  const { count, ref } = useCounterAnimation(end, 2000, suffix);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-display font-bold gradient-text mb-2">
        {count}
        {suffix}
      </div>
      <div className="text-sm md:text-base font-bold text-black">{label}</div>
    </div>
  );
}

// ===== SERVICES DATA =====
const services = [
  {
    icon: <BarChart3 className="w-7 h-7" />,
    title: "Showroom Audit",
    description:
      "Comprehensive book vs physical reconciliation for accurate showroom inventory visibility.",
  },
  {
    icon: <Warehouse className="w-7 h-7" />,
    title: "Warehouse Audit",
    description:
      "Full inventory and transaction audit at warehouse and CFA locations.",
  },
  {
    icon: <Tag className="w-7 h-7" />,
    title: "Fixed Asset Tagging",
    description:
      "Barcode tagging and re-verification of all fixed assets for complete traceability.",
  },
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    title: "Compliance Audit",
    description:
      "SOP, cash, and statutory compliance review to keep your operations fully aligned.",
  },
  {
    icon: <QrCode className="w-7 h-7" />,
    title: "Barcode Implementation",
    description:
      "End-to-end barcode scanning solutions from hardware setup to software integration.",
  },
  {
    icon: <Truck className="w-7 h-7" />,
    title: "Dispatch Audit",
    description:
      "Auditing dispatches to ensure correct SKU and quantity are delivered every time.",
  },
  {
    icon: <RefreshCcw className="w-7 h-7" />,
    title: "Stock Reconciliation",
    description:
      "Reconciliation across C&F, franchise, and distribution network locations.",
  },
  {
    icon: <Users className="w-7 h-7" />,
    title: "Manpower Support",
    description:
      "Contracted resources deployed at outlets and warehouses for seamless operations.",
  },
];

// ===== WHY CHOOSE US DATA =====
const whyUs = [
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Pan India Service",
    description:
      "Nationwide presence with consistent quality and standardized processes across 45+ cities.",
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: "In-House Technology",
    description:
      "Proprietary software platform for real-time accurate data capture and reporting.",
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Expert Auditors",
    description:
      "Certified professionals with deep domain experience across multiple industries.",
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Fast Turnaround",
    description:
      "48-hour average turnaround with detailed discrepancy reports and recommendations.",
  },
];

// ===== PROCESS STEPS =====
const processSteps = [
  {
    number: "01",
    title: "Initial Assessment",
    description:
      "Evaluate current inventory management systems and identify audit scope.",
  },
  {
    number: "02",
    title: "Planning",
    description:
      "Develop detailed audit strategy and timeline based on business requirements.",
  },
  {
    number: "03",
    title: "Physical Count",
    description:
      "Systematic counting and verification of all inventory items using barcode technology.",
  },
  {
    number: "04",
    title: "Data Analysis",
    description:
      "Compare physical count with system records and identify discrepancies.",
  },
  {
    number: "05",
    title: "Reporting",
    description:
      "Detailed documentation of findings, discrepancies, and actionable recommendations.",
  },
  {
    number: "06",
    title: "Implementation",
    description:
      "Execute recommended improvements and establish ongoing monitoring systems.",
  },
];

// ===== INDUSTRIES DATA =====
const industries = [
  { icon: <Shirt className="w-8 h-8" />, name: "Apparel" },
  { icon: <Monitor className="w-8 h-8" />, name: "Electronics" },
  { icon: <Pill className="w-8 h-8" />, name: "Pharmaceuticals" },
  { icon: <ShoppingCart className="w-8 h-8" />, name: "FMCG / Retail" },
  { icon: <Gem className="w-8 h-8" />, name: "Jewelry" },
  { icon: <Factory className="w-8 h-8" />, name: "Manufacturing" },
  { icon: <Warehouse className="w-8 h-8" />, name: "Warehousing" },
  { icon: <Sparkles className="w-8 h-8" />, name: "Cosmetics" },
];

// ===== TESTIMONIALS =====
const testimonials = [
  {
    quote:
      "NSS Consultancy has been an exceptional partner for our inventory audits. Their accuracy and transparent reporting have helped us reduce shrinkage significantly.",
    name: "Rajiv M.",
    role: "Operations Head",
    initials: "RM",
  },
  {
    quote:
      "Their trained team and quick execution make them one of the most dependable service providers. Audit quality is consistently excellent across all our locations.",
    name: "Priya S.",
    role: "Store Manager",
    initials: "PS",
  },
  {
    quote:
      "The barcode implementation and real-time reporting transformed how we manage our 20+ outlet inventory network. Truly a game changer.",
    name: "Arun K.",
    role: "Supply Chain Director",
    initials: "AK",
  },
];

// ===== FAQ DATA =====
const faqs = [
  {
    q: "What is a third-party stock audit?",
    a: "A third-party stock audit is an independent verification of your physical inventory conducted by an external specialist. Unlike internal audits, our auditors have no vested interests in your operations, ensuring unbiased and accurate reporting. This helps uncover discrepancies, prevent pilferage, and provide honest stock data you can rely on.",
  },
  {
    q: "How long does an inventory audit take?",
    a: "The duration depends on the size and complexity of your inventory. A typical retail showroom audit takes 1–2 days, while large warehouse audits may take 3–5 days. We aim for 48-hour turnaround on final reports after physical count completion. We provide a detailed timeline during the planning phase.",
  },
  {
    q: "Do you provide Pan India services?",
    a: "Yes, we operate across 45+ cities in India with dedicated regional teams. Our standardized processes and proprietary technology ensure consistent audit quality regardless of location. We serve clients from metro cities to tier-2 and tier-3 towns.",
  },
  {
    q: "What technology do you use for audits?",
    a: "We use our proprietary barcode scanning software combined with handheld scanners and mobile devices. Our system integrates with most ERP and POS platforms for seamless data comparison. We also offer RFID-based solutions for clients requiring faster scanning of large volumes.",
  },
  {
    q: "How do you handle discrepancies found during audit?",
    a: "All discrepancies are documented in real-time and categorized (excess, shortage, damaged, misplaced). Our final report includes a root-cause analysis and actionable recommendations. We follow up with clients to help implement corrective measures and prevent recurrence.",
  },
];

// ===== NAVBAR =====
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home", ocid: "nav.home.link" },
    { label: "Services", href: "#services", ocid: "nav.services.link" },
    { label: "About", href: "#about", ocid: "nav.about.link" },
    { label: "Process", href: "#process", ocid: "nav.process.link" },
    { label: "Industries", href: "#industries", ocid: "nav.industries.link" },
    { label: "Contact", href: "#contact", ocid: "nav.contact.link" },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container-site">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNavClick("#home")}
            className="flex items-center gap-2 focus:outline-none"
            aria-label="NSS Consultancy Home"
          >
            <img
              src="/assets/uploads/NSS_rgb-1.png"
              alt="NSS Consultancy"
              className="h-10 md:h-12 w-auto"
            />
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.href}
                data-ocid={link.ocid}
                onClick={() => handleNavClick(link.href)}
                className={`text-sm font-bold font-heading animate-underline transition-colors duration-200 ${
                  scrolled
                    ? "text-navy-deep hover:text-amber-brand"
                    : "text-black hover:text-amber-brand"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <Button
              data-ocid="nav.quote.primary_button"
              onClick={() => handleNavClick("#contact")}
              className="hidden md:flex bg-amber-brand text-navy-deep hover:bg-amber-light font-heading font-bold text-sm px-5 py-2 h-auto"
              style={{
                backgroundColor: "oklch(0.82 0.16 68)",
                color: "oklch(0.20 0.09 258)",
              }}
            >
              Get Free Quote
              <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
            <button
              type="button"
              className={`md:hidden p-2 rounded-md transition-colors ${
                scrolled ? "text-navy-deep" : "text-black"
              }`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-border shadow-lg"
          >
            <div className="container-site py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.href}
                  data-ocid={link.ocid}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left px-3 py-3 text-navy-deep font-bold font-heading hover:bg-surface-subtle rounded-md transition-colors flex items-center justify-between"
                >
                  {link.label}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
              <Button
                data-ocid="nav.quote.primary_button"
                onClick={() => handleNavClick("#contact")}
                className="mt-3 font-heading font-bold"
                style={{
                  backgroundColor: "oklch(0.82 0.16 68)",
                  color: "oklch(0.20 0.09 258)",
                }}
              >
                Get Free Quote
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ===== HERO SECTION =====
function HeroSection() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background gradient - transparent navy blue */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(10, 25, 70, 0.75) 0%, rgba(20, 40, 100, 0.65) 60%, rgba(10, 25, 70, 0.75) 100%)",
          backgroundColor: "rgba(10, 25, 70, 0.7)",
        }}
      />
      {/* Decorative pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container-site relative z-10 pt-24 pb-16">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-black/20"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.25)" }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: "oklch(0.82 0.16 68)" }}
            />
            <span className="text-sm font-bold font-heading text-black">
              Pan India Inventory Audit Experts
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight mb-6"
          >
            Professional <span className="gradient-text">Inventory Audit</span>{" "}
            & Stock Verification
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-black font-bold mb-10 max-w-2xl leading-relaxed"
          >
            Expert stock verification and barcode-based inventory audits across
            India.{" "}
            <strong className="text-black">Accurate. Reliable. Fast.</strong>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Button
              data-ocid="hero.quote.primary_button"
              onClick={() => scrollTo("#contact")}
              size="lg"
              className="font-heading font-bold text-base px-8 h-12 shadow-lg"
              style={{
                backgroundColor: "oklch(0.82 0.16 68)",
                color: "oklch(0.20 0.09 258)",
              }}
            >
              Get Free Audit Quote
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              data-ocid="hero.services.secondary_button"
              onClick={() => scrollTo("#services")}
              size="lg"
              variant="outline"
              className="font-heading font-bold text-base px-8 h-12 border-black/40 text-black hover:bg-black/10 bg-black/5"
            >
              Our Services
            </Button>
          </motion.div>

          {/* Stat counters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl border border-black/10"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <StatCounter end={1000} suffix="+" label="Audits Completed" />
            <StatCounter end={98} suffix="%" label="Accuracy Rate" />
            <StatCounter end={50} suffix="+" label="Expert Staff" />
            <StatCounter end={45} suffix="+" label="Cities Covered" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ===== SERVICES SECTION =====
function ServicesSection() {
  return (
    <section id="services" className="section-padding bg-section-services">
      <div className="container-site">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-bold font-heading uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.45 0.12 252)" }}
          >
            What We Do
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: "oklch(0.20 0.09 258)" }}
          >
            Our Core Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-bold text-lg max-w-2xl mx-auto"
            style={{ color: "oklch(0.35 0.07 252)" }}
          >
            Comprehensive inventory management solutions tailored to your
            business needs.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              data-ocid={`services.item.${i + 1}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <Card className="h-full card-hover border-border bg-white group cursor-default">
                <CardContent className="p-6">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-white transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: "oklch(0.28 0.08 252)" }}
                  >
                    {service.icon}
                  </div>
                  <h3
                    className="font-heading font-bold text-lg mb-2"
                    style={{ color: "oklch(0.20 0.09 258)" }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="font-bold text-sm leading-relaxed"
                    style={{ color: "oklch(0.35 0.07 252)" }}
                  >
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== WHY CHOOSE US SECTION =====
function WhyChooseUsSection() {
  return (
    <section id="about" className="section-padding navy-mesh text-white">
      <div className="container-site">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block text-sm font-bold font-heading uppercase tracking-widest text-amber-brand mb-3">
              Why Us
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Why Choose <span className="gradient-text">NSS Consultancy?</span>
            </h2>
            <p className="text-white font-bold text-lg mb-8 leading-relaxed">
              We combine deep domain expertise with cutting-edge technology to
              deliver inventory audit services that set the standard for
              accuracy and reliability across India.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Unbiased third-party verification",
                "Real-time data capture",
                "Detailed discrepancy reports",
                "Dedicated client support",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-amber-brand flex-shrink-0" />
                  <span className="font-bold">{item}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() =>
                document
                  .querySelector("#contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="font-heading font-bold px-8 h-11"
              style={{
                backgroundColor: "oklch(0.82 0.16 68)",
                color: "oklch(0.20 0.09 258)",
              }}
            >
              Get Started Today
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>

          {/* Right grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {whyUs.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-xl p-5 border border-white/10 hover:border-amber-brand/50 transition-all duration-300 group"
                style={{ backgroundColor: "oklch(0.20 0.09 258 / 0.5)" }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-white transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: "oklch(0.82 0.16 68 / 0.2)" }}
                >
                  <span className="text-amber-brand">{item.icon}</span>
                </div>
                <h3 className="font-heading font-bold text-white text-base mb-2">
                  {item.title}
                </h3>
                <p className="text-white font-bold text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== PROCESS SECTION =====
function ProcessSection() {
  return (
    <section id="process" className="section-padding bg-section-process">
      <div className="container-site">
        <div className="text-center mb-14">
          <span
            className="inline-block text-sm font-bold font-heading uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.50 0.15 160)" }}
          >
            How We Work
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: "oklch(0.22 0.08 160)" }}
          >
            Our Audit Process
          </motion.h2>
          <p
            className="font-bold text-lg max-w-2xl mx-auto"
            style={{ color: "oklch(0.38 0.10 160)" }}
          >
            A structured, transparent six-step methodology for reliable
            inventory audits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processSteps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative p-6 rounded-xl border border-border hover:border-amber-brand/40 hover:shadow-lg transition-all duration-300 group"
            >
              {/* Step number background */}
              <div
                className="absolute top-4 right-4 text-5xl font-display font-black opacity-5 group-hover:opacity-10 transition-opacity"
                style={{ color: "oklch(0.28 0.08 252)" }}
              >
                {step.number}
              </div>

              {/* Step number badge */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-heading font-bold text-sm mb-4"
                style={{ backgroundColor: "oklch(0.28 0.08 252)" }}
              >
                {step.number}
              </div>

              <h3
                className="font-heading font-bold text-lg mb-2"
                style={{ color: "oklch(0.22 0.08 160)" }}
              >
                {step.title}
              </h3>
              <p
                className="font-bold text-sm leading-relaxed"
                style={{ color: "oklch(0.38 0.10 160)" }}
              >
                {step.description}
              </p>

              {/* Connector line for non-last items */}
              {i < processSteps.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-3 z-10">
                  <ChevronRight className="w-5 h-5 text-amber-brand" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== INDUSTRIES SECTION =====
function IndustriesSection() {
  return (
    <section id="industries" className="section-padding bg-section-industries">
      <div className="container-site">
        <div className="text-center mb-14">
          <span
            className="inline-block text-sm font-bold font-heading uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.45 0.16 150)" }}
          >
            Industries
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: "oklch(0.22 0.10 160)" }}
          >
            Industries We Serve
          </motion.h2>
          <p
            className="font-bold text-lg max-w-2xl mx-auto"
            style={{ color: "oklch(0.35 0.10 155)" }}
          >
            Deep expertise across diverse sectors for specialized inventory
            solutions.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {industries.map((industry, i) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border hover:shadow-md transition-all duration-300 group cursor-default"
              style={{
                backgroundColor: "oklch(0.98 0.010 160)",
                borderColor: "oklch(0.85 0.04 160)",
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: "oklch(0.28 0.08 252)" }}
              >
                {industry.icon}
              </div>
              <span
                className="font-heading font-bold text-sm text-center"
                style={{ color: "oklch(0.22 0.10 160)" }}
              >
                {industry.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== STATS BANNER =====
function StatsBanner() {
  const stats = [
    { end: 1000, suffix: "+", label: "Audits Completed" },
    { end: 98, suffix: "%", label: "Accuracy Rate" },
    { end: 50, suffix: "+", label: "Expert Staff" },
    { end: 45, suffix: "+", label: "Cities Covered" },
  ];

  return (
    <section className="py-16 navy-mesh">
      <div className="container-site">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <StatCounter
                end={stat.end}
                suffix={stat.suffix}
                label={stat.label}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== TESTIMONIALS SECTION =====
function TestimonialsSection() {
  return (
    <section className="section-padding bg-section-testimonials">
      <div className="container-site">
        <div className="text-center mb-14">
          <span
            className="inline-block text-sm font-bold font-heading uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.55 0.15 68)" }}
          >
            Client Stories
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: "oklch(0.28 0.12 55)" }}
          >
            What Our Clients Say
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card
                className="h-full hover:shadow-lg transition-shadow duration-300"
                style={{
                  backgroundColor: "oklch(0.99 0.008 75)",
                  borderColor: "oklch(0.88 0.06 68)",
                }}
              >
                <CardContent className="p-6 flex flex-col h-full">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {["s1", "s2", "s3", "s4", "s5"].map((sk) => (
                      <Star
                        key={sk}
                        className="w-4 h-4"
                        style={{
                          color: "oklch(0.68 0.18 55)",
                          fill: "oklch(0.68 0.18 55)",
                        }}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote
                    className="font-bold text-sm leading-relaxed mb-6 flex-1"
                    style={{ color: "oklch(0.38 0.10 55)" }}
                  >
                    "{t.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-heading font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: "oklch(0.55 0.16 55)" }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div
                        className="font-heading font-bold text-sm"
                        style={{ color: "oklch(0.28 0.12 55)" }}
                      >
                        {t.name}
                      </div>
                      <div
                        className="font-bold text-xs"
                        style={{ color: "oklch(0.50 0.10 55)" }}
                      >
                        {t.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== FAQ SECTION =====
function FAQSection() {
  return (
    <section className="section-padding bg-section-faq">
      <div className="container-site">
        <div className="text-center mb-14">
          <span
            className="inline-block text-sm font-bold font-heading uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.50 0.18 290)" }}
          >
            FAQ
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: "oklch(0.22 0.12 290)" }}
          >
            Frequently Asked Questions
          </motion.h2>
          <p
            className="font-bold text-lg max-w-2xl mx-auto"
            style={{ color: "oklch(0.38 0.12 290)" }}
          >
            Everything you need to know about our inventory audit services.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={faq.q}
                value={`faq-${i}`}
                data-ocid={`faq.item.${i + 1}`}
                className="border rounded-xl px-2 overflow-hidden"
                style={{
                  backgroundColor: "oklch(0.98 0.010 290)",
                  borderColor: "oklch(0.85 0.06 290)",
                }}
              >
                <AccordionTrigger
                  className="font-heading font-bold text-left py-5 px-4 hover:no-underline transition-colors"
                  style={{ color: "oklch(0.22 0.12 290)" }}
                >
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent
                  className="font-bold leading-relaxed px-4 pb-5"
                  style={{ color: "oklch(0.38 0.12 290)" }}
                >
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

// ===== CONTACT SECTION =====
function ContactSection() {
  const { actor } = useActor();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await actor.submit(
        formData.name,
        formData.company,
        formData.phone,
        formData.email,
        formData.message,
      );
      setSubmitStatus("success");
      setFormData({ name: "", company: "", phone: "", email: "", message: "" });
      toast.success(
        "Your enquiry has been submitted! We'll get back to you shortly.",
        {
          duration: 5000,
        },
      );
    } catch {
      setSubmitStatus("error");
      toast.error(
        "Something went wrong. Please try again or call us directly.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Phone",
      value: "+91 98765 43210",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: "nssc.mumbai@gmail.com",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Address",
      value: "Mumbai, Maharashtra, India — 400001",
    },
  ];

  const whyContact = [
    "Get a free inventory audit consultation",
    "Customized quote within 24 hours",
    "Pan India service coverage",
    "Dedicated account manager assigned",
  ];

  return (
    <section id="contact" className="section-padding bg-section-contact">
      <div className="container-site">
        <div className="text-center mb-14">
          <span
            className="inline-block text-sm font-bold font-heading uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.55 0.18 20)" }}
          >
            Contact Us
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: "oklch(0.25 0.12 20)" }}
          >
            Get a Free Audit Quote
          </motion.h2>
          <p
            className="font-bold text-lg max-w-2xl mx-auto"
            style={{ color: "oklch(0.40 0.12 20)" }}
          >
            Reach out today for a customized inventory audit solution for your
            business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3
              className="font-heading font-bold text-2xl mb-6"
              style={{ color: "oklch(0.25 0.12 20)" }}
            >
              Contact Information
            </h3>

            <div className="space-y-5 mb-8">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white"
                    style={{ backgroundColor: "oklch(0.50 0.18 20)" }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div
                      className="text-xs font-heading font-bold uppercase tracking-wide mb-0.5"
                      style={{ color: "oklch(0.50 0.12 20)" }}
                    >
                      {item.label}
                    </div>
                    <div
                      className="font-bold"
                      style={{ color: "oklch(0.25 0.12 20)" }}
                    >
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="p-6 rounded-xl border"
              style={{
                backgroundColor: "oklch(0.94 0.015 20)",
                borderColor: "oklch(0.85 0.06 20)",
              }}
            >
              <h4
                className="font-heading font-bold mb-4"
                style={{ color: "oklch(0.25 0.12 20)" }}
              >
                Why Contact Us?
              </h4>
              <ul className="space-y-2.5">
                {whyContact.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: "oklch(0.50 0.18 20)" }}
                    />
                    <span
                      className="text-sm font-bold"
                      style={{ color: "oklch(0.35 0.12 20)" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="rounded-2xl border p-6 md:p-8 shadow-sm"
              style={{
                backgroundColor: "oklch(0.99 0.006 20)",
                borderColor: "oklch(0.85 0.06 20)",
              }}
            >
              <h3
                className="font-heading font-bold text-xl mb-6"
                style={{ color: "oklch(0.25 0.12 20)" }}
              >
                Send Us a Message
              </h3>

              {/* Success state */}
              {submitStatus === "success" && (
                <motion.div
                  data-ocid="contact.success_state"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-lg border mb-6"
                  style={{
                    backgroundColor: "oklch(0.95 0.05 142)",
                    borderColor: "oklch(0.55 0.15 142)",
                  }}
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-green-800">
                    Thank you! We'll contact you within 24 hours.
                  </span>
                </motion.div>
              )}

              {/* Error state */}
              {submitStatus === "error" && (
                <motion.div
                  data-ocid="contact.error_state"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/10 mb-6"
                >
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                  <span className="text-sm font-medium text-destructive">
                    Submission failed. Please try again.
                  </span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="name"
                      className="font-heading font-bold text-sm"
                      style={{ color: "oklch(0.30 0.12 20)" }}
                    >
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      data-ocid="contact.name.input"
                      placeholder="Rajiv Sharma"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, name: e.target.value }))
                      }
                      required
                      className="h-11 border-input focus:ring-2"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="company"
                      className="font-heading font-bold text-sm"
                      style={{ color: "oklch(0.30 0.12 20)" }}
                    >
                      Company Name *
                    </Label>
                    <Input
                      id="company"
                      data-ocid="contact.company.input"
                      placeholder="Acme Retail Pvt. Ltd."
                      value={formData.company}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, company: e.target.value }))
                      }
                      required
                      className="h-11 border-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phone"
                      className="font-heading font-bold text-sm"
                      style={{ color: "oklch(0.30 0.12 20)" }}
                    >
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      data-ocid="contact.phone.input"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, phone: e.target.value }))
                      }
                      required
                      className="h-11 border-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="font-heading font-bold text-sm"
                      style={{ color: "oklch(0.30 0.12 20)" }}
                    >
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      data-ocid="contact.email.input"
                      type="email"
                      placeholder="rajiv@company.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, email: e.target.value }))
                      }
                      required
                      className="h-11 border-input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="message"
                    className="font-heading font-bold text-sm"
                    style={{ color: "oklch(0.30 0.12 20)" }}
                  >
                    Message / Requirements
                  </Label>
                  <Textarea
                    id="message"
                    data-ocid="contact.message.textarea"
                    placeholder="Describe your inventory audit requirements (locations, SKU count, frequency, etc.)"
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, message: e.target.value }))
                    }
                    className="border-input resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  data-ocid="contact.submit.submit_button"
                  disabled={isSubmitting}
                  className="w-full h-12 font-heading font-bold text-base"
                  style={{
                    backgroundColor: "oklch(0.45 0.18 20)",
                    color: "white",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        data-ocid="contact.loading_state"
                        className="mr-2 h-4 w-4 animate-spin"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Enquiry
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ===== FOOTER =====
function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "About Us", href: "#about" },
    { label: "Our Process", href: "#process" },
    { label: "Industries", href: "#industries" },
    { label: "Contact", href: "#contact" },
  ];

  const serviceLinks = [
    "Showroom Audit",
    "Warehouse Audit",
    "Fixed Asset Tagging",
    "Barcode Implementation",
    "Stock Reconciliation",
    "Dispatch Audit",
  ];

  const handleNavClick = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="navy-mesh text-white">
      <div className="container-site pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <img
              src="/assets/uploads/NSS_rgb-1.png"
              alt="NSS Consultancy"
              className="h-10 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-white font-bold text-sm leading-relaxed mb-6">
              NSS Consultancy — Expert inventory audit and stock verification
              services across India. Accurate, reliable, and fast.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {[
                {
                  icon: <SiLinkedin className="w-4 h-4" />,
                  label: "LinkedIn",
                  href: "#",
                },
                {
                  icon: <SiFacebook className="w-4 h-4" />,
                  label: "Facebook",
                  href: "#",
                },
                {
                  icon: <SiInstagram className="w-4 h-4" />,
                  label: "Instagram",
                  href: "#",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/20 hover:border-amber-brand/60 hover:text-amber-brand transition-colors duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-widest mb-5">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(link.href)}
                    className="text-white font-bold hover:text-amber-brand text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-widest mb-5">
              Our Services
            </h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <button
                    type="button"
                    onClick={() => handleNavClick("#services")}
                    className="text-white font-bold hover:text-amber-brand text-sm transition-colors duration-200 flex items-center gap-1.5 group text-left"
                  >
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-widest mb-5">
              Contact Info
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-brand flex-shrink-0 mt-0.5" />
                <span className="text-white font-bold text-sm">
                  +91 98765 43210
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-brand flex-shrink-0 mt-0.5" />
                <span className="text-white font-bold text-sm">
                  nssc.mumbai@gmail.com
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-brand flex-shrink-0 mt-0.5" />
                <span className="text-white font-bold text-sm">
                  Mumbai, Maharashtra,
                  <br />
                  India — 400001
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-amber-brand flex-shrink-0 mt-0.5" />
                <span className="text-white font-bold text-sm">
                  Pan India Coverage — 45+ Cities
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white font-bold text-sm">
            © {currentYear} NSS Consultancy. All rights reserved.
          </p>
          <p className="text-white font-bold text-sm">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-brand transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ===== MAIN APP =====
export default function App() {
  return (
    <div className="min-h-screen">
      <Toaster position="top-right" richColors />
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <WhyChooseUsSection />
        <ProcessSection />
        <IndustriesSection />
        <StatsBanner />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
