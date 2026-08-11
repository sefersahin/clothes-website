import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createCustomerSession, verifyPassword } from "@/lib/customerAuth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const customer = await prisma.customer.findUnique({ where: { email: email.toLowerCase() } });
  if (!customer) {
    return NextResponse.json({ error: "E-posta veya şifre hatalı." }, { status: 401 });
  }

  const valid = await verifyPassword(password, customer.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "E-posta veya şifre hatalı." }, { status: 401 });
  }

  await createCustomerSession(customer.id);

  return NextResponse.json({ id: customer.id, name: customer.name, email: customer.email });
}
