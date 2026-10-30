"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ApproveButton({ id, approved }: { id: string; approved: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  if (approved) {
    return (
      <button className="btn" disabled>
        YES is on the record
      </button>
    );
  }

  return (
    <button
      className="btn"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id })
        });
        router.refresh();
        setBusy(false);
      }}
    >
      {busy ? "Writing YES…" : "YES — still do not send"}
    </button>
  );
}
