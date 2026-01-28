import PaytmChecksum from 'paytmchecksum';
import https from 'https';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

dotenv.config();

export const createOrder = async (req, res) => {
    try {
        const { plan } = req.body;
        const userId = req.user.id;

        // Validation for credentials
        if (!process.env.PAYTM_MERCHANT_ID || !process.env.PAYTM_MERCHANT_KEY) {
            console.error("CRITICAL: Missing Paytm Credentials in .env");
            return res.status(500).json({ error: "Server Configuration Error: Missing Paytm Credentials" });
        }

        if (!plan) {
            return res.status(400).json({ error: "Plan is required" });
        }

        let amount = "0";
        switch (plan.toLowerCase()) {
            case 'basic':
                amount = "0";
                break;
            case 'pro':
                amount = "499.00";
                break;
            case 'king':
                amount = "1499.00";
                break;
            default:
                return res.status(400).json({ error: "Invalid plan selected" });
        }

        // If amount is 0 (Basic plan), update user immediately
        if (amount === "0") {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    plan: 'Basic',
                    subscription: {
                        status: 'active',
                        currentPeriodEnd: null
                    }
                },
                { new: true }
            );
            return res.status(200).json({ message: "Plan updated to Basic", user: updatedUser, amount: 0 });
        }

        // 1. Generate Order ID
        const orderId = `PY${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 999)}`;

        const amountFormatted = parseFloat(amount).toFixed(2);
        const mid = (process.env.PAYTM_MERCHANT_ID || "").trim();
        const key = (process.env.PAYTM_MERCHANT_KEY || "").trim();
        const websiteFromEnv = (process.env.PAYTM_WEBSITE || "WEBSTAGING").trim();
        const callbackUrl = (process.env.PAYTM_CALLBACK_URL || `http://localhost:5173/payment/verify`).trim();

        if (!mid || !key) {
            return res.status(500).json({ error: "Missing Paytm credentials" });
        }

        if (key.length !== 16) {
            console.warn(`[Paytm] WARNING: Merchant Key length is ${key.length}, expected 16.`);
        }

        console.log(`[Paytm] Initiating Order: ${orderId} | MID: ${mid}`);

        const isStaging = mid.startsWith('SrctYa') || websiteFromEnv === 'WEBSTAGING';
        const hostname = isStaging ? 'securegw-stage.paytm.in' : 'securegw.paytm.in';

        const initiateTransaction = async (website, channel, industry) => {
            const body = {
                requestType: "Payment",
                mid: mid,
                websiteName: website,
                orderId: orderId,
                callbackUrl: callbackUrl,
                txnAmount: {
                    value: amountFormatted,
                    currency: "INR",
                },
                userInfo: {
                    custId: "CUST001",
                }
            };

            if (channel) body.channelId = channel;
            if (industry) body.industryTypeId = industry;

            const bodyString = JSON.stringify(body);
            const signature = await PaytmChecksum.generateSignature(bodyString, key);

            const payload = {
                head: {
                    mid: mid, // Added MID to head - required by some v1 setups
                    signature: signature,
                    version: "v1"
                },
                body: body
            };

            const url = `https://${hostname}/theia/api/v1/initiateTransaction?mid=${mid}&orderId=${orderId}`;

            console.log(`[Paytm] Testing: ${website} | ${channel} | ${industry}`);

            return axios.post(url, payload, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000
            });
        };

        const trials = [
            { w: websiteFromEnv, c: "WEB", i: "Retail" },
            { w: "DEFAULT", c: "WEB", i: "Retail" },
            { w: websiteFromEnv, c: "WAP", i: "Retail" }
        ];

        let paytmRes = null;
        let success = false;

        for (let i = 0; i < trials.length; i++) {
            try {
                const response = await initiateTransaction(trials[i].w, trials[i].c, trials[i].i);
                paytmRes = response.data;

                if (paytmRes.body?.resultInfo?.resultStatus === 'S') {
                    console.log(`[Paytm] Success! Combination ${i + 1} worked.`);
                    success = true;
                    break;
                }

                console.warn(`[Paytm] Trial ${i + 1} failed: ${paytmRes.body?.resultInfo?.resultCode} - ${paytmRes.body?.resultInfo?.resultMsg}`);
            } catch (err) {
                console.error(`[Paytm] Connection Error: ${err.message}`);
            }
        }

        if (success && paytmRes) {
            res.status(200).json({
                txnToken: paytmRes.body.txnToken,
                orderId: orderId,
                amount: amount,
                mid: mid
            });
        } else {
            console.error("[Paytm] All efforts failed. Last Response:", JSON.stringify(paytmRes, null, 2));
            res.status(500).json({
                error: "Paytm Gateway Error (501)",
                details: "Gateway failed to respond. Please check if your Staging MID/Key are still active in the Paytm Dashboard.",
                raw: paytmRes
            });
        }

    } catch (error) {
        console.error("Critical Paytm Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { plan, amount, STATUS, CHECKSUMHASH, ORDERID, TXNID } = req.body;
        const userId = req.user.id;

        // Exclude CHECKSUMHASH from the params to verify
        const paytmParams = {};
        for (const key in req.body) {
            if (key !== "CHECKSUMHASH" && key !== "plan" && key !== "amount") {
                paytmParams[key] = req.body[key];
            }
        }

        if (STATUS === 'TXN_SUCCESS') {
            // Update User Plan
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    plan: plan || (amount > 500 ? 'King' : 'Pro'), // Fallback if plan name missing
                    subscription: {
                        status: 'active',
                        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
                    }
                },
                { new: true }
            );

            // Create Transaction Record
            await Transaction.create({
                buyerId: userId,
                transactionId: TXNID,
                amount: amount,
                plan: plan,
                paymentId: TXNID,
                orderId: ORDERID,
                status: 'success'
            });

            res.status(200).json({
                message: "Payment verified successfully",
                user: updatedUser
            });
        } else {
            res.status(400).json({ error: "Payment failed or pending" });
        }

    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).json({ error: "Failed to verify payment" });
    }
};

export const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const transactions = await Transaction.find({ buyerId: userId }).sort({ createdAt: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Fetch Transactions Error:", error);
        res.status(500).json({ error: "Failed to fetch transaction history" });
    }
};
