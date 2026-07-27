"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React, { useRef, useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageProvider";

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 36, scale: 0.98 },
  visible: { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.6 } },
};

export default function Contact() {
  const { t, lang } = useLanguage();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => setStatus("idle"), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    const formData = new FormData(formRef.current!);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_name:  formData.get("from_name"),
          from_email: formData.get("from_email"),
          message:    formData.get("message"),
          company:    formData.get("company"),
        }),
      });
      if (res.ok) { setStatus("success"); formRef.current?.reset(); }
      else setStatus("error");
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setStatus("error");
    }
  };

  const badge = lang === "id" ? "Kontak" : "Contact";

  return (
    <section id="contact"
      className="relative z-10 flex min-h-screen items-center justify-center bg-[#0B0F15] px-4 pb-24 sm:px-6">

      {/* Ambient glow */}
      <div aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[600px] h-[600px] rounded-full
                   bg-[radial-gradient(circle,rgba(97,220,163,0.05)_0%,transparent_70%)]" />

      <div className="w-full max-w-6xl">
        {/* Section heading */}
        <motion.div className="text-center mb-12"
          initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-60px" }} variants={fadeUp}>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#61DCA3]/30 bg-[#61DCA3]/10 px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#61DCA3]" />
            <span className="text-xs text-[#61DCA3] font-medium uppercase tracking-widest">{badge}</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">{t("contact.heading")}</h2>
          <p className="mt-3 text-white/40 text-sm max-w-md mx-auto">{t("contact.sub")}</p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="rounded-3xl border border-white/8 bg-white/[0.03] backdrop-blur-xl
                     p-6 sm:p-10 md:p-14 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
          initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-60px" }} variants={fadeUp}>

          <div className="flex flex-col md:flex-row items-center gap-12">

            {/* Lottie illustration */}
            <div className="w-full md:w-[45%] flex justify-center">
              <div className="w-48 h-48 md:w-72 md:h-72 lg:w-80 lg:h-80">
                <DotLottieReact
                  src="/assets/icons/Contact us.lottie"
                  loop autoplay
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>

            {/* Form */}
            <div className="w-full md:w-[55%]">
              <form ref={formRef} className="flex flex-col gap-4" onSubmit={sendEmail}>

                {/* Honeypot — hidden from real users, bots that auto-fill every
                    field trip it. aria-hidden + tabIndex keep it out of the a11y
                    tree and tab order. */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />

                <div className="flex gap-4 flex-col sm:flex-row">
                  <input type="text" name="from_name"
                    placeholder={t("contact.name")} required
                    aria-label={t("contact.name")}
                    disabled={status === "loading"}
                    className="flex-1 px-4 py-3 rounded-xl text-sm
                               bg-white/5 border border-white/8 text-white
                               placeholder:text-white/30
                               focus:outline-none focus:border-[#61DCA3]/50 focus:ring-1 focus:ring-[#61DCA3]/30
                               disabled:opacity-50 transition-all duration-200" />
                  <input type="email" name="from_email"
                    placeholder={t("contact.email")} required
                    aria-label={t("contact.email")}
                    disabled={status === "loading"}
                    className="flex-1 px-4 py-3 rounded-xl text-sm
                               bg-white/5 border border-white/8 text-white
                               placeholder:text-white/30
                               focus:outline-none focus:border-[#61DCA3]/50 focus:ring-1 focus:ring-[#61DCA3]/30
                               disabled:opacity-50 transition-all duration-200" />
                </div>

                <textarea name="message"
                  placeholder={t("contact.message")} required rows={5}
                  aria-label={t("contact.message")}
                  disabled={status === "loading"}
                  className="px-4 py-3 rounded-xl text-sm
                             bg-white/5 border border-white/8 text-white
                             placeholder:text-white/30 resize-none
                             focus:outline-none focus:border-[#61DCA3]/50 focus:ring-1 focus:ring-[#61DCA3]/30
                             disabled:opacity-50 transition-all duration-200" />

                <button type="submit" disabled={status === "loading"}
                  className="flex items-center justify-center gap-2
                             px-8 py-3 rounded-xl text-sm font-semibold
                             bg-[#61DCA3] text-[#0B0F15]
                             shadow-[0_0_20px_rgba(97,220,163,0.3)]
                             hover:shadow-[0_0_32px_rgba(97,220,163,0.5)] hover:bg-[#4ecf96]
                             disabled:opacity-50 disabled:cursor-not-allowed
                             active:scale-95 transition-all duration-200 cursor-pointer">
                  {status === "loading" ? (
                    <><span className="h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />{t("contact.sending")}</>
                  ) : (
                    <><Send size={16} />{t("contact.send")}</>
                  )}
                </button>

                {/* Status feedback */}
                {(status === "success" || status === "error") && (
                  <motion.div
                    role="alert" aria-live="assertive"
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium
                                ${status === "success"
                                  ? "bg-[#61DCA3]/10 border border-[#61DCA3]/30 text-[#61DCA3]"
                                  : "bg-red-500/10 border border-red-500/30 text-red-400"
                                }`}
                    style={{ pointerEvents: "none" }}
                  >
                    {status === "success"
                      ? <><CheckCircle size={16} /> {t("contact.success")}</>
                      : <><AlertCircle size={16} /> {t("contact.error")}</>
                    }
                  </motion.div>
                )}
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
