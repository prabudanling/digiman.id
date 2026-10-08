"use client";

import { MotionConfig } from "framer-motion";

/**
 * Membungkus seluruh situs agar framer-motion otomatis menghormati
 * preferensi aksesibilitas pengguna "prefers-reduced-motion: reduce":
 * animasi transform/layout dimatikan, animasi opacity/tetap dipertahankan.
 * (Animasi CSS keyframe ditangani media query di globals.css.)
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
