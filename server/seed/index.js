import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import * as argon2 from 'argon2';
import slugify from 'slugify';

// Force Google DNS for SRV record resolution
// (many ISP/router DNS servers don't handle SRV queries properly)
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Models
import User from '../src/models/User.js';
import City from '../src/models/City.js';
import Food from '../src/models/Food.js';
import Place from '../src/models/Place.js';
import FamousPlace from '../src/models/FamousPlace.js';
import Review from '../src/models/Review.js';
import Itinerary from '../src/models/Itinerary.js';

// Data
import { users } from './data/users.js';
import { cities } from './data/cities.js';
import { foods } from './data/foods.js';
import { places } from './data/places.js';
import { famousPlaces } from './data/famousPlaces.js';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Connect to DB — must await before running any queries
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    console.log(`URI: ${process.env.MONGODB_URI?.replace(/\/\/.*@/, '//<credentials>@')}`);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000, // 30 seconds to find a server
      socketTimeoutMS: 45000, // 45 seconds for socket operations
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}\n`);
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    console.error('\nPlease check:');
    console.error('  1. Your MONGODB_URI in server/.env is correct');
    console.error('  2. Your IP is whitelisted in Atlas (0.0.0.0/0 for dev)');
    console.error('  3. Your username/password are correct');
    console.error('  4. The cluster hostname is correct (check Atlas → Connect)');
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();
    console.log('Clearing database...');
    await User.deleteMany();
    await City.deleteMany();
    await Food.deleteMany();
    await Place.deleteMany();
    await FamousPlace.deleteMany();
    await Review.deleteMany();
    await Itinerary.deleteMany();
    console.log('Database cleared.\n');

    // 1. Seed Users (Hash passwords first)
    console.log('Seeding Users...');
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await argon2.hash(user.password);
        return { ...user, password: hashedPassword };
      })
    );
    await User.insertMany(usersWithHashedPasswords);
    console.log('✅ Users inserted.\n');

    // 2. Seed Foods
    console.log('Seeding Foods...');
    const foodsWithSlugs = foods.map(f => ({ ...f, slug: slugify(f.name, { lower: true }) }));
    const insertedFoods = await Food.insertMany(foodsWithSlugs);
    const foodMap = {};
    insertedFoods.forEach((food) => {
      foodMap[food.name] = food._id;
    });
    console.log('✅ Foods inserted.\n');

    // 3. Seed Cities
    console.log('Seeding Cities...');
    const citiesWithSlugs = cities.map(c => ({ ...c, slug: slugify(c.name, { lower: true }) }));
    const insertedCities = await City.insertMany(citiesWithSlugs);
    const cityMap = {};
    insertedCities.forEach((city) => {
      cityMap[city.name] = city._id;
    });
    console.log('✅ Cities inserted.\n');

    // 4. Seed Places (Map cityName and foodNames to ObjectIds)
    console.log('Seeding Places...');
    const mappedPlaces = places.map((place) => {
      const cityId = cityMap[place.cityName];
      if (!cityId) throw new Error(`City not found for place: ${place.name}`);

      const foodIds = place.foodNames?.map(name => {
        const id = foodMap[name];
        if (!id) console.warn(`⚠️  Food not found: ${name} for place ${place.name}`);
        return id;
      }).filter(Boolean) || [];

      return {
        ...place,
        slug: slugify(place.name, { lower: true }),
        city: cityId,
        famousFoods: foodIds,
      };
    });
    await Place.insertMany(mappedPlaces);
    console.log('✅ Places inserted.\n');

    // 5. Seed Famous Places (Map cityName to ObjectId)
    console.log('Seeding Famous Places...');
    const mappedFamousPlaces = famousPlaces.map((fp) => {
      const cityId = cityMap[fp.cityName];
      if (!cityId) throw new Error(`City not found for famous place: ${fp.name}`);
      return {
        ...fp,
        slug: slugify(fp.name, { lower: true }),
        city: cityId,
      };
    });
    await FamousPlace.insertMany(mappedFamousPlaces);
    console.log('✅ Famous Places inserted.\n');

    console.log('🎉 Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error with data import:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    console.log('Destroying data...');
    await User.deleteMany();
    await City.deleteMany();
    await Food.deleteMany();
    await Place.deleteMany();
    await FamousPlace.deleteMany();
    await Review.deleteMany();
    await Itinerary.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
