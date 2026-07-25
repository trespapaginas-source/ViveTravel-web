"use client";

import { Navbar } from "@/components/layout/navbar";
import { StickySummaryBar } from "@/components/layout/sticky-summary-bar";
import { Footer } from "@/components/layout/footer";
import { usePrefetchData } from "@/hooks/use-prefetch-data";
import { useScrollOnNavigate } from "@/hooks/use-scroll-on-navigate";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  usePrefetchData();
  useScrollOnNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <StickySummaryBar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
