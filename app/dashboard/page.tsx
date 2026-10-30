import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { formatRwf, provenTotal } from "@/lib/gate";
import { listKits } from "@/lib/kits";

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { q } = await searchParams;
  const kits = await listKits({ userId: session.userId, q, role: session.role });

  return (
    <main className="shell">
      <div className="kit-head">
        <div>
          <p className="eyebrow">Workspace</p>
          <h1>Your kits</h1>
          <p className="lede">Create a kit from the home page. Search by stall or place.</p>
        </div>
        <Link className="btn" href="/">
          New read
        </Link>
      </div>

      <form className="search-bar" method="get">
        <label htmlFor="q" className="sr-only">
          Search kits
        </label>
        <input id="q" name="q" defaultValue={q ?? ""} placeholder="Search stall or market" />
        <button className="btn ghost" type="submit">
          Search
        </button>
      </form>

      {kits.length === 0 ? (
        <div className="empty">
          <h2>No kits match that search.</h2>
          <p>Open the public seed or read a page from the home screen.</p>
        </div>
      ) : (
        <ul className="kit-list">
          {kits.map((kit) => (
            <li key={kit.id}>
              <Link href={`/kit/${kit.id}`}>
                <strong>{kit.shopNameRw}</strong>
                <span>{kit.place}</span>
                <span>{formatRwf(provenTotal(kit.lines))}</span>
                <span className={`status ${kit.approved ? "proven" : "blank"}`}>
                  {kit.approved ? "YES on record" : "waiting"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
