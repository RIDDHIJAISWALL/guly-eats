<div align="center">
  <img src="./client/public/favicon.ico" width="80" alt="Guly Eats Logo" />
  <h1>🌍 Guly Eats - Discover Local Flavors & Places</h1>
  <p><strong>A Modern Full-Stack Web Application built with the MERN stack & Vite.</strong></p>

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  
</div>

---

## ✨ Features

- **🍔 Explore Local Foods:** Discover famous local delicacies and their origins.
- **🏛️ Discover Places:** Find the best restaurants and famous monuments in major cities.
- **📍 Day Trip Planner:** Automatically map out your day using our Interactive Route Planner powered by OpenStreetMap & OSRM.
- **🗺️ Explore Near Me:** Real-time GeoLocation to find the nearest food and famous places using MongoDB `$near` queries.
- **⭐ Reviews & Ratings:** Share your experiences and read what others think.
- **👤 User Dashboard:** Manage your profile, wishlist, itineraries, and past reviews.
- **🛡️ Admin Dashboard:** Manage the platform, view analytics, and control user roles.
- **📱 Progressive Web App (PWA):** Installable on mobile devices with offline capabilities.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** React 18 with Vite
- **Routing:** React Router v6
- **State Management:** Zustand (Auth) & React Query (Data Fetching)
- **Styling:** Tailwind CSS v4, Lucide React (Icons)
- **Maps:** React-Leaflet (OpenStreetMap)

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Auth:** JWT (JSON Web Tokens), Argon2 (Password Hashing)
- **File Uploads:** Multer (Local storage)

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI or Local MongoDB instance

### 2. Clone and Install
```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 3. Environment Variables
Create `.env` files in both the `server` and `client` directories.

**`server/.env`**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
NODE_ENV=development
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed Database (Optional)
Populate your database with sample cities, places, and famous destinations.
```bash
cd server
npm run seed
```

### 5. Run the App
Start both servers simultaneously in two terminal windows:
```bash
# Terminal 1
cd server
npm run dev

# Terminal 2
cd client
npm run dev
```

---

## 🌐 Deployment Guide (Vercel & Render)

This project is configured for easy deployment on free-tier platforms.

### 1. Deploy Backend to Render
1. Create an account on [Render.com](https://render.com).
2. Create a new **Web Service** and connect your GitHub repository.
3. **Build Command:** `npm install`
4. **Start Command:** `node src/index.js`
5. **Environment Variables:** Add `MONGO_URI`, `JWT_SECRET`, etc.
6. **Important:** Change `NODE_ENV` to `production`.

### 2. Deploy Frontend to Vercel
1. Create an account on [Vercel.com](https://vercel.com).
2. Import your GitHub repository.
3. Set the **Framework Preset** to `Vite`.
4. Set the **Root Directory** to `client`.
5. **Environment Variables:** Set `VITE_API_URL` to your Render backend URL (e.g., `https://guly-eats-api.onrender.com/api`).
6. Click **Deploy**.

---

## 🎨 UI/UX Philosophy

The interface was designed with a **"Premium & Playful"** aesthetic.
- **Glassmorphism:** Used sparingly for sticky navigation and modals.
- **Micro-interactions:** Cards scale on hover, buttons have satisfying click states.
- **Typography:** Uses modern font pairings (Heading fonts for titles, legible sans-serif for body).
- **Responsive First:** The entire application functions perfectly on mobile, tablet, and ultra-wide PC screens.

---

<div align="center">
  <p>Built with ❤️ by a Professional Full Stack Developer.</p>
</div>
