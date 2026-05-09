"use client";

import { useEffect } from "react";

const APP_DEEP_LINK = "statoz://open";
const ANDROID_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.statoz.app";
const IOS_STORE_URL = "https://apps.apple.com/in/app/statoz/id6761310455";
const WEB_FALLBACK_URL = "https://statoz.in";

export default function OpenAppRedirectClient() {
  useEffect(() => {
    const ua = navigator.userAgent || "";
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const fallbackUrl = isAndroid
      ? ANDROID_STORE_URL
      : isIOS
        ? IOS_STORE_URL
        : WEB_FALLBACK_URL;

    let appOpened = false;

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        appOpened = true;
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    const start = Date.now();
    window.location.href = APP_DEEP_LINK;

    const fallbackTimer = window.setTimeout(() => {
      if (appOpened) {
        return;
      }

      if (Date.now() - start >= 1200) {
        window.location.href = fallbackUrl;
      }
    }, 1500);

    return () => {
      window.clearTimeout(fallbackTimer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return null;
}
