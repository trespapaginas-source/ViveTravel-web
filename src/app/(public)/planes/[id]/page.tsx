"use client";

import React, { useEffect } from "react";
import { PlanDetail } from "@/components/plans/plan-detail";
import { useNavigation } from "@/lib/store";

export default function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { navigate } = useNavigation();
  const resolvedParams = React.use(params);

  useEffect(() => {
    if (resolvedParams?.id) {
      navigate("plan-detail", resolvedParams.id);
    }
  }, [resolvedParams, navigate]);

  return <PlanDetail />;
}