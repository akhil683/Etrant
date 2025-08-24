import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const body = await req.json();

  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } =
    body;

  const keySecret = process.env.RAZORPAY_KEY_SECRET!;

  const generated_signature = crypto
    .createHmac("sha256", keySecret)
    .update(razorpay_payment_id + "|" + razorpay_subscription_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    // ✅ Payment verified successfully
    // Save to DB: userId, plan, status=active, subscriptionId, etc.
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
