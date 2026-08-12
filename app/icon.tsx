import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0F15",
          color: "#61DCA3",
          fontSize: 18,
          fontWeight: 800,
        }}
      >
        Y.
      </div>
    ),
    { ...size },
  );
}
