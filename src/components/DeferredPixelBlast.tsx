"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ComponentProps, type ReactNode } from "react";

/* The hero's WebGL dither effect pulls in three.js + postprocessing.
   - Loading it after the page has loaded and the browser is idle keeps it out
     of the first paint (LCP) and early input (INP). It sits at 16% opacity
     behind the copy, so starting a moment later is not noticeable.
   - Without WebGL (old devices, hardware acceleration off, some privacy
     browsers) three.js throws, which used to crash the whole homepage. We
     check for WebGL first and catch any error, so the effect is simply
     skipped instead. */

const PixelBlast = dynamic(() => import("./PixelBlast"), { ssr: false });

type Props = ComponentProps<typeof PixelBlast>;

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/* Decorative only: on any error, render nothing and keep the page alive. */
class SilentBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function DeferredPixelBlast(props: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const start = () => {
      if (!hasWebGL()) return;
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(() => setReady(true), { timeout: 2000 });
      } else {
        timeoutId = setTimeout(() => setReady(true), 200);
      }
    };

    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
    }

    return () => {
      window.removeEventListener("load", start);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  if (!ready) return null;

  return (
    <SilentBoundary>
      <PixelBlast {...props} />
    </SilentBoundary>
  );
}
