'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AutoSealProps {
  hash: string;
  shouldSeal: boolean;
}

/**
 * Client component that automatically seals an artifact when mounted.
 * Used on the verify page when user returns from Gumroad with ?sealed=true.
 *
 * After sealing, triggers a router refresh to show the updated sealed state.
 */
export default function AutoSeal({ hash, shouldSeal }: AutoSealProps) {
  const router = useRouter();
  const [sealed, setSealed] = useState(false);

  useEffect(() => {
    async function seal() {
      if (!shouldSeal || sealed) {
        return;
      }

      setSealed(true);
      try {
        const response = await fetch('/api/fixate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ verifyHash: hash }),
        });

        if (response.ok) {
          // Refresh the page to show sealed artifact
          router.refresh();
        } else {
          console.error('Failed to seal artifact');
        }
      } catch (err) {
        console.error('Error sealing artifact:', err);
      }
    }

    seal();
  }, [hash, shouldSeal, sealed, router]);

  return null; // This component doesn't render anything
}
