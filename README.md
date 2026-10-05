
# ✈️ Budget Wings

A full-stack flight search and comparison web application with real-time flight data, filtering, comparison, authentication, saved flights, and search history.

## 🛠️ Technologies Used

- React
- Vite
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- bcrypt
- SerpApi Google Flights API
- HTML
- CSS
- JavaScript

## 📁 Project Structure

    Budget-Wings/
    │
    ├── backend/
    │   ├── routes/
    │   ├── models/
    │   ├── middleware/
    │   ├── controllers/
    │   ├── server.js
    │   ├── package.json
    │   └── .env
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── pages/
    │   │   ├── App.jsx
    │   │   ├── main.jsx
    │   │   └── styles.css
    │   ├── package.json
    │   └── vite.config.js
    │
    ├── .gitignore
    ├── .env.example
    └── README.md

## 🏗️ System Architecture

    User
       ↓
    React + Vite Frontend
       ↓
    Node.js + Express Backend
       ↓
    ┌──────────────────┬──────────────────┬────────────────────┐
    │     SerpApi      │   MongoDB Atlas  │    JWT + bcrypt    │
    │  Google Flights  │     Database     │   Authentication   │
    └──────────────────┴──────────────────┴────────────────────┘

## 🔄 Application Flow

### Guest User

    Home
      ↓
    Search Flights
      ↓
    Flight Results
      ├── Filter
      ├── Sort
      ├── Compare
      └── View Details
      ↓
    Login / Sign Up
      ↓
    Save Flights

### Authenticated User

    Login / Sign Up
      ↓
    Dashboard
      ├── Quick Flight Search
      ↓
    Flight Results
      ├── Filter
      ├── Sort
      ├── Compare
      ├── View Details
      └── Save Flight
      ↓
    Dashboard Features
      ├── Saved Flights
      ├── Search History
      └── Profile

## 🎯 Project Objective

The objective of Budget Wings is to provide a simple and user-friendly platform for discovering and comparing flight options while giving registered users personalized features such as saved flights and search history.

## ✈️ Main Features

- Search flights without requiring login
- Search domestic and international flights
- Search airports by city, airport name, or IATA code
- Real-time flight data through an external flight API
- Flight filtering
- Flight sorting
- Flight comparison
- Flight details
- User registration and login
- JWT-based authentication
- Secure password hashing using bcrypt
- Save flights
- View saved flights
- Search history
- Personalized dashboard
- User profile
- Responsive user interface
- Interactive aviation-themed interface

## 🔐 Security

- Passwords are hashed using bcrypt.
- JWT is used for authentication.
- Protected API routes are used for user-specific features.
- Users can access only their own saved flights and search history.
- Sensitive credentials are stored using environment variables.
- Flight API credentials remain on the backend.
- `.env` files are excluded from Git using `.gitignore`.

## 📡 API Architecture

    React Frontend
          ↓
    Express Backend
          ↓
    SerpApi Google Flights API
          ↓
    Flight Data
          ↓
    Express Backend
          ↓
    React Frontend

User-specific information is stored in MongoDB Atlas.

    React
      ↓
    Express API
      ↓
    MongoDB Atlas
      ↓
    Users
    Saved Flights
    Search History

## ⚙️ Installation and Setup

### 1. Clone the Repository

    git clone https://github.com/megha09-cloud/Budget_Wings.git
    cd Budget_Wings

### 2. Backend Setup

    cd backend
    npm install

Create a `.env` file inside the backend folder:

    FLIGHT_API_KEY=your_serpapi_api_key
    MONGODB_URI=your_mongodb_connection_string
    PORT=5000
    CLIENT_ORIGIN=http://localhost:5173
    JWT_SECRET=your_jwt_secret

Start the backend:

    npm start

### 3. Frontend Setup

Open another terminal:

    cd frontend
    npm install
    npm run dev

The frontend will normally run at:

    http://localhost:5173

## 🔑 Environment Variables

Never upload actual API keys, database passwords, or JWT secrets to GitHub.

Use `.env.example` as a reference:

    FLIGHT_API_KEY=your_serpapi_api_key
    MONGODB_URI=your_mongodb_connection_string
    PORT=5000
    CLIENT_ORIGIN=http://localhost:5173
    JWT_SECRET=your_jwt_secret

## 📊 Flight Data

Flight availability, prices, airline information, schedules, and other flight details depend on the data returned by the external flight API and may change over time.

Budget Wings is a flight search and comparison application. It does not directly operate flights or guarantee the availability of displayed fares.

## 🚀 Deployment

    Frontend → Netlify
    Backend → Render
    Database → MongoDB Atlas
    Flight Data → SerpApi

For deployment, update the environment variables with the production frontend and backend URLs.

## 👩‍💻 Author

Megha Gupta

BCA Student

## 📄 License

This project is developed for educational and academic purposes.