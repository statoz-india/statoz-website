import type { Metadata } from "next";

import DownloadRedirectClient from "./DownloadRedirectClient";

export const metadata: Metadata = {
  title: "Download StatOz | Get the App",
  description:
    "Download StatOz app on iOS or Android. Get real-time sports statistics and insights.",
};

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-[#070b1f] text-white flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-xl font-semibold">Download StatOz</h1>
        <DownloadRedirectClient />
      </div>
    </main>
  );
}
