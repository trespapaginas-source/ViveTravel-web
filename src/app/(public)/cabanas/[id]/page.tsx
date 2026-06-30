import { CabinDetail } from "@/components/cabins/cabin-detail";

export const dynamic = "force-dynamic";

export default async function CabanaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CabinDetail id={id} />;
}