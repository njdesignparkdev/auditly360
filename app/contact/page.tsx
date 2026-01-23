"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/home/Footer-section";
import contactData from "./contact.json";

import GridOverlay from "@/components/ui/grid-layer";
import Navbar from "@/components/home/navbar-section";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitStatus({
        type: "success",
        message: contactData.form.messages.success,
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: contactData.form.messages.error,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GridOverlay>
      <Navbar />
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl mx-auto">
          <div className="p-6">
            {/* Back Button */}
            <Link
              href="/"
              className="inline-block text-sm md:text-base font-medium text-[#fa752d] hover:text-[#fa752d]/80 mb-6 md:mb-8 transition-colors"
            >
              {contactData.header.backButton}
            </Link>
            <div className="bg-white rounded-lg ">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#fa752d] mb-4 md:mb-6">
                {contactData.header.title}
              </h1>
              <p className="text-base md:text-lg text-gray-700 mb-8 md:mb-10">
                {contactData.header.description}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm md:text-base font-medium text-gray-700 mb-2"
                    >
                      {contactData.form.fields.name.label}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fa752d] focus:border-[#fa752d] outline-none transition-colors text-sm md:text-base"
                      placeholder={contactData.form.fields.name.placeholder}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm md:text-base font-medium text-gray-700 mb-2"
                    >
                      {contactData.form.fields.email.label}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fa752d] focus:border-[#fa752d] outline-none transition-colors text-sm md:text-base"
                      placeholder={contactData.form.fields.email.placeholder}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm md:text-base font-medium text-gray-700 mb-2"
                  >
                    {contactData.form.fields.subject.label}
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fa752d] focus:border-[#fa752d] outline-none transition-colors text-sm md:text-base bg-white"
                  >
                    <option value="">
                      {contactData.form.fields.subject.defaultOption}
                    </option>
                    {contactData.form.fields.subject.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm md:text-base font-medium text-gray-700 mb-2"
                  >
                    {contactData.form.fields.message.label}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fa752d] focus:border-[#fa752d] outline-none transition-colors resize-none text-sm md:text-base"
                    placeholder={contactData.form.fields.message.placeholder}
                  />
                </div>

                {submitStatus.type && (
                  <div
                    className={`p-4 rounded-lg ${
                      submitStatus.type === "success"
                        ? "bg-[#fa752d]/5 text-[#fa752d] border border-[#fa752d]/20"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-[#fa752d] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#fa752d]/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  {isSubmitting
                    ? contactData.form.submitButton.loading
                    : contactData.form.submitButton.idle}
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-gray-300">
            c
            <div className="p-6">
              <h2 className="text-xl md:text-2xl font-semibold text-[#fa752d] mb-6">
                {contactData.footer.title}
              </h2>
              <div className="space-y-4">
                {contactData.footer.sections.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
                      {section.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-700">
                      {section.content}
                      {section.email && (
                        <a
                          href={`mailto:${section.email}`}
                          className="text-[#fa752d] hover:text-[#fa752d]/80 underline"
                        >
                          {section.email}
                        </a>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </GridOverlay>
  );
}
