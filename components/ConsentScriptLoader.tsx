"use client";
import Script from "next/script";

const GTAG_ID = "G-TDVLTM3QGR";
const ADS_CLIENT = "ca-pub-6539140496743179";

export default function ConsentScriptLoader() {
  return (
    <>
      {/* Always inject AdSense immediately so the script is discoverable by reviewers. */}
      <Script
        id="ads-init"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      
      {/* Always inject Analytics immediately */}
      <Script
        id="gtag-load"
        src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GTAG_ID}');
          `,
        }}
      />
    </>
  );
}
