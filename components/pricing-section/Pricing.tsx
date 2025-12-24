"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase-client";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";

// --- Types ---

interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string; // Kept for type compatibility, used for fallback
  isPopular: boolean;

  // Backend props
  id: string;
  monthlyPlanId: string;
  yearlyPlanId: string;
  monthlyPriceNum: number;
  yearlyPriceNum: number;
  currency: string;
  canPurchase: boolean;
}

interface PricingSectionProps {
  currentPlanType?: string;
  currentPlanId?: string;
  currentBillingCycle?: string;
  planExpiresAt?: string;
  showBillingToggle?: boolean;
  showCurrentPlanHighlight?: boolean;
  className?: string;
}

export default function PricingSection({
  currentPlanType,
  currentPlanId,
  currentBillingCycle,
  planExpiresAt,
  showBillingToggle = true,
  showCurrentPlanHighlight = false,
  className = "",
}: PricingSectionProps) {
  // --- State ---
  const [isMonthly, setIsMonthly] = useState(true);
  const [loading, setLoading] = useState<string | null>(null);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);

  // --- Helpers ---
  const convertFeaturesToArray = useCallback((features: unknown): string[] => {
    if (!Array.isArray(features)) return [];
    const result: string[] = [];
    features.forEach((feature: unknown) => {
      if (feature && typeof feature === "object" && "heading" in feature) {
        // @ts-ignore
        result.push(feature.heading);
      } else if (typeof feature === "string") {
        const trimmed = feature.trim();
        if (
          (trimmed.startsWith("{") || trimmed.startsWith("[")) &&
          trimmed.endsWith("}")
        ) {
          try {
            const parsed = JSON.parse(trimmed);
            if (parsed.heading) result.push(parsed.heading);
            else if (parsed.name) result.push(parsed.name);
          } catch {
            result.push(feature);
          }
        } else {
          result.push(feature);
        }
      }
    });
    return result.slice(0, 8);
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // --- Data Fetching ---
  useEffect(() => {
    // Static plans matching the user's provided design/content
    const staticPlans: PricingPlan[] = [
      {
        name: "Free",
        price: "0",
        yearlyPrice: "0",
        period: "forever",
        features: [
          "Single-Page Website Crawl",
          "Limit: 1 Project",
          "Technical SEO Analysis",
          "Image & Link Health Check",
          "UI/UX Quality Review",
          "Accessibility Audit",
          "Broken Links Check",
        ],
        description: "",
        buttonText: "Get Started Free",
        href: "#",
        isPopular: false,
        id: "free",
        monthlyPlanId: "free_monthly",
        yearlyPlanId: "free_yearly",
        monthlyPriceNum: 0,
        yearlyPriceNum: 0,
        currency: "USD",
        canPurchase: false,
      },
      {
        name: "Pro Plan",
        price: "20",
        yearlyPrice: "1188",
        period: "per year",
        features: [
          "Multi-Page Website Crawling",
          "Up to 10 Active Projects",
          "AI-Powered UI/UX Quality Review",
          "SEO & Performance Insights",
          "Advanced Grammar Inspection",
          "Brand Consistency Audit",
          "Unlimited Access to All Tools & Features",
        ],
        description: "",
        buttonText: "Get Started Now",
        href: "#",
        isPopular: true,
        id: "pro",
        monthlyPlanId: "pro_monthly",
        yearlyPlanId: "pro_yearly",
        monthlyPriceNum: 20,
        yearlyPriceNum: 1188,
        currency: "USD",
        canPurchase: true,
      },
      {
        name: "Enterprise Plan",
        price: "159",
        yearlyPrice: "1908",
        period: "per year",
        features: [
          "Unlimited Projects & Workspaces",
          "Includes All Pro Features",
        ],
        description: "",
        buttonText: "Contact Sales",
        href: "#",
        isPopular: false,
        id: "enterprise",
        monthlyPlanId: "enterprise_monthly",
        yearlyPlanId: "enterprise_yearly",
        monthlyPriceNum: 159,
        yearlyPriceNum: 1908,
        currency: "USD",
        canPurchase: true,
      },
    ];

    setPlans(staticPlans);
    setLoadingPlans(false);
  }, [currentPlanType]);

  // --- Handlers ---
  const handleToggle = (period: "monthly" | "yearly") => {
    const isNowMonthly = period === "monthly";
    setIsMonthly(isNowMonthly);
    if (!isNowMonthly && !hasTriggeredConfetti) {
      setHasTriggeredConfetti(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: [
          "hsl(var(--primary))",
          "hsl(var(--accent))",
          "hsl(var(--secondary))",
          "hsl(var(--muted))",
        ],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  const handlePayment = async (plan: PricingPlan) => {
    const planId = isMonthly ? plan.monthlyPlanId : plan.yearlyPlanId;
    const price = isMonthly ? plan.monthlyPriceNum : plan.yearlyPriceNum;

    if (!planId) return;
    if (price === 0) {
      alert("Selected free plan.");
      return;
    }

    setLoading(planId);
    try {
      const isReady = await loadRazorpayScript();
      if (!isReady) throw new Error("Payment gateway failed");

      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(price * 100),
          currency: plan.currency,
          receipt: `rec_${Date.now()}`,
          plan_id: planId,
        }),
      });

      if (!orderRes.ok) throw new Error("Order creation failed");
      const orderData = await orderRes.json();

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: orderData.id,
        name: "Web Audit Pro",
        description: `${plan.name}`,
        image: "/logo.png",
        theme: { color: "#000000" },
        handler: async (response: any) => {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          await fetch("/api/payment-success", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.access_token || ""}`,
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              plan_id: planId,
              amount: price,
              currency: plan.currency,
            }),
          });
          window.location.reload();
        },
        modal: { ondismiss: () => setLoading(null) },
      });
      rzp.open();
    } catch (e: any) {
      console.error(e);
      alert(e.message);
      setLoading(null);
    }
  };

  // --- Render (Exact match to provided visual code) ---
  return (
    <div className={cn("container py-20", className)}>
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Simple, Transparent Pricing
        </h2>
        <p className="text-muted-foreground text-lg whitespace-pre-line">
          Choose the plan that works for you{"\n"}
          All plans include access to our platform, lead generation tools, and
          dedicated support.
        </p>
      </div>

      <div className="flex justify-center mb-10">
        <div className="flex items-center p-1 bg-gray-100 border">
          <button
            onClick={() => handleToggle("monthly")}
            className={cn(
              "relative px-6 py-2 text-sm font-semibold transition-all duration-200 z-10",
              isMonthly ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {isMonthly && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-white -sm -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            Monthly
          </button>
          <button
            onClick={() => handleToggle("yearly")}
            className={cn(
              "relative px-6 py-2 -full text-sm font-semibold transition-all duration-200 flex items-center gap-2 z-10",
              !isMonthly ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {!isMonthly && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-white -full -sm -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            Yearly{" "}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 pt-6 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {loadingPlans
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-96 -2xl bg-muted/10 animate-pulse border"
              />
            ))
          : plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 1 }}
                whileInView={
                  isDesktop
                    ? {
                        y: plan.isPopular ? -20 : 0,
                        opacity: 1,
                        x: index === 2 ? -30 : index === 0 ? 30 : 0,
                        scale: index === 0 || index === 2 ? 0.94 : 1.0,
                      }
                    : {}
                }
                viewport={{ once: true }}
                transition={{
                  duration: 1.6,
                  type: "spring",
                  stiffness: 100,
                  damping: 30,
                  delay: 0.4,
                  opacity: { duration: 0.5 },
                }}
                className={cn(
                  `-2xl border-[1px] p-8 text-center lg:flex lg:flex-col lg:justify-center relative bg-background`,
                  plan.isPopular
                    ? "border-[#f7f4ed] border-2 -2xl z-20"
                    : "border-border z-10",
                  "flex flex-col",
                  !plan.isPopular && "mt-5",
                  index === 0 || index === 2
                    ? "z-0 transform translate-x-0 translate-y-0 -translate-z-[50px] rotate-y-[10deg]"
                    : "",
                  index === 0 && "origin-right",
                  index === 2 && "origin-left"
                )}
              >
                {plan.isPopular && (
                  <div className="absolute -top-[12px] left-1/2 -translate-x-1/2 bg-[#fa752d] py-0.5 px-3 rounded-sm z-30 shadow-sm">
                    <span className="text-white font-bold text-xs tracking-wide">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="flex-1 flex flex-col items-start text-left">
                  <p className={cn("text-base font-bold", "text-foreground")}>
                    {plan.name}
                  </p>
                  <div className="mt-4 flex items-end gap-x-1">
                    <span className="text-xl font-bold self-start mt-2">$</span>
                    <span
                      className={cn(
                        "text-5xl font-extrabold tracking-tight",
                        "text-foreground"
                      )}
                    >
                      {plan.monthlyPriceNum === 0 ? (
                        "Free"
                      ) : (
                        <NumberFlow
                          value={
                            isMonthly
                              ? Number(plan.price)
                              : Number(plan.yearlyPrice)
                          }
                          format={{
                            style: "decimal",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }}
                          transformTiming={{
                            duration: 500,
                            easing: "ease-out",
                          }}
                          willChange
                          className="font-variant-numeric: tabular-nums"
                        />
                      )}
                    </span>
                    {plan.monthlyPriceNum !== 0 && (
                      <span
                        className={cn(
                          "text-sm font-semibold leading-6 mb-1.5",
                          "text-muted-foreground"
                        )}
                      >
                        {isMonthly ? "per month" : "per year"}
                      </span>
                    )}
                  </div>
                  <hr className="w-full border-gray-100" />
                  <button
                    onClick={() => handlePayment(plan)}
                    className={cn(
                      buttonVariants({
                        variant: plan.isPopular ? "default" : "outline",
                      }),
                      "mt-6 group relative w-full gap-2 overflow-hidden text-lg font-semibold tracking-tighter cursor-pointer",
                      "transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-offset-1 hover:scale-[1.02]",
                      plan.isPopular
                        ? "bg-[#fa752d] text-white hover:bg-[#FF4F00]/90 ring-[#FF4F00]"
                        : "bg-transparent text-[#0a0a0a] border-2 hover:bg-[#fa752d] hover:text-white ring-[#FF4F00]"
                    )}
                  >
                    {loading === plan.monthlyPlanId ||
                    loading === plan.yearlyPlanId ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      plan.buttonText
                    )}
                  </button>

                  <hr className="w-full my-6 border-gray-100" />

                  <ul className="gap-3 flex flex-col">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check
                          className={cn(
                            "h-4 w-4 mt-1 flex-shrink-0",
                            "text-foreground"
                          )}
                        />
                        <span
                          className={cn(
                            "text-left text-sm",
                            "text-muted-foreground"
                          )}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <p
                    className={cn(
                      "mt-6 text-xs leading-5",
                      plan.isPopular
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  >
                    {plan.description}
                  </p>
                </div>
              </motion.div>
            ))}
      </div>
    </div>
  );
}
