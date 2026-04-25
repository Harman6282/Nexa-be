"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = sendVerificationEmail;
exports.sendWelcomeEmail = sendWelcomeEmail;
exports.sendOrderConfirmationEmail = sendOrderConfirmationEmail;
const resend_1 = require("resend");
const apiError_1 = require("./apiError");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
function sendVerificationEmail(email, verificationToken) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY is not defined");
        }
        try {
            const { data, error } = yield resend.emails.send({
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
                throw new apiError_1.ApiError(error.statusCode || 500, "Failed to send verification email", error.message ? [error.message] : undefined);
            }
            return {
                success: true,
                messageId: data === null || data === void 0 ? void 0 : data.id,
                error: error,
            };
        }
        catch (err) {
            console.error("Send verification email failed:", err);
            throw err;
        }
    });
}
function sendWelcomeEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY is not defined");
        }
        try {
            const { data, error } = yield resend.emails.send({
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
                throw new apiError_1.ApiError(error.statusCode || 500, "Failed to send verification email", error.message ? [error.message] : undefined);
            }
            return {
                success: true,
                messageId: data === null || data === void 0 ? void 0 : data.id,
                error: error,
            };
        }
        catch (err) {
            console.error("Send verification email failed:", err);
            throw err;
        }
    });
}
// order confirmation email
function sendOrderConfirmationEmail(email, orderId, customerName, orderDate, totalAmount, paymentmethod) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY is not defined");
        }
        try {
            const { data, error } = yield resend.emails.send({
                from: "Nexa Clothing Store <send@nexa.harmanxze.com>",
                to: [email],
                subject: "Your order has been confirmed 🎉",
                html: `
     
      <!-- Header --> 
      <tr> 
       <td style="padding: 24px; text-align:center; background-color:#000000; color:#ffffff;"> 
       <h1 style="margin:0; font-size:22px;">Nexa Fashion</h1> 
       </td> 
      </tr>
        <!-- Body --> 
        <tr> 
        <td style="padding: 32px;"> 
         <h2 style="margin-top:0; font-size:20px;">Order Confirmed 🎉</h2> 
         <p style="font-size:14px; color:#333333;"> Hi <strong>${customerName}</strong>, 
         </p> <p style="font-size:14px; color:#333333;"> Thank you for your order! We’ve successfully received it and it’s now being processed. </p> 
         <!-- Order Details --> 
         <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0; font-size:14px;">
         <tr> 
         <td style="padding: 6px 0; color:#555;">Order ID:</td> <td style="padding: 6px 0; text-align:right;"><strong>${orderId}</strong></td> 
         </tr> 
         <tr> 
          <td style="padding: 6px 0; color:#555;">Order Date:</td> 
          <td style="padding: 6px 0; text-align:right;">${orderDate}</td> 
          </tr> 
    // <tr> 
    // <td style="padding: 6px 0; color:#555;">Items:</td> 
    // <td style="padding: 6px 0; text-align:right;">{{itemsSummary}}</td>  
    // </tr> 
          <tr> <td style="padding: 6px 0; color:#555;">Payment Method:</td> <td style="padding: 6px 0; text-align:right;">${paymentmethod}</td> 
          </tr> 
          <tr> <td style="padding: 12px 0; font-size:16px;"><strong>Total Paid:</strong></td> 
          <td style="padding: 12px 0; text-align:right; font-size:16px;"> <strong>₹${totalAmount}</strong> </td> </tr> 
          </table> <p style="font-size:14px; color:#333333;"> You’ll receive another email once your order is shipped. </p> 
          <p style="font-size:14px; color:#333333;"> If you have any questions, feel free to reach out to us. </p> 
          <p style="font-size:14px; color:#333333; margin-bottom:0;"> Thanks for shopping with us,<br /> <strong>Nexa Fashion Team</strong> 
          </p>
           </td> </tr>
            <!-- Footer --> 
            <tr> <td style="padding: 16px; text-align:center; background-color:#f9f9f9; font-size:12px; color:#777;"> © 2025 Nexa Fashion · Demo Project </td> 
            </tr> </table> </td> </tr> </table>

      `,
            });
            if (error) {
                console.error("Resend email error:", error);
                throw new apiError_1.ApiError(error.statusCode || 500, "Failed to send verification email", error.message ? [error.message] : undefined);
            }
            return {
                success: true,
                messageId: data === null || data === void 0 ? void 0 : data.id,
                error: error,
            };
        }
        catch (err) {
            console.error("Send verification email failed:", err);
            throw err;
        }
    });
}
