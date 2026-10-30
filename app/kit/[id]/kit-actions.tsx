"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function KitActions({
  id,
  notes,
  canEdit,
  canDelete
}: {
  id: string;
  notes: string;
  canEdit: boolean;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(notes);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  if (!canEdit && !canDelete) return null;

  return (
    <div className="panel">
      {canEdit ? (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            const res = await fetch(`/api/kits/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ notes: value })
            });
            const body = await res.json();
            setMessage(res.ok ? "Notes saved." : body.error || "Could not save");
            setBusy(false);
            router.refresh();
          }}
        >
          <label htmlFor="notes">Owner notes</label>
          <textarea id="notes" maxLength={2000} value={value} onChange={(e) => setValue(e.target.value)} />
          <button className="btn ghost" type="submit" disabled={busy}>
            Save notes
          </button>
        </form>
      ) : null}
      {canDelete ? (
        <button
          className="btn ghost danger"
          type="button"
          disabled={busy}
          onClick={async () => {
            if (!window.confirm("Delete this kit? This cannot be undone.")) return;
            setBusy(true);
            const res = await fetch(`/api/kits/${id}`, { method: "DELETE" });
            if (res.ok) router.push("/dashboard");
            else {
              const body = await res.json();
              setMessage(body.error || "Could not delete");
              setBusy(false);
            }
          }}
        >
          Delete kit
        </button>
      ) : null}
      {message ? <p role="status">{message}</p> : null}
    </div>
  );
}
