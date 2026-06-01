import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "../users";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  const user = getUserByEmail(email);
  if (!user) return NextResponse.json({ message: "Credenciais inválidas" }, { status: 401 });

  return NextResponse.json({ user, token: randomUUID() });
}
