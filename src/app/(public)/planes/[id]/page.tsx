"use client";

import { PlanDetail } from "@/components/plans/plan-detail";

export default function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <PlanDetail />;
}