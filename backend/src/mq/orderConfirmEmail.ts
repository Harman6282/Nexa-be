import { Queue } from "bullmq";

const orderConfirmEmailSend = new Queue("orderConfirmEmailQueue");

type OrderEmailPayload = {
  orderId: string;
  email: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  paymentmethod: string;
};

export async function pushOrderToEmailQueue(data: OrderEmailPayload) {
  await orderConfirmEmailSend.add("orderConfirmEmailQueue", data);
}