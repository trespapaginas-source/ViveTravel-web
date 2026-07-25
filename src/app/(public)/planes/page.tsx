"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PlansList } from "@/components/plans/plans-list";
import { useNavigation } from "@/lib/store";

function PlanesContent() {
  const searchParams = useSearchParams();
  const categoria = searchParams.get("categoria");
  const { navigate } = useNavigation();

  useEffect(() => {
    if (categoria) {
      navigate("plans", categoria);
    }
  }, [categoria, navigate]);

  return <PlansList />;
}

export default function PlanesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-ocean border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PlanesContent />
    </Suspense>
  );
}
