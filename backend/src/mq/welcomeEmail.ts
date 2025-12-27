import { Queue } from "bullmq";
import { Resend } from "resend";
import { ApiError } from "../utils/apiError";

const resend = new Resend(process.env.RESEND_API_KEY);

const welcomeEmailSend = new Queue("welcomeEmailQueue");

export async function pushEmailToQueue(email: string) {
  await welcomeEmailSend.add("welcomeEmailQueue", {email});
}
