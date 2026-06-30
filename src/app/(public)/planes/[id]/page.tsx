"use client";

import React from "react";
import { PlanDetail } from "@/components/plans/plan-detail";

export default function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  return <PlanDetail id={resolvedParams?.id} />;
}