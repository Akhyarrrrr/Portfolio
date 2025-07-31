"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React, { useRef, useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => setStatus("idle"), 1000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatus("loading");

    const formData = new FormData(formRef.current!);

    const data = {
      from_name: formData.get("from_name"),
      from_email: formData.get("from_email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        formRef.current?.reset();
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <section
      id="contact"
      className="min-h-screen bg-[#0B0F15] flex items-center justify-center px-4 py-12 relative"
    >
      <div
        className="w-full max-w-6xl bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-10 md:p-16 border border-white/10"
        data-aos="zoom-out-up"
        data-aos-duration="2000"
      >
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
              ref={formRef}
              className="flex flex-col gap-5 relative"
              onSubmit={sendEmail}
            >
              <div className="flex gap-4 flex-col md:flex-row">
                <input
                  type="text"
                  name="from_name"
                  placeholder="Your Name"
                  required
                  className="flex-1 px-5 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#61DCA3] transition"
                  disabled={status === "loading"}
                />
                <input
                  type="email"
                  name="from_email"
                  placeholder="Your Email"
                  required
                  className="flex-1 px-5 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#61DCA3] transition"
                  disabled={status === "loading"}
                />
              </div>
              <textarea
                name="message"
                placeholder="Your Message"
                required
                rows={4}
                className="px-5 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#61DCA3] transition resize-none"
                disabled={status === "loading"}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#61DCA3] to-[#2B4539] text-[#0B0F15] font-bold text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-[#0B0F15]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Message 🚀"
                )}
              </button>

              {/* Alert kecil muncul di bawah tombol */}
              {(status === "success" || status === "error") && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className={`mt-3 px-4 py-2 rounded-md w-full text-sm font-semibold
                    ${
                      status === "success"
                        ? "bg-green-100 text-green-800 border border-green-400"
                        : "bg-red-100 text-red-700 border border-red-400"
                    }
                    animate-fade-in-up
                  `}
                  style={{ pointerEvents: "none" }}
                >
                  {status === "success"
                    ? "Message sent successfully!"
                    : "Failed to send message. Please try again."}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease forwards;
        }
      `}</style>
    </section>
  );
}
