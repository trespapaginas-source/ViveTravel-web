"use client";

import React, { useEffect } from "react";
import { CabinDetail } from "@/components/cabins/cabin-detail";
import { useNavigation } from "@/lib/store";

export default function CabanaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { navigate } = useNavigation();
  const resolvedParams = React.use(params);

  useEffect(() => {
    if (resolvedParams?.id) {
      navigate("cabin-detail", resolvedParams.id);
    }
  }, [resolvedParams, navigate]);

  return <CabinDetail />;
}