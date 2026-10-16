import { Router } from 'express';
import { stores } from '../data/store.js';
import { createId } from '../utils/ids.js';
import { httpError } from '../utils/httpError.js';
import { notifyWaiter } from '../services/pushNotifications.js';

const router = Router();

// FIND RESTAURANT
function findRestaurant(storeId) {
    return stores.find((store) => store.id === storeId);
}

// UPDATE PARTY HELP STATUS
function updatePartyHelpStatus(restaurant, partyId) {
    const party = restaurant.parties.find(
        (entry) => String(entry.id) === String(partyId)
    );

    if (!party) return;

    // Do not overwrite other party statuses, such as Closed.
    if (party.status === 'Closed') return;

    const hasOpenRequests = restaurant.requests.some(
        (request) =>
            String(request.partyId) === String(partyId) &&
            ['Open', 'Pending'].includes(request.status)
    );

    party.status = hasOpenRequests ? 'Needs help' : 'Active';
}

// GET ALL REQUESTS FOR A RESTAURANT
router.get('/:storeId', (req, res, next) => {
    const { storeId } = req.params;
    const { status, partyId, type } = req.query;

    const restaurant = findRestaurant(storeId);

    if (!restaurant) {
        return next(httpError(404, 'Restaurant not found'));
    }

    let requests = [...restaurant.requests];

    if (status) {
        requests = requests.filter(
            (request) => request.status === status
        );
    }

    if (partyId) {
        requests = requests.filter(
            (request) =>
                String(request.partyId) === String(partyId)
        );
    }

    if (type) {
        requests = requests.filter(
            (request) => request.type === type
        );
    }

    return res.json({
        success: true,
        data: requests
    });
});

// CREATE A REQUEST
router.post('/:storeId', (req, res, next) => {
    const { storeId } = req.params;
    const { partyId, type } = req.body;

    const restaurant = findRestaurant(storeId);

    if (!restaurant) {
        return next(httpError(404, 'Restaurant not found'));
    }

    const party = restaurant.parties.find(
        (entry) => String(entry.id) === String(partyId)
    );

    if (!party || !['Active', 'Needs help'].includes(party.status)) {
        return next(
            httpError(400, 'An active partyId is required')
        );
    }

    if (!['Call waiter', 'Request bill'].includes(type)) {
        return next(
            httpError(400, 'type must be Call waiter or Request bill')
        );
    }

    const request = {
        id: createId('REQ'),
        partyId: party.id,
        type,
        status: 'Open',
        createdAt: new Date().toISOString()
    };

    restaurant.requests.push(request);

    // A new open request means the party needs help.
    updatePartyHelpStatus(restaurant, party.id);

    // Notify the waiter assigned to this party without blocking the request.
    if (party.waiterId) {
        const isWaiterCall = request.type === 'Call waiter';

        notifyWaiter(restaurant.id, party.waiterId, {
            title: isWaiterCall ? 'Customer needs you' : 'Customer requested the bill',
            body: `${request.type} · Party #${party.id}${party.location ? ` · ${party.location}` : ''}`,
            url: '/waiter#requests',
            tag: `customer-request-${request.id}`,
        }).catch((error) => {
            console.error('Failed to notify waiter about request:', error);
        });
    }

    return res.status(201).json({
        success: true,
        data: request
    });
});

// ACKNOWLEDGE A REQUEST
router.patch('/:storeId/:requestId/acknowledge', (req, res, next) => {
    const { storeId, requestId } = req.params;

    const restaurant = findRestaurant(storeId);

    if (!restaurant) {
        return next(httpError(404, 'Restaurant not found'));
    }

    const request = restaurant.requests.find(
        (entry) => String(entry.id) === String(requestId)
    );

    if (!request) {
        return next(httpError(404, 'Request not found'));
    }

    if (request.status !== 'Open' && request.status !== 'Pending') {
        return next(
            httpError(409, 'Request has already been acknowledged')
        );
    }

    request.status = 'Acknowledged';
    request.acknowledgedAt = new Date().toISOString();

    // Recalculate the party status after acknowledging this request.
    updatePartyHelpStatus(restaurant, request.partyId);

    return res.json({
        success: true,
        data: request
    });
});

export default router;