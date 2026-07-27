import { ImageResponse } from "next/og";
import { getProjectBySlug } from "@/lib/firestoreServer";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const title = project?.title_en || project?.title || "Project";
  const tech = (project?.tech ?? []).slice(0, 5);

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
            "radial-gradient(circle at 25% 25%, rgba(97,220,163,0.14), transparent 45%)",
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#61DCA3",
            letterSpacing: 2,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          Case Study
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 76,
            fontWeight: 800,
            color: "#ffffff",
            display: "flex",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        {tech.length > 0 && (
          <div style={{ marginTop: 40, display: "flex", gap: 12 }}>
            {tech.map((t) => (
              <div
                key={t}
                style={{
                  fontSize: 24,
                  color: "rgba(255,255,255,0.75)",
                  border: "1px solid rgba(97,220,163,0.35)",
                  borderRadius: 12,
                  padding: "8px 20px",
                  display: "flex",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        )}
        <div
          style={{
            marginTop: 48,
            fontSize: 28,
            color: "#61DCA3",
            fontWeight: 700,
            display: "flex",
          }}
        >
          akhyar.dev
        </div>
      </div>
    ),
    { ...size },
  );
}
