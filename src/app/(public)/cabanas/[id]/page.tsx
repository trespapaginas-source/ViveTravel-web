"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { CabinDetail } from "@/components/cabins/cabin-detail";
import { useNavigation } from "@/lib/store";

export default function CabanaDetailPage() {
  const params = useParams<{ id: string }>();
  const { currentView, selectedItemId, navigate } = useNavigation();
  const id = params.id;

  useEffect(() => {
    if (id && (currentView !== "cabin-detail" || selectedItemId !== id)) {
      navigate("cabin-detail", id);
    }
  }, [currentView, id, navigate, selectedItemId]);

  return <CabinDetail />;
}
