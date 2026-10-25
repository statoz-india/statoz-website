import { PLAY_STORE_URL } from "@/lib/storeLinks";

/* Smart download link: iPhone / iPad -> App Store, everything else -> Play Store.
   download.statoz.in points here through a Cloudflare redirect rule. */

const APP_STORE_URL = "https://apps.apple.com/us/app/statoz/id6761310455";

// The answer depends on the device, so never let a cache reuse it.
const NO_CACHE = { "Cache-Control": "no-store", Vary: "User-Agent" };

export function GET(request: Request) {
  const ua = request.headers.get("user-agent") ?? "";

  if (/iPhone|iPad|iPod/i.test(ua)) {
    return redirectTo(APP_STORE_URL);
  }

  // iPads on iPadOS 13+ report a Mac user agent, so only the browser can
  // tell them apart: an iPad has a touch screen, a Mac does not.
  if (/Macintosh/i.test(ua)) {
    return touchCheckPage();
  }

  return redirectTo(PLAY_STORE_URL);
}

function redirectTo(url: string) {
  return new Response(null, {
    status: 302,
    headers: { Location: url, ...NO_CACHE },
  });
}

function touchCheckPage() {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Get StatOz</title>
<script>
location.replace(navigator.maxTouchPoints > 1 ? ${JSON.stringify(APP_STORE_URL)} : ${JSON.stringify(PLAY_STORE_URL)});
</script>
</head>
<body style="font-family: system-ui, sans-serif; padding: 24px">
<p>Opening the store&hellip;</p>
<p><a href="${APP_STORE_URL}">App Store</a> &middot; <a href="${PLAY_STORE_URL}">Google Play</a></p>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex",
      ...NO_CACHE,
    },
  });
}
