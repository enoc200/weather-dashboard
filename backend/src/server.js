import express from "express";
import cors from "cors";
import { describeWeather } from "./weather.js";

const app = express();
const port = process.env.PORT || 4000;
const host = process.env.HOST || "127.0.0.1";

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.type("html").send(`
    <h1>Weather API</h1>
    <p>The backend is running.</p>
    <p>Use <code>/api/weather?city=London</code> to fetch weather data.</p>
    <p>Open the React app on port 5173 for the full dashboard.</p>
  `);
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/weather", async (req, res) => {
  const city = String(req.query.city || "").trim();

  if (!city) {
    return res.status(400).json({ error: "Please provide a city name." });
  }

  try {
    const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
    geoUrl.searchParams.set("name", city);
    geoUrl.searchParams.set("count", "10");
    geoUrl.searchParams.set("language", "en");
    geoUrl.searchParams.set("format", "json");

    const geoResponse = await fetch(geoUrl);
    if (!geoResponse.ok) {
      throw new Error("Failed to look up the city.");
    }

    const geoData = await geoResponse.json();
    const results = Array.isArray(geoData.results) ? geoData.results : [];
    const normalizedCity = city.toLowerCase();
    const place =
      results.find((result) => String(result.name || "").toLowerCase() === normalizedCity) ??
      results[0];

    if (!place) {
      return res.status(404).json({ error: `No city found for "${city}".` });
    }

    const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
    weatherUrl.searchParams.set("latitude", place.latitude);
    weatherUrl.searchParams.set("longitude", place.longitude);
    weatherUrl.searchParams.set("current_weather", "true");
    weatherUrl.searchParams.set("timezone", "auto");

    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      throw new Error("Failed to load weather data.");
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current_weather;

    return res.json({
      city: [place.name, place.admin1, place.country].filter(Boolean).join(", "),
      temperature: current?.temperature ?? null,
      windspeed: current?.windspeed ?? null,
      weatherCode: current?.weathercode ?? null,
      weatherDescription: current?.weathercode != null ? describeWeather(current.weathercode) : "Unknown weather",
      time: current?.time ?? null,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Unable to fetch weather right now.",
    });
  }
});

app.listen(port, host, () => {
  console.log(`Weather API running on http://${host}:${port}`);
});
