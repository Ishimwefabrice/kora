"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ApproveButton({ id, approved }: { id: string; approved: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (approved) {
    return (
      <button className="btn" disabled>
        YES is on the record
      </button>
    );
  }

  return (
    <div>
      <button
        className="btn"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError("");
          const res = await fetch("/api/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
          });
          const body = await res.json().catch(() => ({}));
          if (!res.ok) setError(body.error || "Could not record YES");
          router.refresh();
          setBusy(false);
        }}
      >
        {busy ? "Writing YES…" : "YES — still do not send"}
      </button>
      {error ? <p className="err" role="alert">{error}</p> : null}
    </div>
  );
}
