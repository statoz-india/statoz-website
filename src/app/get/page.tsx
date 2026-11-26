import type { Metadata } from "next";
import BlogChrome from "@/components/BlogChrome";
import { ROUTES } from "@/lib/routes";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/storeLinks";

/* The device redirect behind download.statoz.in: iPhone, iPad and iPod go to
   the App Store, every other device to Google Play. It runs in the browser so
   the page stays static (and works in the GitHub Pages export). Blocked in
   robots.txt and noindex: it is a redirect, not content. */

export const metadata: Metadata = {
  title: "Get StatOz",
  robots: { index: false, follow: false },
  alternates: { canonical: ROUTES.download },
};

const REDIRECT = `(function(){var ua=navigator.userAgent||"";var apple=/iPhone|iPad|iPod/i.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1);location.replace(apple?${JSON.stringify(APP_STORE_URL)}:${JSON.stringify(PLAY_STORE_URL)});})();`;

export default function GetPage() {
  return (
    <BlogChrome>
      <script dangerouslySetInnerHTML={{ __html: REDIRECT }} />
      <section className="blog-hero">
        <div className="wrap">
          <span className="blog-kicker">// GET THE APP</span>
          <h1>
            Opening your <span className="grad">app store…</span>
          </h1>
          <p>
            If nothing happens, choose your store:{" "}
            <a href={PLAY_STORE_URL}>Google Play</a> or{" "}
            <a href={APP_STORE_URL}>App Store</a>.
          </p>
        </div>
      </section>
    </BlogChrome>
  );
}
