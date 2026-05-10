import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const { email, studentName, marks, remarks, riskScore } = await req.json()

    if (!email || !studentName || marks === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let transporter;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
    } else {
      console.warn("Real EMAIL_USER / EMAIL_PASS not found in .env. Simulating email send instead of using real SMTP.")
      // We will skip creating a transporter and just mock the success later
    }

    const mailOptions = {
      from: `"GKRK Examination Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Exam Result - ${studentName} (${marks}/100)`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">GKRK Examination Portal</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Official Result Notification</p>
          </div>
          
          <div style="padding: 32px; background-color: white;">
            <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">Dear <strong>${studentName}</strong>,</p>
            
            <p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin-bottom: 24px;">
              Your examination has been reviewed and graded. Below are your final results and feedback from the administration.
            </p>

            <div style="background-color: #f3f4f6; border-radius: 8px; padding: 24px; margin-bottom: 24px; text-align: center;">
              <span style="display: block; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Final Score</span>
              <span style="display: block; font-size: 48px; font-weight: 800; color: ${marks >= 70 ? '#059669' : marks >= 40 ? '#2563eb' : '#dc2626'};">${marks}/100</span>
            </div>

            <div style="margin-bottom: 24px;">
              <h3 style="font-size: 14px; color: #111827; margin-bottom: 8px; text-transform: uppercase;">Performance Feedback</h3>
              <p style="font-size: 15px; color: #4b5563; line-height: 1.6; font-style: italic; padding: 12px; border-left: 4px solid #3b82f6; background-color: #eff6ff; border-radius: 0 8px 8px 0;">
                "${marks >= 70 ? "Incredible performance! Your dedication to excellence is truly inspiring. Keep pushing boundaries and reaching for the stars." : 
                   marks >= 40 ? "Good effort! Your hard work is paying off. With a bit more focus on key areas, you'll reach the next level of success in no time." : 
                   "Every challenge is an opportunity for growth. Study smarter, stay consistent, and remember that persistence is the key to mastering any subject."}"
              </p>
            </div>

            ${remarks ? `
            <div style="margin-bottom: 24px;">
              <h3 style="font-size: 14px; color: #111827; margin-bottom: 8px; text-transform: uppercase;">Admin Remarks</h3>
              <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
                ${remarks}
              </p>
            </div>
            ` : ''}

            <div style="background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <h3 style="font-size: 14px; color: #9a3412; margin: 0 0 8px 0; display: flex; items-center: center;">
                ⚠️ Warning
              </h3>
              <p style="font-size: 14px; color: #c2410c; margin: 0; line-height: 1.5;">
                Final Warning: Please remember that academic integrity is paramount. Future attempts will be monitored even more strictly. <strong>Cheating mat karna, warna seedha filter kardi jayegi image.</strong>
              </p>
            </div>

            <div style="font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 24px; text-align: center;">
              <p style="margin: 0;">Integrity Verification ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              <p style="margin: 4px 0 0 0;">© 2026 GKRK Examination Systems. All rights reserved.</p>
            </div>
          </div>
        </div>
      `
    }

    let testUrl = null;

    if (transporter) {
      const info = await transporter.sendMail(mailOptions)
      console.log(`Email sent successfully to ${email} via SMTP: ${info.messageId}`)
    } else {
      console.log(`[SIMULATED EMAIL] To: ${email} | Subject: ${mailOptions.subject}`)
      testUrl = "simulated-email-no-url-available"
    }

    return NextResponse.json({ 
      success: true, 
      message: transporter ? "Email sent successfully" : "Email simulated successfully",
      testUrl
    })
  } catch (error) {
    console.error("Email API Detailed Error:", error)
    return NextResponse.json({ error: "Failed to send email", details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
