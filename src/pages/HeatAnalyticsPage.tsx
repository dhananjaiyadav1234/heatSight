import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Sun, Wind, MapPin, TrendingUp, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return "bg-green-500";
  if (aqi <= 100) return "bg-yellow-400";
  if (aqi <= 150) return "bg-orange-500";
  if (aqi <= 200) return "bg-red-500";
  return "bg-purple-700";
};

const getUVColor = (uv: number) => {
  if (uv < 3) return "bg-green-500";
  if (uv < 6) return "bg-yellow-400";
  if (uv < 8) return "bg-orange-500";
  if (uv < 11) return "bg-red-500";
  return "bg-purple-700";
};

  const getRiskColor = (risk: string) => {
    switch (risk) {
    case "Low": return "bg-green-500";
    case "Moderate": return "bg-yellow-400";
    case "High": return "bg-orange-500";
    case "Dangerous": return "bg-red-500";
    default: return "bg-gray-400";
  }
};

const reverseGeocode = async (lat: number, lng: number) => {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.features && data.features.length > 0) {
    return data.features[0].place_name;
  }
  return `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
};

const HeatAnalyticsDashboard = () => {
  const [now, setNow] = useState(new Date().toLocaleString());
  const [location, setLocation] = useState<string>("Loading location...");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [forecast, setForecast] = useState<any[]>([]);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastError, setForecastError] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date().toLocaleString()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoords({ lat, lng });
          const locName = await reverseGeocode(lat, lng);
          setLocation(locName);
        },
        () => {
          setError("Location access denied.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported.");
      setLoading(false);
    }
  }, []);

  // Fetch weather and history when coords are set
  useEffect(() => {
    if (!coords) return;
    setLoading(true);
    setError("");
    Promise.all([
      fetch(`/api/weather?lat=${coords.lat}&lng=${coords.lng}`).then(res => res.json()),
      fetch(`/api/weather/history?lat=${coords.lat}&lng=${coords.lng}&days=7`).then(res => res.json()),
    ])
      .then(([weatherData, historyData]) => {
        setWeather(weatherData);
        setHistory(Array.isArray(historyData) ? historyData : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch weather data.");
        setHistory([]);
        setLoading(false);
      });
  }, [coords]);

  // Fetch forecast when coords are set
  useEffect(() => {
    if (!coords) return;
    setForecastLoading(true);
    setForecastError("");
    fetch(`/api/weather/forecast?lat=${coords.lat}&lng=${coords.lng}`)
      .then(res => res.json())
      .then(data => {
        setForecast(Array.isArray(data) ? data : []);
        setForecastLoading(false);
      })
      .catch(() => {
        setForecastError("Failed to fetch forecast.");
        setForecast([]);
        setForecastLoading(false);
      });
  }, [coords]);

  // Extract trend data
  const safeHistory = Array.isArray(history) ? history : [];
  const trendTemp = safeHistory.map((d) => d.temp);
  const trendHumidity = safeHistory.map((d) => d.humidity);
  const trendDays = safeHistory.map((d) => new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }));
  const aqi24h = safeHistory.slice(-24).map((d) => d.aqi);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Header */}
      <section className="py-6 border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <MapPin className="h-5 w-5 text-primary" />
            <span>{location}</span>
          </div>
          <div className="text-sm text-muted-foreground">{now}</div>
        </div>
      </section>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading analytics...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : weather ? (
        <>
          {/* Main Cards */}
      <section className="py-8">
        <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-4 gap-6">
                {/* Temperature Card */}
              <Card className="text-center shadow-card">
                  <CardContent className="p-6 flex flex-col items-center">
                    <Sun className="h-10 w-10 text-orange-400 mb-2" />
                    <div className="text-4xl font-bold text-orange-600">{weather.temp}°C</div>
                    <div className="text-xs text-muted-foreground mt-1">Temperature</div>
                    <div className="text-sm text-muted-foreground">Feels like {weather.feels_like}°C</div>
                    <div className="text-xs text-muted-foreground mt-1">Feels Like</div>
                    <div className="mt-2 flex items-center gap-2">
                      <Thermometer className="h-5 w-5 text-orange-500" />
                      <span className="font-semibold text-orange-500">{weather.temp > 35 ? "High" : weather.temp > 28 ? "Moderate" : "Low"}</span>
                  </div>
                </CardContent>
              </Card>
                {/* Humidity & UV Card */}
              <Card className="text-center shadow-card">
                  <CardContent className="p-6 flex flex-col items-center gap-4">
                    {/* Humidity Gauge */}
                    <div className="flex flex-col items-center">
                      <Droplets className="h-7 w-7 text-blue-400 mb-1" />
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="absolute top-0 left-0" width="64" height="64">
                          <circle cx="32" cy="32" r="28" stroke="#e0e7ef" strokeWidth="8" fill="none" />
                          <circle cx="32" cy="32" r="28" stroke="#38bdf8" strokeWidth="8" fill="none" strokeDasharray={2 * Math.PI * 28} strokeDashoffset={2 * Math.PI * 28 * (1 - weather.humidity / 100)} />
                        </svg>
                        <span className="text-xl font-bold text-blue-500">{weather.humidity}%</span>
                  </div>
                      <div className="text-xs text-blue-500 font-semibold mt-1">Humidity</div>
                  </div>
                    {/* UV Gauge */}
                    <div className="flex flex-col items-center">
                      <Sun className="h-7 w-7 text-yellow-400 mb-1" />
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="absolute top-0 left-0" width="64" height="64">
                          <circle cx="32" cy="32" r="28" stroke="#e0e7ef" strokeWidth="8" fill="none" />
                          <circle cx="32" cy="32" r="28" stroke="#facc15" strokeWidth="8" fill="none" strokeDasharray={2 * Math.PI * 28} strokeDashoffset={2 * Math.PI * 28 * (1 - (weather.uv || 0) / 12)} />
                        </svg>
                        <span className="text-xl font-bold text-yellow-500">{weather.uv ?? "-"}</span>
                  </div>
                      <div className="text-xs text-yellow-500 font-semibold mt-1">UV Index</div>
                      <div className={`text-xs font-semibold mt-1 ${getUVColor(weather.uv || 0)} text-white rounded px-2`}>{weather.uv < 3 ? "Low" : weather.uv < 6 ? "Moderate" : weather.uv < 8 ? "High" : weather.uv < 11 ? "Very High" : "Extreme"}</div>
                  </div>
                </CardContent>
              </Card>
                {/* AQI Card */}
              <Card className="text-center shadow-card">
                  <CardContent className="p-6 flex flex-col items-center">
                    <Wind className="h-8 w-8 mb-2 text-gray-500" />
                    <div className={`text-3xl font-bold ${getAQIColor(weather.aqi)} text-white rounded px-3 py-1`}>{weather.aqi}</div>
                    <div className="text-xs text-muted-foreground mt-1">AQI</div>
                    <div className="text-sm font-semibold mt-1">{weather.aqi <= 50 ? "Good" : weather.aqi <= 100 ? "Moderate" : weather.aqi <= 150 ? "Unhealthy" : weather.aqi <= 200 ? "Very Unhealthy" : "Hazardous"}</div>
                    {/* 24h AQI line graph */}
                    <svg width="100%" height="40" viewBox="0 0 120 40" className="mt-2">
                      <polyline
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2"
                        points={aqi24h.map((v, i) => `${i * 5},${40 - ((v || 0) - 70) / 2}`).join(" ")}
                      />
                    </svg>
                </CardContent>
              </Card>
                {/* Heat Risk Level (simple logic for now) */}
                <Card className="text-center shadow-card">
                  <CardContent className="p-6 flex flex-col items-center justify-center">
                    <AlertTriangle className="h-8 w-8 mb-2 text-red-500" />
                    <div className={`text-lg font-bold ${getRiskColor(weather.temp > 35 ? "High" : weather.temp > 28 ? "Moderate" : "Low") } text-white rounded px-3 py-1`}>
                      {weather.temp > 35 ? "High Risk - Avoid Outdoor Activity" : weather.temp > 28 ? "Moderate Risk - Take Precautions" : "Low Risk"}
                    </div>
                    {/* Add description and tip */}
                    {weather.temp > 35 ? (
                      <>
                        <div className="mt-2 text-sm text-red-600 flex items-center gap-2"><Sun className="h-5 w-5 inline text-orange-400" /> Extreme heat detected.</div>
                        <div className="mt-1 text-xs bg-red-100 text-red-700 rounded px-2 py-1">Tip: Avoid outdoor activity, seek shade, and stay hydrated.</div>
                      </>
                    ) : weather.temp > 28 ? (
                      <>
                        <div className="mt-2 text-sm text-yellow-600 flex items-center gap-2"><Sun className="h-5 w-5 inline text-yellow-400" /> Moderate heat risk.</div>
                        <div className="mt-1 text-xs bg-yellow-100 text-yellow-800 rounded px-2 py-1">Tip: Take breaks, drink water, and avoid peak sun hours.</div>
                      </>
                    ) : (
                      <>
                        <div className="mt-2 text-sm text-green-600 flex items-center gap-2"><Sun className="h-5 w-5 inline text-green-400" /> Safe conditions.</div>
                        <div className="mt-1 text-xs bg-green-100 text-green-800 rounded px-2 py-1">Tip: Normal outdoor activity is safe.</div>
                      </>
                    )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

          {/* 7-Day Forecast Section */}
          <section className="py-8">
        <div className="container mx-auto px-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    7-Day Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                  {forecastLoading ? (
                    <div className="text-muted-foreground">Loading forecast...</div>
                  ) : forecastError ? (
                    <div className="text-red-500">{forecastError}</div>
                  ) : forecast.length > 0 ? (
                    <div>
                      {/* Simple SVG line chart for temp/humidity */}
                      <div className="flex flex-col md:flex-row gap-8">
                        {/* Temperature Forecast */}
                      <div className="flex-1">
                          <div className="font-semibold mb-2">Temperature (°C)</div>
                          <svg width="100%" height="60" viewBox="0 0 140 60">
                            <polyline
                              fill="none"
                              stroke="#f59e42"
                              strokeWidth="3"
                              points={forecast.map((d, i) => `${i * 20},${60 - (d.temp - 20) * 3}`).join(" ")}
                            />
                          </svg>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            {forecast.map((d, i) => <span key={i}>{new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })}</span>)}
                          </div>
                        </div>
                        {/* Humidity Forecast */}
                        <div className="flex-1">
                          <div className="font-semibold mb-2">Humidity (%)</div>
                          <svg width="100%" height="60" viewBox="0 0 140 60">
                            <polyline
                              fill="none"
                              stroke="#38bdf8"
                              strokeWidth="3"
                              points={forecast.map((d, i) => `${i * 20},${60 - (d.humidity - 40) * 1.2}`).join(" ")}
                            />
                          </svg>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            {forecast.map((d, i) => <span key={i}>{new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })}</span>)}
                      </div>
                        </div>
                      </div>
                      {/* Forecast Table */}
                      <div className="overflow-x-auto mt-6">
                        <table className="min-w-full text-xs text-left">
                          <thead>
                            <tr className="border-b">
                              <th className="px-2 py-1">Day</th>
                              <th className="px-2 py-1">Temp (°C)</th>
                              <th className="px-2 py-1">Humidity (%)</th>
                              <th className="px-2 py-1">UV</th>
                              <th className="px-2 py-1">AQI</th>
                            </tr>
                          </thead>
                          <tbody>
                            {forecast.map((d, i) => (
                              <tr key={i} className="border-b">
                                <td className="px-2 py-1">{new Date(d.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</td>
                                <td className="px-2 py-1">{d.temp}</td>
                                <td className="px-2 py-1">{d.humidity}</td>
                                <td className="px-2 py-1">{d.uv ?? '-'}</td>
                                <td className="px-2 py-1">{d.aqi ?? '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No forecast data available.</div>
                  )}
              </CardContent>
            </Card>
        </div>
      </section>

          {/* Historical Trend Graphs */}
      <section className="py-8">
        <div className="container mx-auto px-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Historical Trends (7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Temperature Trend */}
                    <div className="flex-1">
                      <div className="font-semibold mb-2">Temperature (°C)</div>
                      <svg width="100%" height="60" viewBox="0 0 140 60">
                        <polyline
                          fill="none"
                          stroke="#f59e42"
                          strokeWidth="3"
                          points={trendTemp.map((v, i) => `${i * 20},${60 - (v - 30) * 8}`).join(" ")}
                        />
                      </svg>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        {trendDays.map((d, i) => <span key={i}>{d}</span>)}
                      </div>
                    </div>
                    {/* Humidity Trend */}
                      <div className="flex-1">
                      <div className="font-semibold mb-2">Humidity (%)</div>
                      <svg width="100%" height="60" viewBox="0 0 140 60">
                        <polyline
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="3"
                          points={trendHumidity.map((v, i) => `${i * 20},${60 - (v - 65) * 6}`).join(" ")}
                        />
                      </svg>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        {trendDays.map((d, i) => <span key={i}>{d}</span>)}
                      </div>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
      </section>
        </>
      ) : null}
    </div>
  );
};

export default HeatAnalyticsDashboard;