import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Akhyar — Full-Stack Developer Portfolio";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          background: "#0B0F15",
          backgroundImage:
            "radial-gradient(circle at 75% 30%, rgba(97,220,163,0.16), transparent 45%)",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#61DCA3",
            letterSpacing: 2,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          Portfolio of shipped systems
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 88,
            fontWeight: 800,
            color: "#ffffff",
            display: "flex",
            flexDirection: "column",
            lineHeight: 1.05,
          }}
        >
          <span style={{ display: "flex" }}>Hey, I&apos;m</span>
          <span style={{ display: "flex", color: "#61DCA3" }}>Akhyar</span>
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 32,
            color: "rgba(255,255,255,0.65)",
            maxWidth: 900,
            display: "flex",
          }}
        >
          Full-stack engineer building reliable web systems from
          infrastructure to interface.
        </div>
      </div>
    ),
    { ...size },
  );
}
