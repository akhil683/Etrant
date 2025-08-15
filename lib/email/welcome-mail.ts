import nodemailer from "nodemailer";

export default async function sendWelcomeEmail(email: string, name: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"WikiReel" <${process.env.SMTP_USER}>`,
    to: email,
    subject:
      "Welcome to WikiReel 🎉 Your Personalized Learning Journey Starts Here",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f7f8fa; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden;">
          
          <!-- Logo -->
          <div style="text-align: center; padding: 20px; background-color: #1a73e8;">
            <img src="https://your-domain.com/logo.png" alt="WikiReel Logo" style="max-width: 120px;" />
          </div>
          
          <!-- Welcome Text -->
          <div style="padding: 20px;">
            <h2 style="color: #1a73e8;">Hi ${name || "Learner"}, welcome to WikiReel! 🚀</h2>
            <p>
              You’ve just unlocked a smarter, faster, and more engaging way to learn.  
              WikiReel combines the addictive swipe experience of Instagram reels with AI-curated educational content — tailored just for you.
            </p>

            <!-- Features -->
            <h3 style="color: #333;">Here’s what you can explore:</h3>
            <ul style="line-height: 1.6;">
              <li>📚 <strong>AI-Curated Reels</strong> — Bite-sized summaries from Wikipedia, research papers, news, and more.</li>
              <li>📰 <strong>UPSC Daily Current Affairs Digest</strong> — Auto-fetched, rewritten, and visualized for quick learning.</li>
              <li>🗺️ <strong>Interactive Knowledge Maps</strong> — Visual topic navigation with progress tracking.</li>
              <li>🎯 <strong>Exam-Oriented MCQs</strong> — Practice questions designed for UPSC, JEE, NEET, and more.</li>
              <li>🏆 <strong>Gamification</strong> — Points, streaks, leaderboards, and badges to keep you motivated.</li>
            </ul>

            <!-- Call to Action -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://wikireel.com" 
                style="background-color: #1a73e8; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                Start Learning Now
              </a>
            </div>

            <p style="font-size: 14px; color: #777;">
              You’re at the start of an exciting journey — we can’t wait to see your learning streaks grow!  
              <br/>– The WikiReel Team
            </p>
          </div>
        </div>
      </div>
    `,
  });
}
