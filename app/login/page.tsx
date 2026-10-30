"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <main className="shell auth-shell">
      <h1>Log in</h1>
      <p className="lede">Owners keep their own kits. The Kimironko seed stays public.</p>
      <form
        className="panel"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          const form = new FormData(e.currentTarget);
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: form.get("email"), password: form.get("password") })
          });
          const body = await res.json();
          if (!res.ok) {
            setError(body.error || "Login failed");
            setBusy(false);
            return;
          }
          router.push("/dashboard");
          router.refresh();
        }}
      >
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
        {error ? <p className="err" role="alert">{error}</p> : null}
        <button className="btn" type="submit" disabled={busy}>
          {busy ? "Checking…" : "Log in"}
        </button>
      </form>
      <p>
        No account? <Link href="/register">Create one</Link>
      </p>
    </main>
  );
}
