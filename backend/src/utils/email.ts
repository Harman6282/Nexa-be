import { Resend } from "resend";
import { ApiError } from "./apiError";
import { Job, Worker } from "bullmq";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  verificationToken: string
) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not defined");
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Nexa Clothing Store <send@nexa.harmanxze.com>",
      to: [email],
      subject: "Your Nexa Fashion Verification Code",
      html: `
        <tr> <td style="background:#000000; padding:24px; text-align:center;"> 
        <h1 style="margin:0; color:#ffffff; font-size:26px; letter-spacing:1px;"> Nexa Fashion </h1> 
        </td> </tr> <!-- Body --> <tr> <td style="padding:30px;"> 
        <h2 style="margin-top:0; color:#222222; font-size:22px;"> Verify Your Email Address </h2> 
        <p style="color:#555555; font-size:16px; line-height:1.6;"> Thanks for signing up with <strong>Nexa Fashion</strong>. Please use the verification code below to confirm your email address. 
        </p>
         <!-- OTP Box --> 
         <div style="text-align:center; margin:30px 0;"> <div style=" display:inline-block; background:#f2f2f2; padding:16px 32px; font-size:28px; letter-spacing:6px; font-weight:bold; color:#000000; border-radius:6px; " > ${verificationToken}</div> 
         </div> <p style="color:#555555; font-size:16px; line-height:1.6;"> This code will expire in <strong>15 minutes</strong>. For your security, do not share this code with anyone. </p> <p style="color:#777777; font-size:14px; line-height:1.6;"> If you didn’t request this verification, you can safely ignore this email. 
         </p>
          <p style="color:#555555; font-size:16px; margin-bottom:0;"> Stay stylish,<br /> <strong>Team Nexa</strong> </p> 
          </td> </tr> 
          <!-- Footer --> 
          <tr> <td style="background:#f0f0f0; padding:20px; text-align:center;"> 
          <p style="margin:0; font-size:12px; color:#999999;"> © 2025 Nexa Fashion. All rights reserved. </p> </td> </tr> </table> </td> </tr> </table>

      `,
    });

    if (error) {
      console.error("Resend email error:", error);
      throw new ApiError(
        error.statusCode || 500,
        "Failed to send verification email",
        error.message ? [error.message] : undefined
      );
    }

    return {
      success: true,
      messageId: data?.id,
      error: error,
    };
  } catch (err) {
    console.error("Send verification email failed:", err);

    throw err;
  }
}

const welcomeEmailWorker = new Worker(
  "welcomeEmailQueue",
  async (Job) => {
    const email = Job.data.email;
    await sendWelcomeEmail(email);
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

export async function sendWelcomeEmail(email: string) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not defined");
  }

  console.log("Sending welcome email to:", email);

  try {
    const { data, error } = await resend.emails.send({
      from: "Nexa Clothing Store <send@nexa.harmanxze.com>",
      to: [email],
      subject: "Welcome to Nexa Fashion — Where Style Begins",
      html: `
       <tr> 
        <td style="background:#000000; padding:24px; text-align:center;">
          <h1 style="margin:0; color:#ffffff; font-size:26px; letter-spacing:1px;"> Nexa Fashion </h1> 
        </td> 
      </tr> 
      <tr> 
        <td style="padding:30px;"> 
        <h2 style="margin-top:0; color:#222222; font-size:22px;"> Welcome to Nexa 👋 </h2> 
        <p style="color:#555555; font-size:16px; line-height:1.6;"> We’re excited to have you join <strong>Nexa Fashion</strong> — a place where modern style meets everyday comfort. </p> 
        <p style="color:#555555; font-size:16px; line-height:1.6;"> From premium fabrics to trend-forward designs, we’re here to upgrade your wardrobe with confidence. </p> 
        <div style="text-align:center; margin:35px 0;"> <a href="nexa.harmanxze.com" style=" background:#000000; color:#ffffff; padding:14px 28px; text-decoration:none; font-size:16px; border-radius:4px; display:inline-block; " > Start Shopping </a> 
        </div> 
        <p style="color:#777777; font-size:14px; line-height:1.6;"> If you have any questions, just reply to this email — we’re always happy to help. </p> 
        <p style="color:#555555; font-size:16px; margin-bottom:0;"> Stay stylish,<br /> <strong>Team Nexa</strong> </p> 
        </td> 
        </tr> 
        <tr> 
        <td style="background:#f0f0f0; padding:20px; text-align:center;"> <p style="margin:0; font-size:12px; color:#999999;"> © 2025 Nexa Fashion. All rights reserved. </p> 
        </td> 
        </tr> 
        </table> 
        </td> 
        </tr> 
        </table>

        
      `,
    });

    if (error) {
      console.error("Resend email error:", error);
      throw new ApiError(
        error.statusCode || 500,
        "Failed to send verification email",
        error.message ? [error.message] : undefined
      );
    }

    return {
      success: true,
      messageId: data?.id,
      error: error,
    };
  } catch (err) {
    console.error("Send verification email failed:", err);
    throw err;
  }
}
