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

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px)");
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
          "AI-Powered UI/UX Review",
          "SEO & Performance Insights",
          "Advanced Grammar Check",
          "Brand Consistency Audit",
          "Unlimited Tool Access",
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
          "Unlimited Projects",
          "All Pro Plan Features",
          "Enterprise Security",
          "Custom API Access",
          "Priority Support",
          "Dedicated Account Manager",
          "SLA Guarantees",
        ],
        description: "",
        buttonText: "Get Started Now",
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
    <div className={cn("w-full py-2 md:py-10", className)}>
      <div className="text-center space-y-3 mb-8 md:mb-14">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          Simple, Transparent Pricing
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground whitespace-pre-line max-w-2xl mx-auto px-6">
          Choose the plan that works for you{"\n"}
          All plans include access to our platform, lead generation tools, and
          dedicated support.
        </p>
      </div>

      <div className="flex justify-center mb-10 md:mb-20">
        <div className="flex items-center p-1 bg-gray-100 border rounded-lg scale-90 md:scale-95">
          <button
            onClick={() => handleToggle("monthly")}
            className={cn(
              "relative px-6 py-2 text-sm font-semibold transition-all duration-200 z-10",
              isMonthly ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {isMonthly && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-white rounded-md shadow-sm -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            Monthly
          </button>
          <button
            onClick={() => handleToggle("yearly")}
            className={cn(
              "relative px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200 flex items-center gap-2 z-10",
              !isMonthly ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {!isMonthly && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-white rounded-md shadow-sm -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            Yearly{" "}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {loadingPlans
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[450px] -2xl bg-muted/10 animate-pulse border"
              />
            ))
          : plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={
                  isDesktop
                    ? {
                        y: plan.isPopular ? -20 : 0,
                        opacity: 1,
                        x: 0,
                        scale: index === 0 || index === 2 ? 0.98 : 1.0,
                      }
                    : isTablet
                      ? { y: 0, opacity: 1, x: 0, scale: 1 }
                      : { y: 0, opacity: 1 }
                }
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100,
                  damping: 30,
                  delay: isTablet ? index * 0.1 : 0,
                }}
                className={cn(
                  `rounded-xl border-[1px] p-6 md:p-6 lg:p-10 text-center flex flex-col h-full bg-background relative min-h-[550px]`,
                  plan.isPopular
                    ? "border-[#f7f4ed] border-2 shadow-xl z-20"
                    : "border-border z-10",
                  !plan.isPopular && "mt-0 md:mt-4",
                  index === 0 || index === 2
                    ? isDesktop
                      ? "z-0 transform translate-x-0 translate-y-0 -translate-z-[30px] rotate-y-[6deg]"
                      : ""
                    : "",
                  index === 0 && isDesktop && "origin-right",
                  index === 2 && isDesktop && "origin-left",
                )}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#fa752d] flex items-center py-1 h-6 px-4 z-30 whitespace-nowrap rounded-full">
                    <span className="text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="flex flex-col items-start text-left">
                  <p
                    className={cn(
                      "text-xl sm:text-2xl font-bold",
                      "text-foreground",
                    )}
                  >
                    {plan.name}
                  </p>
                  <div className="mt-1 md:mt-2 flex items-end gap-x-1 flex-wrap">
                    <span className="text-lg sm:text-xl font-bold self-center mt-1">
                      $
                    </span>
                    <span
                      className={cn(
                        "text-4xl sm:text-5xl font-extrabold tracking-tight",
                        "text-foreground",
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
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
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
                          "text-[9px] md:text-xs font-semibold leading-tight mb-1",
                          "text-muted-foreground whitespace-nowrap",
                        )}
                      >
                        {isMonthly ? "per month" : "per year"}
                      </span>
                    )}
                  </div>
                  <hr className="w-full mt-4 border-gray-100" />
                  <button
                    onClick={() => handlePayment(plan)}
                    className={cn(
                      buttonVariants({
                        variant: plan.isPopular ? "default" : "outline",
                      }),
                      "mt-6 group relative w-full h-11 md:h-10 lg:h-12 gap-2 overflow-hidden text-sm md:text-xs lg:text-base font-semibold tracking-wide cursor-pointer",
                      "transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-offset-1 hover:scale-[1.01]",
                      plan.isPopular
                        ? "bg-[#fa752d] text-white hover:bg-[#FF4F00]/90 ring-[#FF4F00]"
                        : "bg-transparent text-[#0a0a0a] border-[1px] md:border-2 hover:bg-[#fa752d] hover:text-white ring-[#FF4F00]",
                    )}
                  >
                    {loading === plan.monthlyPlanId ||
                    loading === plan.yearlyPlanId ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      plan.buttonText
                    )}
                  </button>
                  <ul className="gap-3 py-4 flex flex-col flex-1 justify-center">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check
                          className={cn(
                            "h-4 w-4 mt-0.5 flex-shrink-0",
                            "text-green-500",
                          )}
                        />
                        <span
                          className={cn(
                            "text-left text-sm text-muted-foreground",
                            "text-muted-foreground",
                          )}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <p
                    className={cn(
                      "mt-2 text-[9px] sm:text-[10px] leading-4",
                      plan.isPopular
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground",
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
