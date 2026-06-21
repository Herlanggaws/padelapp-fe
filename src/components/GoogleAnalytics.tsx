import Script from "next/script";
import { GoogleAnalyticsPageView } from "@/components/GoogleAnalyticsPageView";

type GoogleAnalyticsProps = {
  gaId: string;
};

export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { send_page_view: false });
        `}
      </Script>
      <GoogleAnalyticsPageView gaId={gaId} />
    </>
  );
}
