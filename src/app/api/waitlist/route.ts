import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, type, message } = body;

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const payload: { email: string; type: string; message?: string } = {
      email: email.trim(),
      type: type ?? "waitlist",
    };

    if (typeof message === "string" && message.trim()) {
      payload.message = message.trim();
    }

    const res = await fetch(`${API_BASE_URL}/waitlist/createWaitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { message: (data as { message?: string }).message ?? "Request failed" },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[waitlist] proxy error:", err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
