"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageProvider";
import { fadeUpMajor } from "@/lib/motion";

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={id} className="grid gap-2">
      <span className="text-sm font-medium text-white/72">{label}</span>
      {children}
    </label>
  );
}

export default function Contact() {
  const { t, lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "success" && status !== "error") return;
    // Errors carry a specific reason worth reading; give them longer than
    // the 3s a "sent!" confirmation needs.
    const timer = setTimeout(() => setStatus("idle"), status === "error" ? 8000 : 3000);
    return () => clearTimeout(timer);
  }, [status]);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorDetail(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_name: formData.get("from_name"),
          from_email: formData.get("from_email"),
          message: formData.get("message"),
          website: formData.get("website"),
        }),
      });

      if (!res.ok) {
        // The route distinguishes "Missing fields" (400), "Too many requests"
        // (429), "Email service is not configured" (500) and "Something went
        // wrong" (500). Throwing away the body collapsed all of them into one
        // generic banner and made the real failure unknowable from the UI.
        const detail = await res
          .json()
          .then((data: { message?: string }) => data?.message)
          .catch(() => null);
        throw new Error(detail || `Request failed (${res.status})`);
      }

      setStatus("success");
      formRef.current?.reset();
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setErrorDetail(error instanceof Error ? error.message : null);
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/28 focus:border-[#61DCA3]/55 focus:ring-2 focus:ring-[#61DCA3]/20 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <section
      id="contact"
      className="relative z-10 flex min-h-[100dvh] items-center justify-center bg-[#0B0F15] px-4 py-28 sm:px-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(97,220,163,0.05)_0%,transparent_70%)]"
      />

      <div className="w-full max-w-6xl">
        <motion.div
          className="mb-12 text-center"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.42 }}
          variants={fadeUpMajor}
        >
          <h2 className="font-accent text-4xl font-medium tracking-tight text-white">
            {t("contact.heading")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/45">
            {t("contact.sub")}
          </p>
        </motion.div>

        <motion.div
          className="rounded-xl border border-white/8 bg-white/[0.035] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10 md:p-12"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUpMajor}
        >
          <div className="grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr]">
            <div className="flex justify-center">
              <div className="h-48 w-48 md:h-72 md:w-72 lg:h-80 lg:w-80">
                <DotLottieReact
                  src="/assets/icons/Contact us.lottie"
                  loop={!reduceMotion}
                  autoplay={!reduceMotion}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>

            <form
              ref={formRef}
              className="grid gap-4"
              onSubmit={sendEmail}
            >
              {/* Honeypot — hidden from real users, bots that auto-fill every
                  field trip it. aria-hidden + tabIndex keep it out of the a11y
                  tree and tab order.
                  Named "website", not "company": `company` maps to Chrome's
                  ORGANIZATION autofill type, and autoComplete="off" is widely
                  ignored for address fields — a real visitor's browser could
                  fill it, and the route silently no-ops a tripped honeypot
                  while reporting success. No autofill profile targets this. */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="from_name" label={t("contact.name")}>
                  <input
                    id="from_name"
                    type="text"
                    name="from_name"
                    placeholder={lang === "id" ? "Nama kamu" : "Your name"}
                    required
                    disabled={status === "loading"}
                    className={inputClass}
                  />
                </Field>
                <Field id="from_email" label={t("contact.email")}>
                  <input
                    id="from_email"
                    type="email"
                    name="from_email"
                    placeholder="hello@example.com"
                    required
                    disabled={status === "loading"}
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field id="message" label={t("contact.message")}>
                <textarea
                  id="message"
                  name="message"
                  placeholder={
                    lang === "id"
                      ? "Ceritakan sistem yang ingin kamu bangun."
                      : "Tell me what you are building."
                  }
                  required
                  rows={5}
                  disabled={status === "loading"}
                  className={`${inputClass} resize-none`}
                />
              </Field>

              <motion.button
                type="submit"
                disabled={status === "loading"}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#61DCA3] px-8 py-3 text-sm font-semibold text-[#0B0F15] shadow-[0_0_20px_rgba(97,220,163,0.28)] transition-all duration-200 hover:bg-[#4ecf96] hover:shadow-[0_0_32px_rgba(97,220,163,0.42)] disabled:cursor-not-allowed disabled:opacity-55"
              >
                {status === "loading" ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    {t("contact.sending")}
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    {t("contact.send")}
                  </>
                )}
              </motion.button>

              <AnimatePresence>
                {(status === "success" || status === "error") && (
                  <motion.div
                    role="alert"
                    aria-live="assertive"
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                    className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
                      status === "success"
                        ? "border border-[#61DCA3]/30 bg-[#61DCA3]/10 text-[#61DCA3]"
                        : "border border-red-500/30 bg-red-500/10 text-red-400"
                    }`}
                  >
                    {status === "success" ? (
                      <>
                        <CheckCircle size={16} />
                        {t("contact.success")}
                      </>
                    ) : (
                      <>
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{errorDetail || t("contact.error")}</span>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
