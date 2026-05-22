import { NextRequest, NextResponse } from "next/server";
import { getDemand } from "../data";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await context.params;

  const demand = getDemand(id);

  if (!demand) {
    return NextResponse.json(
      { message: "Not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(demand);
}