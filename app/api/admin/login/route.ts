import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, verifyAdminCredentials } from "@/lib/auth";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const valid = await verifyAdminCredentials(parsed.data.username, parsed.data.password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await createSession();
  return NextResponse.json({ ok: true });
}
