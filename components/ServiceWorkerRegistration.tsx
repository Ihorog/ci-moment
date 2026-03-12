'use client';

import { useEffect } from 'react';

/**
 * Registers the service worker for PWA / offline support.
 * Renders nothing; purely a side-effect component.
 */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // SW registration failure is non-fatal; the app still works online.
      });
    }
  }, []);

  return null;
}
