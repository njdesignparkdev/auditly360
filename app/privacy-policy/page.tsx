"use client";

import React from "react";
import Link from "next/link";
import { Footer } from "@/components/footer-section/Footer";
import GridOverlay from "@/components/ui/grid-layer";
import BgContainer from "../home-page-components/bg-container";
import Navbar from "@/components/navbar/navbar-dropdown";
import privacyData from "./privacy.json";

export default function PrivacyPage() {
  return (
    <BgContainer>
      <GridOverlay />
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
              {privacyData.title}
            </h1>

            <div className="prose max-w-none space-y-6 md:space-y-8">
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                <strong>Last Updated:</strong> {privacyData.lastUpdated}
              </p>

              {privacyData.sections.map((section) => (
                <section key={section.id}>
                  <h2 className="text-xl md:text-2xl font-semibold text-[#fa752d] mb-4">
                    {section.heading}
                  </h2>
                  {section.content && (
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-3">
                      {section.id === "11" ? (
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
                  )}

                  {/* Subsections Logic (for "Information We Collect") */}
                  {section.subsections && (
                    <div className="space-y-3">
                      {section.subsections.map((sub, idx) => (
                        <div key={idx}>
                          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                            {sub.heading}
                          </h3>
                          <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-gray-700 ml-4">
                            {sub.list.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Standard Lists */}
                  {section.list && (
                    <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-gray-700 ml-4">
                      {section.list.map((item, index) => (
                        <li key={index}>
                          {item.includes("**") ? (
                            <>
                              <strong>{item.split("**")[1]}</strong>
                              {item.split("**")[2]}
                            </>
                          ) : (
                            item
                          )}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Footer Logic */}
                  {section.footer && (
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed mt-3">
                      {section.footer}
                    </p>
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </BgContainer>
  );
}
