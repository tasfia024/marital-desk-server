import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "../config/index.js";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(STRIPE_SECRET_KEY);
const prisma = new PrismaClient();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

export async function createCheckoutSession(req, res, next) {
    try {
        const { price, userName, userEmail, marriageApplicationId } = req.body;

        if (!price || !userName || !userEmail) {
            return res.status(400).json({
                message: "Price, user name, and email are required"
            });
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd", // Stripe primarily uses USD; convert from local currency or adjust as needed
                        product_data: {
                            name: "Marriage Application Package",
                            description: "Complete marriage registration package including Kazi fee, registry fee, and service charges",
                            images: []
                        },
                        unit_amount: Math.round(price * 100) // Convert to cents
                    },
                    quantity: 1
                }
            ],
            mode: "payment",
            customer_email: userEmail,
            success_url: `${CLIENT_URL}/marital-desk/marriage-applications/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${CLIENT_URL}/marital-desk/marriage-applications/payment/cancel`,
            metadata: {
                userName: userName,
                userEmail: userEmail,
                marriageApplicationId: marriageApplicationId || ""
            }
        });

        res.status(200).json({
            url: session.url,
            sessionId: session.id
        });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        next(error);
    }
}

export async function handlePaymentSuccess(req, res, next) {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                message: "Session ID is required"
            });
        }

        // Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== "paid") {
            return res.status(400).json({
                message: "Payment not completed"
            });
        }

        // Generate transaction ID
        const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Update marriage application isPaid status if marriageApplicationId exists
        if (session.metadata?.marriageApplicationId) {
            await prisma.marriageApplication.update({
                where: { id: session.metadata.marriageApplicationId },
                data: { isPaid: true }
            });
        }

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            transactionId: transactionId,
            sessionId: session.id,
            customerEmail: session.customer_email,
            amount: session.amount_total / 100, // Convert from cents to original currency
            paymentStatus: session.payment_status,
            marriageApplicationId: session.metadata?.marriageApplicationId
        });
    } catch (error) {
        console.error("Error handling payment success:", error);
        next(error);
    }
}

export async function verifyPaymentSession(req, res, next) {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({
                message: "Session ID is required"
            });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        res.status(200).json({
            sessionId: session.id,
            paymentStatus: session.payment_status,
            customerEmail: session.customer_email,
            amount: session.amount_total / 100,
            metadata: session.metadata
        });
    } catch (error) {
        console.error("Error verifying payment session:", error);
        next(error);
    }
}

export async function cancelPayment(req, res, next) {
    try {
        res.status(200).json({
            message: "Payment cancelled",
            success: false
        });
    } catch (error) {
        console.error("Error cancelling payment:", error);
        next(error);
    }
}
