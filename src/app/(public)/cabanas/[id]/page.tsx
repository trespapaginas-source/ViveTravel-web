"use client";

import { CabinDetail } from "@/components/cabins/cabin-detail";

export default function CabanaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <CabinDetail />;
}