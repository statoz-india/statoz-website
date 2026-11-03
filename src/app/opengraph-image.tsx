import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "StatOz – the free sports prediction game";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const icon = await readFile(
    join(process.cwd(), "public/assets/brand/app-icon.png"),
  );
  const iconSrc = `data:image/png;base64,${icon.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 88px",
          background:
            "radial-gradient(circle at 85% 15%, #0e3a4a 0%, #06080f 55%)",
          color: "#f4f7ff",
          fontFamily: "sans-serif",
        }}
      >
        <img src={iconSrc} width={280} height={280} alt="" style={{ borderRadius: 56 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 88, fontWeight: 800, letterSpacing: -2 }}>
            StatOz
          </div>
          <div style={{ fontSize: 44, fontWeight: 700, color: "#5cdfff" }}>
            Predict every match.
          </div>
          <div style={{ fontSize: 30, color: "#a9b3c9", maxWidth: 640 }}>
            The free sports prediction game. World Cup 2026, EPL, IPL & more.
            No cash. Just skill.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
