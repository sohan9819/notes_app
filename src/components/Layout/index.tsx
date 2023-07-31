import Navbar from "./Navbar";
import Header from "./Header";
// import Footer from "./Footer";
import React from "react";
import { useSession } from "next-auth/react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { data: sessionData } = useSession();

  return (
    // <div className="h-max min-h-screen bg-[#191919] px-4">
    <div className="h-max min-h-screen bg-[#0d1117] px-4">
      <Header />
      <Navbar />
      {sessionData ? <main>{children}</main> : <main>{children}</main>}
    </div>
  );
}
