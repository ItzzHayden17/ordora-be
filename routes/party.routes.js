import { Router } from 'express';
import { stores } from '../data/store.js';
import { createId } from '../utils/ids.js';
import { httpError } from '../utils/httpError.js';

const router = Router();

router.get("/:storeId", (req, res, next) => {
    const { storeId } = req.params;
    const { status, waiter } = req.query;

    const restaurant = stores.find(
        store => store.id === storeId
    );

    if (!restaurant) {
        return next(httpError(404, "Restaurant not found"));
    }

    let parties = [...restaurant.parties];

    if (status) {
        parties = parties.filter(
            party => party.status === status
        );
    }

    if (waiter) {
        parties = parties.filter(
            party => party.waiterName
                .toLowerCase()
                .includes(String(waiter).toLowerCase())
        );
    }

    res.json({
        success: true,
        data: parties
    });
});


router.get("/:storeId/:partyId", (req, res, next) => {
    const { storeId, partyId } = req.params;

    const restaurant = stores.find(
        store => store.id === storeId
    );

    if (!restaurant) {
        return next(httpError(404, "Restaurant not found"));
    }

    const party = restaurant.parties.find(
        entry => entry.id === partyId
    );

    if (!party) {
        return next(httpError(404, "Party not found"));
    }

    const orders = restaurant.orders.filter(
        order => order.partyId === party.id
    );

    const requests = restaurant.requests.filter(
        request => request.partyId === party.id
    );

    res.json({
        success: true,
        data: {
            ...party,
            orders,
            requests,
            restaurant: {
            id: restaurant.id,
            name: restaurant.name,
            location: restaurant.location,
            description: restaurant.description,
            currency: restaurant.currency,
            branding: restaurant.branding
        },
        }
    });
})

//Post 



router.post("/:storeId", (req, res, next) => {
    const { storeId } = req.params;

    const {
        location = "",
        waiterId,
        waiterName,
        customerCount = 1
    } = req.body;

    if (!waiterId || !waiterName) {
        return next(httpError(400, "Waiter information is required"));
    }

    if (!location.trim()) {
        return next(httpError(400, "Table or location is required"));
    }

    const restaurant = stores.find(
        (store) => store.id === storeId
    );

    if (!restaurant) {
        return next(httpError(404, "Restaurant not found"));
    }

    const waiter = restaurant.waiters?.find(
        (entry) => String(entry.id) === String(waiterId)
    );

    if (!waiter) {
        return next(
            httpError(403, "Waiter does not belong to this restaurant")
        );
    }

    // Validate the number of customers
    const parsedCustomerCount = Number(customerCount);

    if (
        !Number.isInteger(parsedCustomerCount) ||
        parsedCustomerCount < 1
    ) {
        return next(
            httpError(400, "Customer count must be a positive whole number")
        );
    }

    const party = {
        id: createId("P"),
        location: location.trim(),
        customerCount: parsedCustomerCount,
        customers: [],
        waiterId: waiter.id,
        waiterName: waiter.name,
        status: "Active",
        billingPreference: "combined",
        createdAt: new Date().toISOString()
    };

    // Save the party, including its customer count
    restaurant.parties.push(party);

    return res.status(201).json({
        success: true,
        message: "Party created successfully",
        data: party
    });
});


//PATCH

router.patch("/:storeId/:partyId", (req, res, next) => {
    const { storeId, partyId } = req.params;
    const { billingPreference } = req.body;

    const restaurant = stores.find((store) => store.id === storeId);
    if (!restaurant) return next(httpError(404, "Restaurant not found"));

    const party = restaurant.parties.find(
        (entry) => String(entry.id) === String(partyId)
    );
    if (!party) return next(httpError(404, "Party not found"));

    if (!["Active", "Needs help"].includes(party.status)) {
        return next(httpError(400, "This party is not active"));
    }

    if (!["combined", "separate"].includes(billingPreference)) {
        return next(
            httpError(400, "billingPreference must be combined or separate")
        );
    }

    party.billingPreference = billingPreference;
    party.updatedAt = new Date().toISOString();

    return res.json({ success: true, data: party });
});


/**
 * CLOSE A PARTY
 * PATCH /:storeId/:partyId/close
 */
router.patch("/:storeId/:partyId/close", (req, res, next) => {
    const { storeId, partyId } = req.params;

    const restaurant = stores.find(
        (store) => String(store.id) === String(storeId)
    );

    if (!restaurant) {
        return next(httpError(404, "Restaurant not found"));
    }

    const party = restaurant.parties.find(
        (entry) => String(entry.id) === String(partyId)
    );

    if (!party) {
        return next(httpError(404, "Party not found"));
    }

    if (!["Active", "Needs help"].includes(party.status)) {
        return next(
            httpError(400, "This party is already closed or inactive")
        );
    }


    party.status = "Closed";
    party.closedAt = new Date().toISOString();
    party.updatedAt = party.closedAt;

    return res.json({
        success: true,
        message: "Party closed successfully",
        data: party
    });
});



export default router;