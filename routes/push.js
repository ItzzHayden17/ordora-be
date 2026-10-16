import { Router } from "express";
import { stores } from "../data/store.js";
import {
    getVapidPublicKey,
    savePushSubscription,
    removePushSubscription,
    notifyWaiter,
} from "../services/pushNotifications.js";

const router = Router();

function findWaiter(storeId, waiterId) {
    const store = stores.find(
        (item) => String(item.id) === String(storeId)
    );

    if (!store) return null;

    const waiter = (store.waiters || []).find(
        (item) => String(item.id) === String(waiterId)
    );

    return waiter ? { store, waiter } : null;
}

// React uses this to subscribe a device.
router.get("/public-key", (req, res) => {
    const publicKey = getVapidPublicKey();

    if (!publicKey) {
        return res.status(503).json({
            success: false,
            message: "Push notifications are not configured.",
        });
    }

    res.json({ success: true, data: { publicKey } });
});

// Save a device's subscription for a specific waiter.
router.post("/subscribe", (req, res) => {
    const { storeId, waiterId, subscription } = req.body;

    if (!findWaiter(storeId, waiterId)) {
        return res.status(404).json({
            success: false,
            message: "Restaurant or waiter not found.",
        });
    }

    try {
        savePushSubscription({ storeId, waiterId, subscription });

        res.status(201).json({
            success: true,
            message: "Device subscribed to notifications.",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Invalid subscription.",
        });
    }
});

// Remove a device subscription.
router.post("/unsubscribe", (req, res) => {
    const { storeId, waiterId, endpoint } = req.body;

    if (!findWaiter(storeId, waiterId) || !endpoint) {
        return res.status(400).json({
            success: false,
            message: "Valid waiter details and endpoint are required.",
        });
    }

    removePushSubscription(endpoint);

    res.json({
        success: true,
        message: "Subscription removed.",
    });
});

// Temporary test endpoint. Protect this properly before production.
router.post("/test", async (req, res) => {
    const { storeId, waiterId } = req.body;

    if (!findWaiter(storeId, waiterId)) {
        return res.status(404).json({
            success: false,
            message: "Restaurant or waiter not found.",
        });
    }

    try {
        await notifyWaiter(storeId, waiterId, {
            title: "Tablewise test",
            body: "Your push notifications are working!",
            url: "/",
            tag: "tablewise-test",
        });

        res.json({
            success: true,
            message: "Test notification sent to subscribed devices.",
        });
    } catch (error) {
        console.error("Push test failed:", error);

        res.status(500).json({
            success: false,
            message: "Could not send the test notification.",
        });
    }
});

export default router;