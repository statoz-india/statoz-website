import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import DownloadRedirectClient from "./DownloadRedirectClient";
import { ANDROID_STORE_URL, IOS_STORE_URL } from "./storeUrls";

export const metadata: Metadata = {
  title: "Download StatOz | Get the App",
  description: "Download StatOz app on iOS or Android. Get real-time sports statistics and insights.",
};

export default async function DownloadPage() {
  const ua = (await headers()).get("user-agent") ?? "";
  if (/Android/i.test(ua)) {
    redirect(ANDROID_STORE_URL);
  }
  if (/iPhone|iPad|iPod/i.test(ua)) {
    redirect(IOS_STORE_URL);
  }

  return (
    <main className="min-h-screen bg-[#070b1f] text-white flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-xl font-semibold">Download StatOz</h1>
        <DownloadRedirectClient />
      </div>
    </main>
  );
}
