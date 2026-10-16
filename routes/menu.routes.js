
import { Router } from 'express';
import { stores } from '../data/store.js';
import { createId } from '../utils/ids.js';
import { httpError } from '../utils/httpError.js';

const router = Router();

// GET all menu items for a restaurant
router.get('/:storeId', (req, res, next) => {
    const { storeId } = req.params;
    const { category, available } = req.query;

    const restaurant = stores.find((store) => store.id === storeId);

    if (!restaurant) {
        return next(httpError(404, 'Restaurant not found'));
    }

    let items = [...restaurant.menu];

    if (category) {
        items = items.filter(
            (item) =>
                item.category.toLowerCase() ===
                String(category).toLowerCase()
        );
    }

    if (available !== undefined) {
        items = items.filter(
            (item) => item.available === (available === 'true')
        );
    }

    res.json({ success: true, data: items });
});

// GET a specific menu item
router.get('/:storeId/:id', (req, res, next) => {
    const { storeId, id } = req.params;

    const restaurant = stores.find((store) => store.id === storeId);

    if (!restaurant) {
        return next(httpError(404, 'Restaurant not found'));
    }

    const item = restaurant.menu.find((entry) => entry.id === id);

    if (!item) {
        return next(httpError(404, 'Menu item not found'));
    }

    res.json({ success: true, data: item });
});

// CREATE a menu item
router.post('/:storeId', (req, res, next) => {
    const { storeId } = req.params;
    const {
        name,
        description = '',
        price,
        category,
        imageUrl = '',
        available = true
    } = req.body;

    const restaurant = stores.find((store) => store.id === storeId);

    if (!restaurant) {
        return next(httpError(404, 'Restaurant not found'));
    }

    if (
        !name ||
        typeof name !== 'string' ||
        !category ||
        typeof category !== 'string' ||
        !Number.isFinite(price) ||
        price < 0
    ) {
        return next(
            httpError(
                400,
                'name, category and a non-negative numeric price are required'
            )
        );
    }

    const item = {
        id: createId('menu'),
        name: name.trim(),
        description,
        price,
        category: category.trim(),
        imageUrl,
        available: available === true || available === "true"
    };

    restaurant.menu.push(item);

    res.status(201).json({ success: true, data: item });
});

// UPDATE a menu item
router.patch('/:storeId/:id', (req, res, next) => {
    const { storeId, id } = req.params;

    const restaurant = stores.find((store) => store.id === storeId);

    if (!restaurant) {
        return next(httpError(404, 'Restaurant not found'));
    }

    const item = restaurant.menu.find((entry) => entry.id === id);

    if (!item) {
        return next(httpError(404, 'Menu item not found'));
    }

    const {
        name,
        description,
        price,
        category,
        imageUrl,
        available
    } = req.body;

    if (
        price !== undefined &&
        (!Number.isFinite(price) || price < 0)
    ) {
        return next(
            httpError(400, 'price must be a non-negative number')
        );
    }

    if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
        return next(httpError(400, 'name must be a non-empty string'));
    }

    if (
        category !== undefined &&
        (typeof category !== 'string' || !category.trim())
    ) {
        return next(httpError(400, 'category must be a non-empty string'));
    }

    Object.assign(item, {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(category !== undefined && { category: category.trim() }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(available !== undefined && { available: available === true || available === "true" })
    });

    res.json({ success: true, data: item });
});

// DELETE a menu item
router.delete('/:storeId/:id', (req, res, next) => {
    const { storeId, id } = req.params;

    const restaurant = stores.find((store) => store.id === storeId);

    if (!restaurant) {
        return next(httpError(404, 'Restaurant not found'));
    }

    const index = restaurant.menu.findIndex((item) => item.id === id);

    if (index === -1) {
        return next(httpError(404, 'Menu item not found'));
    }

    restaurant.menu.splice(index, 1);

    res.json({
        success: true,
        data: { id, deleted: true }
    });
});

export default router;
