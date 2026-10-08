"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Pelacak kunjungan ringan (first-party, tanpa cookie) → Panel Admin > Dashboard.
 * Satu kali per path per sesi browser agar angka bersih dari refresh spam.
 */
export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const key = `digiman-pv-${pathname}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* private mode: tetap kirim sekali */
    }
    const payload = {
      path: pathname,
      referrer: document.referrer || "",
      device: window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop",
    };
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
