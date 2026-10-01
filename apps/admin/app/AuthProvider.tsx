"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // 1. Monkey-patch window.fetch
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      let response = await originalFetch(input, init);
      
      if (response.status === 401) {
        // Clone response to read body
        const clone = response.clone();
        try {
          const errorData = await clone.json();
          if (errorData.error === 'SESSION_REVOKED') {
            localStorage.clear();
            alert("You were signed out because your account was used on another device.");
            router.push('/login');
            return response;
          } else if (errorData.error === 'TOKEN_EXPIRED') {
            // Attempt to refresh once
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const refreshRes = await originalFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: refreshToken })
              });
              
              if (refreshRes.ok) {
                const refreshData = await refreshRes.json();
                localStorage.setItem('token', refreshData.access_token);
                if (refreshData.refresh_token) {
                  localStorage.setItem('refresh_token', refreshData.refresh_token);
                }
                
                // Retry original request
                const newHeaders = new Headers(init?.headers);
                newHeaders.set('Authorization', `Bearer ${refreshData.access_token}`);
                response = await originalFetch(input, { ...init, headers: newHeaders });
              } else {
                localStorage.clear();
                router.push('/login');
              }
            } else {
              localStorage.clear();
              router.push('/login');
            }
          }
        } catch(e) {
          // not json or other error
        }
      }
      return response;
    };

    setIsInitializing(false);

    // 2. Poll /auth/session every 60s
    const pollInterval = setInterval(async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await originalFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/session`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.status === 401) {
             const data = await res.json();
             if (data.error === 'SESSION_REVOKED') {
               localStorage.clear();
               alert("You were signed out because your account was used on another device.");
               router.push('/login');
             }
          }
        } catch(e) {}
      }
    }, 60000);

    return () => {
      window.fetch = originalFetch;
      clearInterval(pollInterval);
    };
  }, [router]);

  return <>{children}</>;
}
