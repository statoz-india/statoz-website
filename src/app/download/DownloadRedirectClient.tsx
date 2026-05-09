"use client";

import { useEffect, useState } from "react";

import { ANDROID_STORE_URL, IOS_STORE_URL } from "./storeUrls";

function detectPlatform(): "android" | "ios" | "desktop" {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || "";
  if (/Android/i.test(ua)) return "android";
  const isIPadDesktopUA =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  if (/iPhone|iPad|iPod/i.test(ua) || isIPadDesktopUA) return "ios";
  return "desktop";
}

export default function DownloadRedirectClient() {
  const [platform, setPlatform] = useState<"pending" | "android" | "ios" | "desktop">(
    "pending",
  );
  const [showManualHint, setShowManualHint] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let fallbackTimer: number | undefined;
    let removeListeners: (() => void) | undefined;

    const schedule =
      typeof queueMicrotask === "function"
        ? queueMicrotask
        : (fn: () => void) => {
            window.setTimeout(fn, 0);
          };

    schedule(() => {
      if (cancelled) return;

      const detected = detectPlatform();
      setPlatform(detected);

      if (detected === "desktop") return;

      const storeUrl =
        detected === "android" ? ANDROID_STORE_URL : IOS_STORE_URL;
      let navigatedAway = false;

      const onPageHide = () => {
        navigatedAway = true;
      };

      const onVisibilityChange = () => {
        if (document.visibilityState === "hidden") navigatedAway = true;
      };

      window.addEventListener("pagehide", onPageHide);
      document.addEventListener("visibilitychange", onVisibilityChange);

      removeListeners = () => {
        window.removeEventListener("pagehide", onPageHide);
        document.removeEventListener("visibilitychange", onVisibilityChange);
      };

      window.location.replace(storeUrl);

      fallbackTimer = window.setTimeout(() => {
        if (cancelled || navigatedAway) return;
        setShowManualHint(true);
      }, 2800);
    });

    return () => {
      cancelled = true;
      if (fallbackTimer !== undefined) {
        window.clearTimeout(fallbackTimer);
      }
      removeListeners?.();
    };
  }, []);

  const redirectLabel =
    platform === "android"
      ? "Google Play"
      : platform === "ios"
        ? "App Store"
        : null;

  return (
    <div className="text-center space-y-6">
      {platform !== "desktop" && platform !== "pending" && (
        <p className="text-white/80">
          {showManualHint
            ? "Still here?"
            : `Opening ${redirectLabel}…`}{" "}
          {showManualHint &&
            "Tap a store button below, or open the link from your browser menu."}
        </p>
      )}
      {(platform === "desktop" || platform === "pending") && (
        <p className="text-white/80">Download StatOz on your mobile device</p>
      )}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href={ANDROID_STORE_URL}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 0 1-.609-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
          </svg>
          <span>Google Play</span>
        </a>
        <a
          href={IOS_STORE_URL}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          <span>App Store</span>
        </a>
      </div>
    </div>
  );
}
