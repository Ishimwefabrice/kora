import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell">
      <h1>That kit is not on the shelf.</h1>
      <p className="lede">Open the Kimironko seed or read a new page.</p>
      <div className="actions">
        <Link className="btn" href="/">
          Back to the stall
        </Link>
      </div>
    </main>
  );
}
