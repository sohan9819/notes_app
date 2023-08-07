import Navbar from "./Navbar";
import Header from "./Header";
// import Footer from "./Footer";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { data: sessionData } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!sessionData?.user) {
      void router.replace("/");
    }
  }, [sessionData]);

  return (
    <div className="h-max min-h-screen bg-[#0d1117] px-4">
      <Header />
      <Navbar />
      <main>{children}</main>
      <Toaster position="top-right" />
    </div>
  );
}
