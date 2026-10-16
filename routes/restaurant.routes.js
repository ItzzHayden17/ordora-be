import { Router } from 'express';
import { httpError } from '../utils/httpError.js';
import { stores } from '../data/store.js';
import { createId } from '../utils/ids.js';

const router = Router();

const safeWaiter = (waiter) => {
    if (!waiter) return waiter;

    const { password, ...publicWaiter } = waiter;
    return publicWaiter;
};

const findRestaurant = (storeId) =>
    stores.find((store) => String(store.id) === String(storeId));

const validEmail = (email) =>
    typeof email === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());


// GET ALL RESTAURANTS
router.get('/', (_req, res) => {
    const data = stores.map(({ password, waiters, ...restaurant }) => ({
        ...restaurant,
        waiters: (waiters || []).map(safeWaiter),
    }));

    res.json({
        success: true,
        data,
    });
});


// GET ONE RESTAURANT
router.get('/:storeId', (req, res, next) => {
    const restaurant = findRestaurant(req.params.storeId);

    if (!restaurant) {
        return next(httpError(404, 'Restaurant not found'));
    }

    const { password, waiters, ...publicRestaurant } = restaurant;

    return res.json({
        success: true,
        data: {
            ...publicRestaurant,
            waiters: (waiters || []).map(safeWaiter),
        },
    });
});


// GET WAITERS FOR A RESTAURANT
router.get('/:storeId/waiters', (req, res, next) => {
    const restaurant = findRestaurant(req.params.storeId);

    if (!restaurant) {
        return next(httpError(404, 'Restaurant not found'));
    }

    return res.json({
        success: true,
        data: (restaurant.waiters || []).map(safeWaiter),
    });
});


// RESTAURANT ADMIN LOGIN
router.post('/login', (req, res) => {
    const email = String(req.body?.email || '')
        .trim()
        .toLowerCase();

    const password = req.body?.password;

    const restaurant = stores.find(
        (store) =>
            String(store.email || '').trim().toLowerCase() === email &&
            store.password === password
    );

    if (!restaurant) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password',
        });
    }

    return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            id: restaurant.id,
            name: restaurant.name,
            email: restaurant.email,
        },
    });
});


// WAITER LOGIN
router.post('/waiter/login', (req, res) => {
    const email = String(req.body?.email || '')
        .trim()
        .toLowerCase();

    const password = req.body?.password;

    const restaurant = stores.find((store) =>
        (store.waiters || []).some(
            (waiter) =>
                String(waiter.email || '').trim().toLowerCase() === email &&
                waiter.password === password
        )
    );

    if (!restaurant) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password',
        });
    }

    const waiter = restaurant.waiters.find(
        (entry) =>
            String(entry.email || '').trim().toLowerCase() === email &&
            entry.password === password
    );

    return res.status(200).json({
        success: true,
        message: 'Waiter login successful',
        data: {
            waiterId: waiter.id,
            waiterName: waiter.name,
            email: waiter.email,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
        },
    });
});


// CREATE A WAITER
router.post('/:storeId/waiters', (req, res, next) => {
    const restaurant = findRestaurant(req.params.storeId);

    if (!restaurant) {
        return next(httpError(404, 'Restaurant not found'));
    }

    const name =
        typeof req.body?.name === 'string'
            ? req.body.name.trim()
            : '';

    const email =
        typeof req.body?.email === 'string'
            ? req.body.email.trim().toLowerCase()
            : '';

    const password = req.body?.password;

    if (!name) {
        return next(httpError(400, 'Waiter name is required'));
    }

    if (!validEmail(email)) {
        return next(
            httpError(400, 'A valid email address is required')
        );
    }

    if (
        typeof password !== 'string' ||
        password.length < 6
    ) {
        return next(
            httpError(
                400,
                'Password must be at least 6 characters long'
            )
        );
    }

    restaurant.waiters ||= [];

    const emailExists = restaurant.waiters.some(
        (waiter) =>
            String(waiter.email || '').trim().toLowerCase() === email
    );

    if (emailExists) {
        return next(
            httpError(
                409,
                'A waiter with this email already exists'
            )
        );
    }

    const waiter = {
        id: createId('W'),
        name,
        email,
        password,
        status: 'Active',
    };

    restaurant.waiters.push(waiter);

    return res.status(201).json({
        success: true,
        message: 'Waiter created successfully',
        data: safeWaiter(waiter),
    });
});


// UPDATE WAITER DETAILS OR RESET PASSWORD
router.patch('/:storeId/waiters/:waiterId', (req, res, next) => {
    const restaurant = findRestaurant(req.params.storeId);

    if (!restaurant) {
        return next(httpError(404, 'Restaurant not found'));
    }

    restaurant.waiters ||= [];

    const waiter = restaurant.waiters.find(
        (entry) =>
            String(entry.id) === String(req.params.waiterId)
    );

    if (!waiter) {
        return next(httpError(404, 'Waiter not found'));
    }

    const {
        name,
        email,
        password,
        status,
    } = req.body || {};

    if (name !== undefined) {
        if (
            typeof name !== 'string' ||
            !name.trim()
        ) {
            return next(
                httpError(
                    400,
                    'Waiter name must be a non-empty string'
                )
            );
        }
    }

    if (email !== undefined) {
        if (!validEmail(email)) {
            return next(
                httpError(400, 'A valid email address is required')
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        const emailExists = restaurant.waiters.some(
            (entry) =>
                String(entry.id) !== String(waiter.id) &&
                String(entry.email || '').trim().toLowerCase() ===
                    normalizedEmail
        );

        if (emailExists) {
            return next(
                httpError(
                    409,
                    'A waiter with this email already exists'
                )
            );
        }
    }

    if (password !== undefined && password !== '') {
        if (
            typeof password !== 'string' ||
            password.length < 6
        ) {
            return next(
                httpError(
                    400,
                    'Password must be at least 6 characters long'
                )
            );
        }
    }

    if (
        status !== undefined &&
        !['Active', 'Off shift'].includes(status)
    ) {
        return next(
            httpError(
                400,
                'Status must be Active or Off shift'
            )
        );
    }

    if (name !== undefined) {
        waiter.name = name.trim();
    }

    if (email !== undefined) {
        waiter.email = email.trim().toLowerCase();
    }

    // An empty password means keep the existing password.
    if (password !== undefined && password !== '') {
        waiter.password = password;
    }

    if (status !== undefined) {
        waiter.status = status;
    }

    waiter.updatedAt = new Date().toISOString();

    return res.json({
        success: true,
        message: 'Waiter updated successfully',
        data: safeWaiter(waiter),
    });
});


// DELETE A WAITER
router.delete('/:storeId/waiters/:waiterId', (req, res, next) => {
    const restaurant = findRestaurant(req.params.storeId);

    if (!restaurant) {
        return next(httpError(404, 'Restaurant not found'));
    }

    restaurant.waiters ||= [];

    const waiterIndex = restaurant.waiters.findIndex(
        (entry) =>
            String(entry.id) === String(req.params.waiterId)
    );

    if (waiterIndex === -1) {
        return next(httpError(404, 'Waiter not found'));
    }

    const waiter = restaurant.waiters[waiterIndex];

    const assignedParties = (restaurant.parties || []).filter(
        (party) =>
            String(party.waiterId) === String(waiter.id) &&
            ['Active', 'Needs help'].includes(party.status)
    );

    if (assignedParties.length > 0) {
        return next(
            httpError(
                409,
                'This waiter still has active parties. Reassign or close those parties before deleting the waiter.'
            )
        );
    }

    restaurant.waiters.splice(waiterIndex, 1);

    return res.json({
        success: true,
        message: 'Waiter deleted successfully',
        data: {
            id: waiter.id,
        },
    });
});


// UPDATE RESTAURANT DETAILS
router.patch('/:storeId', (req, res, next) => {
    const restaurant = findRestaurant(req.params.storeId);

    if (!restaurant) {
        return next(httpError(404, 'Restaurant not found'));
    }

    const {
        name,
        location,
        description,
        branding,
    } = req.body || {};

    if (
        name !== undefined &&
        (typeof name !== 'string' || !name.trim())
    ) {
        return next(
            httpError(400, 'name must be a non-empty string')
        );
    }

    if (
        branding !== undefined &&
        (
            !branding ||
            typeof branding !== 'object' ||
            Array.isArray(branding)
        )
    ) {
        return next(
            httpError(400, 'branding must be an object')
        );
    }

    if (name !== undefined) {
        restaurant.name = name.trim();
    }

    if (location !== undefined) {
        restaurant.location = location;
    }

    if (description !== undefined) {
        restaurant.description = description;
    }

    if (branding !== undefined) {
        restaurant.branding = {
            ...(restaurant.branding || {}),
            ...branding,
        };
    }

    const {
        password,
        waiters,
        ...publicRestaurant
    } = restaurant;

    return res.json({
        success: true,
        data: {
            ...publicRestaurant,
            waiters: (waiters || []).map(safeWaiter),
        },
    });
});

export default router;