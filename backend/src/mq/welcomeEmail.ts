import { Queue } from "bullmq";
const welcomeEmailSend = new Queue("welcomeEmailQueue");

export async function pushEmailToQueue(email: string) {
  await welcomeEmailSend.add("welcomeEmailQueue", {email});
}
