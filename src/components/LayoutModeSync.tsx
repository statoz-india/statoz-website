"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { isBareLayout } from "@/lib/layoutMode";

/* Re-applies the `?layout=false` mode after client-side navigation, where the
   <head> script in the root layout does not run again. */
export default function LayoutModeSync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const root = document.documentElement;
    if (isBareLayout(pathname, searchParams.get("layout"))) {
      root.setAttribute("data-layout", "bare");
    } else {
      root.removeAttribute("data-layout");
    }
  }, [pathname, searchParams]);

  return null;
}
