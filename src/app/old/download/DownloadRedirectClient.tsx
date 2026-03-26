"use client";

import { useEffect } from "react";

interface DownloadRedirectClientProps {
  playStoreUrl: string;
}

export default function DownloadRedirectClient({
  playStoreUrl,
}: DownloadRedirectClientProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.replace(playStoreUrl);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [playStoreUrl]);

  return null;
}
