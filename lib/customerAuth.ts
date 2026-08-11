import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const COOKIE_NAME = "customer_session";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createCustomerSession(customerId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.customerSession.create({ data: { token, customerId, expiresAt } });

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getCurrentCustomer() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.customerSession.findUnique({
    where: { token },
    include: { customer: true },
  });
  if (!session || session.expiresAt < new Date()) return null;

  return session.customer;
}

export async function destroyCustomerSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (token) {
    await prisma.customerSession.deleteMany({ where: { token } });
  }
  (await cookies()).delete(COOKIE_NAME);
}
