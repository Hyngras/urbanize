import { NextRequest, NextResponse } from "next/server";
import { listUsers } from "../users";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const user = listUsers()[0];
  return NextResponse.json(user);
}
