"use client";
import { useEffect } from "react";

const GTAG_ID = "G-TDVLTM3QGR";
const ADS_CLIENT = "ca-pub-6539140496743179";

function injectGtag() {
  if (typeof window === "undefined") return;
  if ((window as any).__rl_consent_loaded) return;
  (window as any).__rl_consent_loaded = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`;
  document.head.appendChild(s);

  const inline = document.createElement("script");
  inline.innerHTML = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GTAG_ID}');`;
  document.head.appendChild(inline);
}

function injectAds() {
  if (typeof window === "undefined") return;
  if ((window as any).__rl_ads_loaded) return;
  (window as any).__rl_ads_loaded = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT}`;
  s.crossOrigin = "anonymous";
  document.head.appendChild(s);
}

export default function ConsentScriptLoader() {
  useEffect(() => {
    function handle(e: Event) {
      const detail = (e as CustomEvent).detail || {};
      if (detail.accepted) {
        injectGtag();
        injectAds();
      }
    }

    // If user already accepted, inject immediately
    try {
      const stored = localStorage.getItem("rl_cookie_consent");
      if (stored === "accepted") {
        injectGtag();
        injectAds();
      }
    } catch (e) {
      // ignore
    }

    window.addEventListener("rl:cookie-consent", handle as EventListener);
    return () => window.removeEventListener("rl:cookie-consent", handle as EventListener);
  }, []);

  return null;
}
