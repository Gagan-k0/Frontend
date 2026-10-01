"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Monkey-patch window.fetch synchronously outside React so it catches the very first render's fetches
if (typeof window !== 'undefined' && !(window as any).__fetchPatched) {
  (window as any).__fetchPatched = true;
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const token = localStorage.getItem('token');
    let newInit = init;
    if (token && typeof input === 'string' && input.includes(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000')) {
      const headers = new Headers(init?.headers);
      if (!headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
        newInit = { ...init, headers };
      }
    }

    let response = await originalFetch(input, newInit);
    
    if (response.status === 401) {
      const clone = response.clone();
      try {
        const errorData = await clone.json();
        if (errorData.error === 'SESSION_REVOKED') {
          localStorage.clear();
          alert("You were signed out because your account was used on another device.");
          window.location.href = '/login';
          return response;
        } else if (errorData.error === 'TOKEN_EXPIRED') {
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
              const newHeaders = new Headers(init?.headers);
              newHeaders.set('Authorization', `Bearer ${refreshData.access_token}`);
              response = await originalFetch(input, { ...init, headers: newHeaders });
            } else {
              localStorage.clear();
              window.location.href = '/login';
            }
          } else {
            localStorage.clear();
            window.location.href = '/login';
          }
        } else {
          // Generic 401 (e.g. invalid token after DB reset)
          if (localStorage.getItem('token')) {
            localStorage.clear();
            window.location.href = '/login';
          }
        }
      } catch(e) {
        // Not JSON
        if (localStorage.getItem('token')) {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return response;
  };
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Poll /auth/session every 60s
    const pollInterval = setInterval(async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await window.fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/session`);
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
      clearInterval(pollInterval);
    };
  }, [router]);

  return <>{children}</>;
}
