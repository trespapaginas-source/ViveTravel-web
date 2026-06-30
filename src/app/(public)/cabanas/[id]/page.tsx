"use client";

import React from "react";
import { CabinDetail } from "@/components/cabins/cabin-detail";

export default function CabanaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  return <CabinDetail id={resolvedParams?.id} />;
}