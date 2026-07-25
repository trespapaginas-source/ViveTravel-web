"use client";

import { useParams } from "next/navigation";
import { CabinDetail } from "@/components/cabins/cabin-detail";
import { useNavigation } from "@/lib/store";

export default function CabanaDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  if (id && (useNavigation.getState().selectedItemId !== id || useNavigation.getState().currentView !== "cabin-detail")) {
    useNavigation.setState({ currentView: "cabin-detail", selectedItemId: id });
  }

  return <CabinDetail cabinId={id} />;
}
