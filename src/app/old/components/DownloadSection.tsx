import { Smartphone } from "lucide-react";
import Link from "next/link";
import { APP_DOWNLOAD_URL } from "../utils/constants";

export function DownloadSection() {
  return (
    <section className="bg-gradient-to-b from-[#0D111A] via-[#0f1624] to-[#0D111A] py-16 lg:py-24 relative overflow-hidden border-t border-b border-[#1d293d]">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7C86FF] blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#5cdfff] blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-32 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7C86FF] to-[#5cdfff] px-4 py-2 mb-6">
            <Smartphone className="w-4 h-4 text-white" />
            <span className="font-orbitron text-white text-sm font-bold tracking-wider">
              DOWNLOAD NOW
            </span>
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl lg:text-5xl text-white uppercase mb-4">
            Get Statoz On Your Phone
          </h2>
          <p className="font-jakarta text-[#B8C5D6] text-base lg:text-xl max-w-2xl mx-auto mb-8">
            Download the app and start predicting on 100+ live events. Available
            on Android.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6">
          {/* Google Play Button */}
          <a
            href={APP_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-[rgba(15,23,43,0.8)] border-2 border-[#1d293d] hover:border-[#5cdfff] transition-all duration-300 px-8 py-4 flex items-center gap-4 min-w-[240px] hover:scale-105"
          >
            <div className="bg-[#1d293d] p-3 group-hover:bg-[#5cdfff] transition-colors">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 text-white"
                fill="currentColor"
              >
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-orbitron text-[#8b95a5] text-xs uppercase tracking-wider">
                Get it on
              </p>
              <p className="font-orbitron text-white text-xl font-bold">
                Google Play
              </p>
            </div>
          </a>
          <Link
            href="/downlaod"
            className="group relative bg-[rgba(15,23,43,0.8)] border-2 border-[#1d293d] hover:border-[#7C86FF] transition-all duration-300 px-8 py-4 flex items-center justify-center min-w-[240px] hover:scale-105"
          >
            <span className="font-orbitron text-[#B8C5D6] group-hover:text-white text-sm font-bold uppercase tracking-wider transition-colors">
              Open Download Page
            </span>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="font-jakarta text-[#8b95a5] text-sm">
            Free to download • No credit card required • Available worldwide
          </p>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="font-orbitron font-bold text-3xl lg:text-4xl text-[#5cdfff] mb-2">
              100+
            </div>
            <div className="font-jakarta text-[#B8C5D6] text-sm">Downloads</div>
          </div>
          <div className="text-center">
            <div className="font-orbitron font-bold text-3xl lg:text-4xl text-[#5cdfff] mb-2">
              4.8★
            </div>
            <div className="font-jakarta text-[#B8C5D6] text-sm">
              User Rating
            </div>
          </div>
          <div className="text-center">
            <div className="font-orbitron font-bold text-3xl lg:text-4xl text-[#5cdfff] mb-2">
              24/7
            </div>
            <div className="font-jakarta text-[#B8C5D6] text-sm">
              Live Events
            </div>
          </div>
          <div className="text-center">
            <div className="font-orbitron font-bold text-3xl lg:text-4xl text-[#5cdfff] mb-2">
              ₹10k+
            </div>
            <div className="font-jakarta text-[#B8C5D6] text-sm">
              Prizes Won
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
