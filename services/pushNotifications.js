import webpush from "web-push";

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT;

if (!publicKey || !privateKey || !subject) {
    console.warn("Web Push is not configured. Check the VAPID environment variables.");
} else {
    webpush.setVapidDetails(subject, publicKey, privateKey);
}

// Development storage only.
// Replace with persistent database storage before production.
const subscriptions = [];

export function getVapidPublicKey() {
    return publicKey;
}

export function savePushSubscription({ storeId, waiterId, subscription }) {
    if (!storeId || !waiterId || !subscription?.endpoint ||
        !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
        throw new Error("Invalid push subscription.");
    }

    const existingIndex = subscriptions.findIndex(
        (item) => item.subscription.endpoint === subscription.endpoint
    );

    const entry = {
        storeId: String(storeId),
        waiterId: String(waiterId),
        subscription,
    };

    if (existingIndex >= 0) {
        subscriptions[existingIndex] = entry;
    } else {
        subscriptions.push(entry);
    }

    return entry;
}

export function removePushSubscription(endpoint) {
    const index = subscriptions.findIndex(
        (item) => item.subscription.endpoint === endpoint
    );

    if (index !== -1) subscriptions.splice(index, 1);
}

export async function notifyWaiter(storeId, waiterId, notification) {
    if (!publicKey || !privateKey || !subject) {
        console.warn("Skipping push notification: VAPID keys are missing.");
        return;
    }

    const targets = subscriptions.filter(
        (item) =>
            item.storeId === String(storeId) &&
            item.waiterId === String(waiterId)
    );

const payload = JSON.stringify({
    title: notification.title || "Tablewise",
    body: notification.body || "You have a new update.",
    url: notification.url || "/",
    tag: notification.tag || "tablewise-update",
    vibrate: [200, 100, 200, 100, 300],
    requireInteraction: true,
});

    await Promise.all(
        targets.map(async (item) => {
            try {
                await webpush.sendNotification(
                    item.subscription,
                    payload,
                    {
                        TTL: 60 * 60,
                        urgency: "high",
                    }
                );
            } catch (error) {
                console.error("Push notification failed:", error.statusCode || error.message);

                // A 404 or 410 means the subscription is no longer valid.
                if ([404, 410].includes(error.statusCode)) {
                    removePushSubscription(item.subscription.endpoint);
                }
            }
        })
    );
}