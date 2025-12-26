import { Resend } from "resend";
import { ApiError } from "./apiError";

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
      subject: "Verify your email",
      html: `
        <h2>Welcome to Nexa</h2>
        <p>Please verify your email using the token below:</p>
        <strong>${verificationToken}</strong>
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
      error: error
    };
  } catch (err) {
    console.error("Send verification email failed:", err);

    throw err; // let controller / service handle retry or response
  }
}
