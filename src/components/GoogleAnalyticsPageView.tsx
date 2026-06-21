"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

type GoogleAnalyticsPageViewProps = {
  gaId: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function PageViewTracker({ gaId }: GoogleAnalyticsPageViewProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    const send = () => {
      if (typeof window.gtag !== "function") return false;
      window.gtag("event", "page_view", {
        page_path: url,
        page_location: window.location.origin + url,
        page_title: document.title,
      });
      return true;
    };

    if (send()) return;

    const intervalId = setInterval(() => {
      if (send()) clearInterval(intervalId);
    }, 100);

    return () => clearInterval(intervalId);
  }, [pathname, searchParams, gaId]);

  return null;
}

export function GoogleAnalyticsPageView({ gaId }: GoogleAnalyticsPageViewProps) {
  return (
    <Suspense fallback={null}>
      <PageViewTracker gaId={gaId} />
    </Suspense>
  );
}
