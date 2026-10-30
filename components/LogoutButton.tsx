"use client";

export function LogoutButton() {
  return (
    <form action="/api/auth/logout" method="post">
      <button className="btn ghost" type="submit">
        Log out
      </button>
    </form>
  );
}
