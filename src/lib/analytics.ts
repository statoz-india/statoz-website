export type AnalyticsEventName =
  | "download_cta_click"
  | "section_view"
  | "blog_post_click";

export type AnalyticsParams = Record<
  string,
  string | number | boolean | null | undefined
>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: "event",
      eventName: AnalyticsEventName,
      params?: Record<string, string | number | boolean>,
    ) => void;
  }
}

export function trackEvent(
  eventName: AnalyticsEventName,
  params: AnalyticsParams = {},
) {
  if (typeof window === "undefined") {
    return;
  }

  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value != null && value !== ""),
  ) as Record<string, string | number | boolean>;

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, cleanParams);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(["event", eventName, cleanParams]);
}
