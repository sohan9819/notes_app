import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: sessionData } = useSession();
  return (
    <div className="flex h-20 w-full items-center justify-center  ">
      <nav className="m-auto flex w-full items-center justify-between text-white">
        <Link href={"/"} className="text-4xl font-bold">
          <span className="text-blue-600">Notes</span>App
        </Link>
        <button
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>
      </nav>
    </div>
  );
}
