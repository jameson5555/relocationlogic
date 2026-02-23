"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "rl_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch (e) {
      // localStorage might be unavailable; show banner by default
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch (e) {
      // ignore
    }
    // notify other listeners (script loader)
    window.dispatchEvent(new CustomEvent("rl:cookie-consent", { detail: { accepted: true } }));
    setVisible(false);
  }

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "dismissed");
    } catch (e) {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite">
      <div className="cookie-inner container">
        <div className="cookie-message">
          <strong>We use cookies to improve your experience.</strong>
          <p className="muted">You can accept cookies to enable analytics and personalized ads, or dismiss to continue without them.</p>
        </div>
        <div className="cookie-actions">
          <Link href="/privacy-policy" className="cookie-link">Privacy policy</Link>
          <button className="btn btn-ghost" onClick={dismiss} aria-label="Dismiss cookie banner">Dismiss</button>
          <button className="btn btn-primary" onClick={accept} aria-label="Accept cookies">Accept</button>
        </div>
      </div>
    </div>
  );
}
