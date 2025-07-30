"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React from "react";

export default function Contact() {
  return (
    <section
      id="contact"
      className="min-h-screen bg-[#0B0F15] flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-6xl bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-10 md:p-16 border border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Lottie Animation */}
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="w-[220px] h-[220px] md:w-[320px] md:h-[320px] lg:w-[400px] lg:h-[400px]">
              <DotLottieReact
                src="/assets/icons/Contact us.lottie"
                loop
                autoplay
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
              Let's Connect!
            </h2>
            <p className="text-white/70 mb-8 text-lg">
              Have a project, idea, or just want to say hi? Fill the form below
              and I'll get back to you soon!
            </p>
            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for reaching out!");
              }}
            >
              <div className="flex gap-4 flex-col md:flex-row">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="flex-1 px-5 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#61DCA3] transition"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  className="flex-1 px-5 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#61DCA3] transition"
                />
              </div>
              <textarea
                placeholder="Your Message"
                required
                rows={4}
                className="px-5 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#61DCA3] transition resize-none"
              />
              <button
                type="submit"
                className="mt-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#61DCA3] to-[#2B4539] text-[#0B0F15] font-bold text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200"
              >
                Send Message 🚀
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
