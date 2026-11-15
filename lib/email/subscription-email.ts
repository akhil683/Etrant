import { transporter } from "../config/nodemailer";

export default async function sendSubscriptionEmail(
  email: string | null,
  name: string | null,
  plan: string | null,
) {
  try {
    if (!email) {
      throw new Error("Recipient email address is missing.");
    }

    await transporter.sendMail({
      from: `"Etrant" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Welcome to Etrant ${plan || "Subscription"}`,
      html: `
  <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 24px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
      <div style="text-align: center; padding: 24px; background-color: #2563eb;">
        <img src="https://raw.githubusercontent.com/akhil683/Portfolio_Blogs/refs/heads/main/images/etrant_high.png" alt="Etrant" style="max-width: 120px;" />
      </div>

      <div style="padding: 28px;">
        <h2 style="color: #0f172a; margin: 0 0 12px;">
          Thank you for subscribing, ${name || "Learner"}!
        </h2>
        <p style="color: #475569; line-height: 1.6; margin: 0 0 20px;">
          Your <strong>Etrant ${plan || "Subscription"}</strong> is now active.
          Here is what you have unlocked:
        </p>

        <ul style="line-height: 1.7; padding-left: 18px; color: #475569; margin: 0 0 24px;">
          <li><strong>Unlimited AI reels</strong> across your exam syllabus</li>
          <li><strong>Full current affairs</strong> and the complete daily digest</li>
          <li><strong>Advanced practice questions</strong> with explanations</li>
          <li><strong>Progress insights</strong> and study streaks</li>
          <li><strong>Priority access</strong> to new features</li>
        </ul>

        <div style="text-align: center; margin: 28px 0;">
          <a href="https://etrant.akkhil.dev/daily-digest"
            style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            Start today&apos;s digest
          </a>
        </div>

        <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin: 0;">
          Questions about billing? Reply to this email and we will help.
        </p>
        <p style="font-size: 12px; color: #64748b; margin: 12px 0 0;">
          — The Etrant Team
        </p>
      </div>
    </div>
  </div>
`,
    });

    console.log(`Subscription email sent to: ${email} (${plan})`);
    return { success: true };
  } catch (error) {
    console.error(`Failed to send subscription email to ${email}:`, error);
    return { success: false, error: (error as Error).message };
  }
}
