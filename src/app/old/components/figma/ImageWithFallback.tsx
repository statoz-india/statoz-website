"use client";

import React, { useState } from "react";

// Enhanced fallback SVG with better styling
const createFallbackSVG = (text: string = "Image") => {
  const svg = `
    <svg width="1080" height="720" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f172b;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <g opacity="0.1">
        <rect x="340" y="260" width="400" height="200" rx="8" fill="none" stroke="#5cdfff" stroke-width="3"/>
        <circle cx="440" cy="320" r="30" fill="none" stroke="#5cdfff" stroke-width="3"/>
        <polyline points="640,400 560,340 500,400" fill="none" stroke="#5cdfff" stroke-width="3" stroke-linejoin="round"/>
      </g>
      <text
        x="50%"
        y="50%"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="24"
        font-weight="600"
        fill="#5cdfff"
        opacity="0.5"
        text-anchor="middle"
        dominant-baseline="middle"
      >Image Loading...</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const ERROR_IMG_SRC = createFallbackSVG();

export function ImageWithFallback(
  props: React.ImgHTMLAttributes<HTMLImageElement>
) {
  const [didError, setDidError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Silently handle error without console warning to avoid clutter
    setDidError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const { src, alt, style, className, ...rest } = props;

  return didError ? (
    <div
      className={`inline-block bg-[#0f172b] text-center align-middle ${
        className ?? ""
      }`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img
          src={ERROR_IMG_SRC}
          alt="Image unavailable"
          className="w-full h-full object-cover"
          {...rest}
        />
      </div>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      {...rest}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
}
