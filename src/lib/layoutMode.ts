import { ROUTES } from "@/lib/routes";

/* The app's in-app webview opens these pages with `?layout=false` to hide the
   site header and footer. The pages stay static: a tiny script in the root
   layout's <head> sets <html data-layout="bare"> before first paint, and
   globals.css hides the chrome. LayoutModeSync keeps it right on client-side
   navigation. */

export const EMBEDDABLE_PATHS: readonly string[] = [
  ROUTES.faq,
  ROUTES.about,
  ROUTES.terms,
  ROUTES.privacy,
];

export function isBareLayout(pathname: string, layoutParam: string | null): boolean {
  return EMBEDDABLE_PATHS.includes(pathname) && layoutParam?.toLowerCase() === "false";
}

/* Same check as isBareLayout, as plain JS that runs before React loads. */
export const BARE_LAYOUT_SCRIPT = `(function(){try{var p=${JSON.stringify(
  EMBEDDABLE_PATHS,
)};var l=new URLSearchParams(location.search).get("layout");if(p.indexOf(location.pathname)>-1&&l&&l.toLowerCase()==="false")document.documentElement.setAttribute("data-layout","bare")}catch(e){}})();`;
