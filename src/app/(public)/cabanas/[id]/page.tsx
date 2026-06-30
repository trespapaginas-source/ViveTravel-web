"use client";

import React from "react";
import { CabinDetail } from "@/components/cabins/cabin-detail";

export default function CabanaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  console.log("Resolved dynamic params:", resolvedParams);
  return <CabinDetail id={resolvedParams?.id} />;
}