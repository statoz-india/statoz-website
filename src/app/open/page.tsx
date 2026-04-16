import type { Metadata } from "next";
import OpenAppRedirectClient from "./OpenAppRedirectClient";

export const metadata: Metadata = {
  title: "Statoz | Open App",
};

export default function OpenAppPage() {
  return (
    <main className="min-h-screen bg-[#070b1f] text-white flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-xl font-semibold">Opening StatOz...</h1>
        <p className="text-sm text-white/80">
          If the app does not open automatically, you will be redirected to the
          appropriate app store.
        </p>
        <OpenAppRedirectClient />
      </div>
    </main>
  );
}
