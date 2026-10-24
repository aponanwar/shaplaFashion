'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
  useEffect(() => {
    // Track visitor once per browser session
    try {
      const alreadyTracked = sessionStorage.getItem('shapla_visitor_tracked');
      if (!alreadyTracked) {
        fetch('/api/admin/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
          .then(() => {
            sessionStorage.setItem('shapla_visitor_tracked', '1');
          })
          .catch(() => {
            // Non-critical, ignore silent failure
          });
      }
    } catch {
      // sessionStorage unavailable (e.g. private mode strict)
    }
  }, []);

  return null;
}
