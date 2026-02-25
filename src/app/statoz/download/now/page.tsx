"use client";

import { useEffect } from "react";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.statoz.app";

export default function DownloadNowPage() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.replace(PLAY_STORE_URL);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "12px",
        background: "#070b1f",
        color: "#ffffff",
        fontFamily: "var(--font-jakarta)",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "9999px",
          border: "4px solid rgba(255,255,255,0.25)",
          borderTopColor: "#22c55e",
          animation: "statoz-spin 0.8s linear infinite",
        }}
      />
      <p style={{ margin: 0, fontSize: "16px" }}>Redirecting to Google Play...</p>

      <noscript>
        <meta httpEquiv="refresh" content={`1;url=${PLAY_STORE_URL}`} />
      </noscript>

      <a
        href={PLAY_STORE_URL}
        style={{ color: "#86efac", fontSize: "14px", textDecoration: "underline" }}
      >
        Continue manually
      </a>

      <style jsx>{`
        @keyframes statoz-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}