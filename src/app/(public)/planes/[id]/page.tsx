"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { PlanDetail } from "@/components/plans/plan-detail";
import { useNavigation } from "@/lib/store";

export default function PlanDetailPage() {
  const params = useParams<{ id: string }>();
  const { currentView, selectedItemId, navigate } = useNavigation();
  const id = params.id;

  useEffect(() => {
    if (id && (currentView !== "plan-detail" || selectedItemId !== id)) {
      navigate("plan-detail", id);
    }
  }, [currentView, id, navigate, selectedItemId]);

  return <PlanDetail />;
}
