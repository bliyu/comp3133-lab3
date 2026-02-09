require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const restaurantsRoutes = require('./routes/restaurants');

const app = express();
app.use(express.json());

app.use('/', restaurantsRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    if (!process.env.MONGO_URI) throw new Error('Missing MONGO_URI in .env');

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log('✅ Server running on http://localhost:' + PORT);
    });
  } catch (err) {
    console.error('❌ Startup error:', err.message);
    process.exit(1);
  }
}

start();
