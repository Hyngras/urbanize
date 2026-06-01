import { metrics } from "@/app/api/demands/data";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(metrics());
}
