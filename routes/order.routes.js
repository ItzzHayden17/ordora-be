
import { Router } from "express";
import { stores } from "../data/store.js";
import { createId } from "../utils/ids.js";
import { httpError } from "../utils/httpError.js";
import { notifyWaiter } from "../services/pushNotifications.js";

const router = Router();

// FIND RESTAURANT
function findRestaurant(storeId) {
    return stores.find((store) => store.id === storeId);
}

// GET ALL ORDERS FOR A RESTAURANT
router.get("/:storeId", (req, res, next) => {
    const { storeId } = req.params;
    const { status, partyId } = req.query;

    const restaurant = findRestaurant(storeId);

    if (!restaurant) {
        return next(httpError(404, "Restaurant not found"));
    }

    let orders = [...restaurant.orders];

    if (status) {
        orders = orders.filter((order) => order.status === status);
    }

    if (partyId) {
        orders = orders.filter(
            (order) => String(order.partyId) === String(partyId)
        );
    }

    return res.json({
        success: true,
        data: orders,
    });
});

// GET A SPECIFIC ORDER
router.get("/:storeId/:orderId", (req, res, next) => {
    const { storeId, orderId } = req.params;

    const restaurant = findRestaurant(storeId);

    if (!restaurant) {
        return next(httpError(404, "Restaurant not found"));
    }

    const order = restaurant.orders.find(
        (entry) => entry.id === orderId
    );

    if (!order) {
        return next(httpError(404, "Order not found"));
    }

    return res.json({
        success: true,
        data: order,
    });
});

// CREATE AN ORDER
router.post("/:storeId", (req, res, next) => {
    
    const { storeId } = req.params;

    const {
        partyId,
        customerName = "",
        billingPreference = "combined",
        items,
    } = req.body;

    const restaurant = findRestaurant(storeId);

    if (!restaurant) {
        return next(httpError(404, "Restaurant not found"));
    }

    const party = restaurant.parties.find(
        (entry) => String(entry.id) === String(partyId)
    );

    if (!party) {
        return next(httpError(400, "A valid partyId is required"));
    }

    if (!["Active", "Needs help"].includes(party.status)) {
        return next(httpError(400, "This party is closed"));
    }

    if (!["combined", "separate"].includes(billingPreference)) {
        return next(
            httpError(
                400,
                "billingPreference must be combined or separate"
            )
        );
    }

    if (!Array.isArray(items) || items.length === 0) {
        return next(
            httpError(400, "items must be a non-empty array")
        );
    }

    const resolvedItems = [];

    for (const requestedItem of items) {
        const product = restaurant.menu.find(
            (entry) =>
                entry.id === String(requestedItem.productId) &&
                entry.available
        );

        if (!product) {
            return next(
                httpError(
                    400,
                    `Unavailable menu item: ${requestedItem.productId}`
                )
            );
        }

        if (
            !Number.isInteger(requestedItem.quantity) ||
            requestedItem.quantity < 1 ||
            requestedItem.quantity > 99
        ) {
            return next(
                httpError(
                    400,
                    "Each item quantity must be an integer from 1 to 99"
                )
            );
        }

        resolvedItems.push({
            productId: product.id,
            name: product.name,
            quantity: requestedItem.quantity,
            unitPrice: product.price,
        });
    }

    const total = resolvedItems.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
    );

    const order = {
        id: createId("ORD").toUpperCase(),
        partyId: party.id,
        customerName,
        billingPreference,
        items: resolvedItems,
        total: Number(total.toFixed(2)),
        status: "Pending",
        rejectionReason: null,
        createdAt: new Date().toISOString(),
    };

    restaurant.orders.push(order);

    // Notify the waiter assigned to this party. Push failures must not
    // prevent the customer order from being accepted.
    if (party.waiterId) {
        notifyWaiter(restaurant.id, party.waiterId, {
            title: "New customer order",
            body: `Party #${party.id}${party.location ? ` · ${party.location}` : ""} has placed an order.`,
            url: "/waiter#orders",
            tag: `new-order-${order.id}`,
        }).catch((error) => {
            console.error("Failed to notify waiter about order:", error);
        });
    }

    return res.status(201).json({
        success: true,
        data: order,
    });
});

// UPDATE ORDER STATUS
// Supports both:
// PATCH /:storeId/:orderId
// PATCH /:storeId/:orderId/status
async function updateOrderStatus(req, res, next) {
    const { storeId, orderId } = req.params;

    const restaurant = findRestaurant(storeId);

    if (!restaurant) {
        return next(httpError(404, "Restaurant not found"));
    }

    const order = restaurant.orders.find(
        (entry) => entry.id === orderId
    );

    if (!order) {
        return next(httpError(404, "Order not found"));
    }

    const { status } = req.body;

    // Accept either property name from the frontend.
    const reason =
        req.body.rejectionReason ?? req.body.reason ?? "";

    if (!["Confirmed", "Rejected"].includes(status)) {
        return next(
            httpError(
                400,
                "status must be Confirmed or Rejected"
            )
        );
    }

    if (order.status !== "Pending") {
        return next(
            httpError(
                409,
                "Only pending orders can change status"
            )
        );
    }

    if (status === "Rejected" && !String(reason).trim()) {
        return next(
            httpError(400, "A rejection reason is required")
        );
    }

    order.status = status;
    order.rejectionReason =
        status === "Rejected" ? String(reason).trim() : null;
    order.updatedAt = new Date().toISOString();

    return res.json({
        success: true,
        data: order,
    });
}

// Keep the more specific route before the general route.
router.patch("/:storeId/:orderId/status", updateOrderStatus);
router.patch("/:storeId/:orderId", updateOrderStatus);

export default router;
