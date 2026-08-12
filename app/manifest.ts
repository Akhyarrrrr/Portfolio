import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Akhyar's Portfolio",
    short_name: "Akhyar",
    description:
      "Full-stack engineer building production systems with React, Next.js, and Node.js.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0F15",
    theme_color: "#0B0F15",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
