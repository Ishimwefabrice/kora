"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <main className="shell auth-shell">
      <h1>Create an account</h1>
      <p className="lede">Your notebooks stay on this server. Passwords are hashed. API keys never go in the browser.</p>
      <form
        className="panel"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          const form = new FormData(e.currentTarget);
          if (form.get("password") !== form.get("confirm")) {
            setError("Passwords do not match.");
            setBusy(false);
            return;
          }
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: form.get("name"),
              email: form.get("email"),
              password: form.get("password")
            })
          });
          const body = await res.json();
          if (!res.ok) {
            setError(body.error || "Could not create the account");
            setBusy(false);
            return;
          }
          router.push("/dashboard");
          router.refresh();
        }}
      >
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" autoComplete="name" required minLength={2} maxLength={80} />
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required />
        <label htmlFor="password">Password (10+ characters)</label>
        <input id="password" name="password" type="password" autoComplete="new-password" required minLength={10} />
        <label htmlFor="confirm">Confirm password</label>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={10} />
        {error ? <p className="err" role="alert">{error}</p> : null}
        <button className="btn" type="submit" disabled={busy}>
          {busy ? "Saving…" : "Create account"}
        </button>
      </form>
      <p>
        Already registered? <Link href="/login">Log in</Link>
      </p>
    </main>
  );
}
