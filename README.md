# ✈️ Budget Wings

Budget Wings is a full-stack flight search and comparison web application that helps users find and compare real flight options based on their travel requirements.

## 🚀 Features

### Flight Search
- Search domestic and international flights
- Search airports by city, airport name, country, or IATA code
- Select departure date, passengers, and cabin class
- View real flight information through the flight API

### Flight Results
- Airline and flight number
- Departure and arrival information
- Flight duration
- Number of stops
- Price and currency
- Sort by Lowest Price, Fastest, and Best
- Filter by price, airline, stops, cabin class, departure time, and arrival time

### Flight Comparison
Compare selected flights based on:
- Airline
- Flight number
- Price
- Duration
- Stops
- Departure and arrival
- Cabin class

### Authentication
- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected user-specific routes

### Personalized Dashboard
After login, users can access:
- Quick flight search
- Saved flights
- Search history
- Recent searches
- Recently saved flights
- Profile information
- Account statistics

### Saved Flights
- Save flights for later
- View saved flights
- Remove saved flights

### Search History
- View previous searches
- View search details
- Search again using previous search information

## 🛠️ Technology Stack

### Frontend
- React.js
- Vite
- JavaScript
- HTML
- CSS

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB Atlas

### Authentication & Security
- JWT
- bcrypt
- Environment variables

### Flight Data
- SerpApi Google Flights API

## 🏗️ System Architecture

```text
User
  ↓
React + Vite Frontend
  ↓
Node.js + Express Backend
  ↓
 ┌─────────────────┬─────────────────┐
 ↓                 ↓                 ↓
SerpApi        MongoDB Atlas     JWT / bcrypt
Flights          Database       Authentication

## 📁 Project Structure

```text
Budget-Wings/
|
+-- backend/
|   +-- data/
|   +-- models/
|   +-- routes/
|   +-- services/
|   +-- .env.example
|   +-- package.json
|   +-- ...
|
+-- frontend/
|   +-- src/
|   +-- package.json
|   +-- vite.config.js
|   +-- ...
|
+-- .gitignore
+-- .env.example
+-- README.md


## 🌐 Deployment

The application can be deployed using:

- Frontend: Netlify
- Backend: Render
- Database: MongoDB Atlas
- Flight Data: SerpApi

### Production Architecture

User
  |
  v
Netlify Frontend
  |
  v
Render Backend
  |
  +--> MongoDB Atlas
  |
  +--> SerpApi
## 🔄 Application Flow

### Guest User

Home
  |
  v
Search Flights
  |
  v
Flight Results
  |
  +--> Filter
  |
  +--> Sort
  |
  +--> Compare
  |
  +--> View Details
  |
  v
Login / Sign Up
  |
  v
Save Flights


### Authenticated User

Login / Sign Up
  |
  v
Dashboard
  |
  +--> Quick Flight Search
  |
  v
Flight Results
  |
  +--> Filter
  |
  +--> Sort
  |
  +--> Compare
  |
  +--> View Details
  |
  +--> Save Flight
  |
  +--> Saved Flights
  |
  +--> Search History
  |
  +--> Profile


## 🎯 Project Objective

The objective of Budget Wings is to provide a simple and user-friendly platform for discovering and comparing flight options while giving registered users personalized features such as saved flights and search history.


## 🔒 Security

- Passwords are hashed using bcrypt.
- JWT is used for authentication.
- Protected API routes are used for user-specific features.
- Users can access only their own saved flights and search history.
- Sensitive credentials are stored using environment variables.
- Flight API credentials remain on the backend.


## 📌 Important Note

Flight availability, prices, and other flight information depend on data returned by the external flight API and may change over time.

Budget Wings is a flight search and comparison application. It does not directly operate flights or guarantee the availability of displayed fares.


## 👩‍💻 Author

Megha Gupta

BCA Student


## 📄 License

This project is developed for educational and academic purposes.


