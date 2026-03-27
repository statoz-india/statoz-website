type TrackPlaystoreClickOptions = {
  eventLabel?: string;
  link_url?: string;
};

export function trackPlaystoreClick({
  eventLabel,
  link_url,
}: TrackPlaystoreClickOptions) {
  if (typeof window === "undefined") return;

  const gtag = (
    window as Window & {
      gtag?: (...args: unknown[]) => void;
    }
  ).gtag;

  if (typeof gtag !== "function") return;

  const urlParams = new URLSearchParams(window.location.search);
  const userAgent = navigator.userAgent.toLowerCase();
  const deviceType = /android|iphone|ipad|ipod|mobile/.test(userAgent)
    ? "mobile"
    : "desktop";

  gtag("event", "playstore_click", {
    event_category: "engagement",
    event_label: eventLabel ?? "hero_playstore_button",
    link_url:
      link_url ??
      "https://play.google.com/store/apps/details?id=com.statoz.app",
    page_location: window.location.href,
    page_path: window.location.pathname,
    utm_source: urlParams.get("utm_source") || "(not set)",
    utm_medium: urlParams.get("utm_medium") || "(not set)",
    utm_campaign: urlParams.get("utm_campaign") || "(not set)",
    utm_term: urlParams.get("utm_term") || "(not set)",
    utm_content: urlParams.get("utm_content") || "(not set)",
    device_type: deviceType,
  });
}
