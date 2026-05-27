import { NextRequest, NextResponse } from "next/server";
import { createDemand, listDemands } from "./data";
import { Demand, DemandCategory, DemandStatus } from "@/types/demand";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as DemandStatus | null;
  const categoria = searchParams.get("categoria") as DemandCategory | null;
  const bairro = searchParams.get("bairro");
  const busca = searchParams.get("busca") ?? undefined;

  const demands = listDemands({
    status: status ?? undefined,
    categoria: categoria ?? undefined,
    bairro: bairro ?? undefined,
    busca,
  });

  return NextResponse.json(demands);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Omit<Demand, "id">;
  const demand = createDemand({ ...body, criadaEm: new Date().toISOString(), atualizadaEm: new Date().toISOString() });
  return NextResponse.json(demand, { status: 201 });
}
