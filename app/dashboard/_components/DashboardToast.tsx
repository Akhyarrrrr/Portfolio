"use client";

type DashboardToastProps = {
  message: string | null;
};

export default function DashboardToast({ message }: DashboardToastProps) {
  if (!message) return null;

  return (
    <div
      className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-[#61dca3] bg-[#232537] px-6 py-3 text-lg font-bold text-[#61dca3] shadow-lg"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
