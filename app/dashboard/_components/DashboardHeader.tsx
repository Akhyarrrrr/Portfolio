"use client";

import type { ReactNode } from "react";
import { FiArrowLeft } from "react-icons/fi";

type DashboardHeaderProps = {
  icon: ReactNode;
  title: string;
  onBack: () => void;
};

export default function DashboardHeader({
  icon,
  title,
  onBack,
}: DashboardHeaderProps) {
  return (
    <div className="mb-8 flex flex-row items-start justify-between gap-4 sm:items-center">
      <div className="flex items-center gap-4">
        <div className="rounded-lg bg-gradient-to-br from-[#61DCA3] to-emerald-500 p-3">
          {icon}
        </div>
        <h1 className="text-xl font-bold tracking-tight md:text-3xl">{title}</h1>
      </div>
      <button
        onClick={onBack}
        className="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-700 px-4 py-2 font-semibold text-white transition-colors duration-300 hover:bg-gray-600"
      >
        <FiArrowLeft />
        <span>Back</span>
      </button>
    </div>
  );
}
