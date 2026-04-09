"use client";

import { useEffect } from "react";
import { CRO_COOKIE, CRO_EXPERIMENT_ID } from "@/lib/cro-constants";

declare global {
  interface Window {
    clarity?: (command: string, key: string, value: string) => void;
  }
}

/**
 * Reads the A/B variant cookie and tags the Microsoft Clarity session
 * so heatmaps and recordings can be filtered by variant.
 *
 * Must be rendered after ClarityScript has loaded the tag.
 */
export function ClarityAbTag() {
  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${CRO_COOKIE}=`));
    const variant = cookie?.split("=")[1] ?? "unknown";

    const tag = () => {
      window.clarity?.("set", "ab_variant", variant);
      window.clarity?.("set", "experiment_id", CRO_EXPERIMENT_ID);
    };

    // Clarity loads async — retry until available (max 5s)
    if (window.clarity) {
      tag();
    } else {
      let attempts = 0;
      const interval = setInterval(() => {
        if (window.clarity) {
          tag();
          clearInterval(interval);
        } else if (++attempts > 50) {
          clearInterval(interval);
        }
      }, 100);
    }
  }, []);

  return null;
}
