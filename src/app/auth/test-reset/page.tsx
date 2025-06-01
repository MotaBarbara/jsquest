"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabaseClient";

export default function TestResetPage() {
  const [session, setSession] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const appendLog = (msg: string) => setLogs(prev => [...prev, msg]);

    const run = async () => {
      appendLog("🔄 Starting session recovery...");
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (!access_token || !refresh_token) {
        appendLog("⚠️ No access or refresh token found");
        setError("No tokens found");
        return;
      }

      appendLog("👀 Pre-check: getSession()");
      const { data: currentSession, error: getError } =
        await supabase.auth.getSession();
      appendLog(
        `📦 Current session: ${JSON.stringify(currentSession?.session)}`,
      );
      if (getError) appendLog(`⚠️ getSession error: ${getError.message}`);

      appendLog("🧾 Tokens found, calling setSession...");

      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        appendLog("❌ setSession error: " + error.message);
        setError(error.message);
      } else {
        appendLog("✅ Session set!");
        appendLog(`👤 User ID: ${data.session?.user?.id}`);
        setSession(data.session);

        // Optional: clean the URL hash
        window.history.replaceState({}, document.title, "/auth/test-reset");

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }

      // Final check
      const { data: finalSession } = await supabase.auth.getSession();
      appendLog(
        `🔁 Final getSession(): ${JSON.stringify(finalSession?.session)}`,
      );
    };

    run();
  }, []);

  return (
    <main style={{ padding: 40 }}>
      <h1>🔐 Test Reset Page</h1>
      {logs.map((log, i) => (
        <div key={i}>{log}</div>
      ))}

      {session ? (
        <pre>{JSON.stringify(session, null, 2)}</pre>
      ) : (
        <p style={{ marginTop: 20 }}>Waiting for session...</p>
      )}
    </main>
  );
}
