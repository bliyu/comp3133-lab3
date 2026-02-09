const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

function cuisineFilter(value) {
  return { $or: [{ cuisine: value }, { cuisines: value }] };
}

function normalizeCuisine(doc) {
  if (doc && doc.cuisines == null && doc.cuisine != null) {
    doc.cuisines = doc.cuisine;
  }
  return doc;
}

// GET /restaurants  (all columns)
// GET /restaurants?sortBy=ASC|DESC (selected columns + sort by restaurant_id)
router.get('/restaurants', async (req, res) => {
  try {
    const sortBy = (req.query.sortBy || '').toUpperCase();

    if (sortBy === 'ASC' || sortBy === 'DESC') {
      const sortDir = sortBy === 'ASC' ? 1 : -1;

      const docs = await Restaurant.find({})
        .sort({ restaurant_id: sortDir })
        .select('_id cuisine cuisines name city restaurant_id')
        .lean({ virtuals: true });

      const result = docs.map(d => {
        normalizeCuisine(d);
        if (!d.id && d._id) d.id = String(d._id);
        return {
          id: d.id,
          cuisines: d.cuisines,
          name: d.name,
          city: d.city,
          restaurant_id: d.restaurant_id
        };
      });

      return res.json(result);
    }

    const docs = await Restaurant.find({}).lean({ virtuals: true });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /restaurants/cuisine/:cuisine (all columns)
router.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    const cuisine = req.params.cuisine;
    const docs = await Restaurant.find(cuisineFilter(cuisine)).lean({ virtuals: true });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /restaurants/Delicatessen
// cuisines=Delicatessen AND city != Brooklyn
// selected columns: cuisines, name, city (exclude id), sort name ASC
router.get('/restaurants/Delicatessen', async (req, res) => {
  try {
    const docs = await Restaurant.find({
      ...cuisineFilter('Delicatessen'),
      city: { $ne: 'Brooklyn' },
    })
      .sort({ name: 1 })
      .select('cuisine cuisines name city -_id')
      .lean();

    const result = docs.map(d => {
      normalizeCuisine(d);
      return { cuisines: d.cuisines, name: d.name, city: d.city };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
