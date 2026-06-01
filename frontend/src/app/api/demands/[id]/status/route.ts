import { NextRequest, NextResponse } from "next/server";
import { updateDemandStatus } from "../../data";
import { DemandStatus } from "@/types/demand";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { status } = (await request.json()) as { status: DemandStatus };
  const demand = updateDemandStatus(id, status);
  if (!demand) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(demand);
}
