import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // TODO: send this to the client's work email once an email provider (e.g. Resend, SMTP)
  // is chosen. Not stored in the DB per the project brief. Logged for now so submissions
  // aren't silently lost during development.
  console.log("Contact form submission:", parsed.data);

  return NextResponse.json({ ok: true });
}
