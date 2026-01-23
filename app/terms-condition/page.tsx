"use client";

import React from "react";
import Link from "next/link";
import { Footer } from "@/components/home/Footer-section";
import GridOverlay from "@/components/ui/grid-layer";

import Navbar from "@/components/home/navbar-section";
import termsData from "./terms.json";

export default function TermsPage() {
  return (
    <GridOverlay>
      <Navbar />
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl p-6 mx-auto">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-block text-sm md:text-base font-medium text-[#fa752d] hover:text-[#fa752d]/80 mb-6 md:mb-8 transition-colors"
          >
            ← Back to Home
          </Link>
          <div className="bg-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#fa752d] mb-6 md:mb-8">
              {termsData.title}
            </h1>

            <div className="prose max-w-none space-y-6 md:space-y-8">
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                <strong>Last Updated:</strong> {termsData.lastUpdated}
              </p>

              {termsData.sections.map((section) => (
                <section key={section.id}>
                  <h2 className="text-xl md:text-2xl font-semibold text-[#fa752d] mb-4">
                    {section.heading}
                  </h2>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-3">
                    {section.id === "14" ? (
                      <>
                        {section.content.replace(" our contact page.", "")}{" "}
                        <Link
                          href="/contact"
                          className="text-[#fa752d] hover:text-[#fa752d]/80 underline"
                        >
                          our contact page
                        </Link>
                        .
                      </>
                    ) : (
                      section.content
                    )}
                  </p>
                  {section.list && (
                    <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-gray-700 ml-4">
                      {section.list.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.footer && (
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed mt-3">
                      {section.footer.includes("**") ? (
                        <>
                          <strong>{section.footer.split("**")[1]}</strong>
                          {section.footer.split("**")[2]}
                        </>
                      ) : (
                        section.footer
                      )}
                    </p>
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </GridOverlay>
  );
}
