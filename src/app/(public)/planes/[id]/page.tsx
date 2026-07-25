"use client";

import { useParams } from "next/navigation";
import { PlanDetail } from "@/components/plans/plan-detail";
import { useNavigation } from "@/lib/store";

export default function PlanDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  if (id && (useNavigation.getState().selectedItemId !== id || useNavigation.getState().currentView !== "plan-detail")) {
    useNavigation.setState({ currentView: "plan-detail", selectedItemId: id });
  }

  return <PlanDetail planId={id} />;
}
