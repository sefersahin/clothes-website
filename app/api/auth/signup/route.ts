import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createCustomerSession, hashPassword } from "@/lib/customerAuth";

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(1).optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { name, email, password, phone } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.customer.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: "Bu e-posta adresi zaten kayıtlı." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const customer = await prisma.customer.create({
    data: { name, email: normalizedEmail, passwordHash, phone: phone || null },
  });

  await createCustomerSession(customer.id);

  return NextResponse.json({ id: customer.id, name: customer.name, email: customer.email }, { status: 201 });
}
