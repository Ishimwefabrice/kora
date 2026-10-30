import Link from "next/link";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";

export async function SiteHeader() {
  const session = await getSession();
  return (
    <header className="top">
      <Link className="mark" href="/">
        Kora<span>.</span>
      </Link>
      <nav className="nav" aria-label="Main">
        <Link href="/kit/kimironko-mama-uwase">Seed kit</Link>
        {session ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <span className="eyebrow">{session.name}</span>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login">Log in</Link>
            <Link className="btn" href="/register">
              Create account
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
