import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/customerAuth";

const orderItemSchema = z.object({
  productName: z.string().min(1),
  size: z.string().min(1),
  color: z.string().min(1),
  unitPrice: z.number().positive(),
  quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
  customerName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  province: z.string().min(1),
  district: z.string().min(1),
  addressLine: z.string().min(1),
  postalCode: z.string().min(1),
  addressNotes: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { items, email, ...rest } = parsed.data;
  const customer = await getCurrentCustomer();
  const orderToken = randomBytes(16).toString("hex");

  const order = await prisma.order.create({
    data: {
      orderToken,
      customerId: customer?.id ?? null,
      email: email || null,
      ...rest,
      items: {
        create: items.map((item) => ({
          productName: item.productName,
          size: item.size,
          color: item.color,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        })),
      },
    },
  });

  return NextResponse.json({ orderToken: order.orderToken }, { status: 201 });
}
