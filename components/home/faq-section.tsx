"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How does the audit process work?",
    answer:
      "Our AI-powered engine scans your website URL to identify performance bottlenecks, SEO issues, accessibility errors, and security vulnerabilities. It generates a comprehensive report with actionable fixes in seconds.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes! You can run a basic audit on your homepage for free. For advanced features like multi-page scanning, automated monitoring, and team collaboration, you can upgrade to our Pro plans.",
  },
  {
    question: "Can I audit client websites?",
    answer:
      "Yes! Our tool is perfect for agencies and freelancers. You can generate professional reports to share with clients, helping you demonstrate value and prioritize their website improvements.",
  },
  {
    question: "Do you offer support implementation?",
    answer:
      "Our Enterprise plan includes dedicated support for implementation. For other plans, we provide detailed documentation and a community forum where you can get help from our team and other users.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full py-8 md:py-12 relative" id="faq">
      <div className="relative z-10 w-full bg-white/90 backdrop-blur-sm -xl shadow-2xl overflow-hidden border border-white/20 p-6 sm:p-10 lg:p-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-jakarta text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600">
            Everything you need to know about Auditly360
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-100/30 bg-white/60 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-orange-200 -2xl shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-gray-900 font-jakarta pr-8">
                  {faq.question}
                </span>
                <span
                  className={`flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  {openIndex === index ? (
                    <Minus size={20} className="text-orange-500" />
                  ) : (
                    <Plus size={20} className="text-gray-400" />
                  )}
                </span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
