import { useEffect } from 'react';

// Synchronous global fallback
let inMemoryRef: string | null = null;

const captureReferralSync = () => {
  if (typeof window === 'undefined') return;
  
  try {
    const urlStr = window.location.href;
    
    // Universal URL Parsing (Regex-Based) - catches ?ref=, #/register?ref=, etc.
    const refMatch = urlStr.match(/[?&#]ref=([^&#]+)/i);
    
    if (refMatch && refMatch[1]) {
      const rawRef = refMatch[1];
      // Basic sanitization
      let cleanRef = rawRef;
      try {
         cleanRef = decodeURIComponent(rawRef);
      } catch(e) {}
      
      cleanRef = cleanRef.replace(/[^a-zA-Z0-9_-]/g, '');
      
      if (cleanRef) {
         inMemoryRef = cleanRef;
         const expiry = new Date().getTime() + (30 * 24 * 60 * 60 * 1000); // 30 days
         
         // A: LocalStorage
         try { localStorage.setItem('equinox_ref', JSON.stringify({ value: cleanRef, expiry })); } catch(e) {}
         
         // B: Hard Cookie
         try { document.cookie = `equinox_ref=${cleanRef}; expires=${new Date(expiry).toUTCString()}; path=/; SameSite=Lax`; } catch(e) {}
         
         // C: Session Storage (Backup)
         try { sessionStorage.setItem('equinox_ref_backup', cleanRef); } catch(e) {}

         // Debug for Admin
         console.log(`[DEBUG] REFERRAL CAPTURED: [${cleanRef}]`);

         // We NO LONGER rewrite the URL. 
         // Rewriting the URL was causing lost referrals on mobile browser tab-suspension/reloads.
         // Let the user keep ?ref= in their address bar, it's safer.
      }
    }
  } catch (error) {
    console.error('Referral parsing error', error);
  }
};

// Fire immediately upon JS execution (before React mounts or routes change)
captureReferralSync();

export function useReferralEngine() {
  useEffect(() => {
    // Real-device compatibility (Mobile Fix) - Listen to hash and popstate changes
    window.addEventListener('hashchange', captureReferralSync);
    window.addEventListener('popstate', captureReferralSync);

    return () => {
      window.removeEventListener('hashchange', captureReferralSync);
      window.removeEventListener('popstate', captureReferralSync);
    };
  }, []);
}

export const getBestReferral = (): string | null => {
   if (inMemoryRef) return inMemoryRef;
   
   // 0. Active Fallback Check on window object (in case capture hasn't run or memory was wiped)
   try {
      if (typeof window !== 'undefined') {
         const urlStr = window.location.href;
         const refMatch = urlStr.match(/[?&#]ref=([^&#]+)/i);
         if (refMatch && refMatch[1]) {
            let directRef = refMatch[1];
            try { directRef = decodeURIComponent(directRef); } catch(e) {}
            directRef = directRef.replace(/[^a-zA-Z0-9_-]/g, '');
            if (directRef) return directRef;
         }
      }
   } catch (e) {}

   // 1. Try Local Storage
   try {
      const lsStr = localStorage.getItem('equinox_ref');
      if (lsStr) {
         const item = JSON.parse(lsStr);
         if (new Date().getTime() < item.expiry) {
            return item.value;
         }
      }
   } catch(e) {}
   
   // 2. Try Cookie
   try {
      const match = document.cookie.match(/(?:^|; )equinox_ref=([^;]*)/);
      if (match && match[1]) {
         return match[1];
      }
   } catch (e) {}

   // 3. Try Session Storage
   try {
      const ssRef = sessionStorage.getItem('equinox_ref_backup');
      if (ssRef) {
          return ssRef;
      }
   } catch(e) {}
   
   return null;
};
