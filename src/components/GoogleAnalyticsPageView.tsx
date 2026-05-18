"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

type GoogleAnalyticsPageViewProps = {
  gaId: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function GoogleAnalyticsPageView({ gaId }: GoogleAnalyticsPageViewProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || typeof window.gtag !== "function") {
      return;
    }

    window.gtag("config", gaId, { page_path: pathname });
  }, [pathname, gaId]);

  return null;
}
