"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent, type AnalyticsEventName } from "@/lib/analytics";

const SECTION_NAMES: Record<string, string> = {
  home: "Home",
  nations: "Nations",
  predict: "Predict",
  picks: "Picks",
  progression: "Progression",
  leaderboard: "Leaderboard",
  features: "Features",
  cards: "Cards",
  games: "Games",
  shop: "Shop",
  who: "Who For",
  download: "Download",
  faq: "FAQ",
};

const TRACKED_CLICK_EVENTS = new Set<AnalyticsEventName>([
  "download_cta_click",
  "blog_post_click",
]);

function currentPagePath() {
  return `${window.location.pathname}${window.location.search}`;
}

function linkDestination(element: HTMLElement) {
  const link = element.closest("a");
  return link instanceof HTMLAnchorElement ? link.href : undefined;
}

function fallbackLabel(element: HTMLElement) {
  return element.textContent?.replace(/\s+/g, " ").trim();
}

export default function AnalyticsEvents() {
  const pathname = usePathname();

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const trackedElement = target.closest<HTMLElement>(
        "[data-analytics-event]",
      );

      if (!trackedElement) {
        return;
      }

      const eventName = trackedElement.dataset
        .analyticsEvent as AnalyticsEventName;

      if (!TRACKED_CLICK_EVENTS.has(eventName)) {
        return;
      }

      if (eventName === "download_cta_click") {
        trackEvent(eventName, {
          cta_label:
            trackedElement.dataset.analyticsCtaLabel ||
            fallbackLabel(trackedElement),
          cta_location: trackedElement.dataset.analyticsCtaLocation,
          store: trackedElement.dataset.analyticsStore,
          destination_url: linkDestination(trackedElement),
          page_path: currentPagePath(),
        });
        return;
      }

      if (eventName === "blog_post_click") {
        trackEvent(eventName, {
          post_slug: trackedElement.dataset.analyticsPostSlug,
          post_title: trackedElement.dataset.analyticsPostTitle,
          destination_url: linkDestination(trackedElement),
          page_path: currentPagePath(),
        });
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      return;
    }

    const viewedSections = new Set<string>();
    const sections = Array.from(document.querySelectorAll("main section[id]"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target;

          if (!(section instanceof HTMLElement) || !entry.isIntersecting) {
            return;
          }

          const sectionId = section.id;

          if (!sectionId || viewedSections.has(sectionId)) {
            return;
          }

          viewedSections.add(sectionId);
          trackEvent("section_view", {
            section_id: sectionId,
            section_name:
              section.dataset.analyticsSectionName ||
              SECTION_NAMES[sectionId] ||
              sectionId,
            page_path: currentPagePath(),
          });
        });
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
