# Budget Wings – Compare. Save. Fly Smart.
Flight search and price comparison. React (Vite) + Express + MongoDB + real flight API (SerpApi Google Flights engine).
All fares come live from the API; nothing is hardcoded.

## Run
1. Get an API key at https://serpapi.com (free plan available; check current limits).
2. `cp .env.example backend/.env`, then set `FLIGHT_API_KEY` there `JWT_SECRET` (any long random string) and `MONGODB_URI` — MongoDB is required for login, saved flights and search history.
3. `cd backend && npm install && npm start`
4. `cd frontend && npm install && npm run dev` → open http://localhost:5173
The key stays in the backend; the browser only calls `/api/*`. To use another provider, edit only `backend/services/flightApi.js`.

## Accounts
Sign up / log in (top right). When logged in: ☆ Save on any result, and **My Account** shows Saved Flights (fare as saved) and Search History with "Search again". Passwords are bcrypt-hashed; login uses a 7-day JWT.

## Airports
Type a city, airport name, country or IATA code in From/To (e.g. "Delhi", "Heathrow", "DXB", "New York"). Suggestions help, but you can just type — the backend resolves what you typed to an IATA code (`departure_id` / `arrival_id`) before calling the flight API. The built-in list (`backend/data/airports.js`, ~225 major airports in India, Asia, Middle East, Europe, North America, Africa, Oceania, South America) is easy to extend; an unknown 3-letter code in capitals (e.g. `XYZ`) is passed to the API as-is. Run `cd backend && npm test` to check the resolver and the departure_id/arrival_id sent for 10 example routes (API mocked).
