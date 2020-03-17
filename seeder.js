const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Restaurant = require('./models/Restaurant');
const Food = require('./models/Food');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Read JSON files
const restaurants = JSON.parse(fs.readFileSync(`${__dirname}/_data/restaurants.json`, 'utf-8'));
const foods = JSON.parse(fs.readFileSync(`${__dirname}/_data/foods.json`, 'utf-8'));

// Import into DB
const importData = async () => {
  try {
    await Restaurant.create(restaurants);
    await Food.create(foods);

    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Restaurant.deleteMany();
    await Food.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}