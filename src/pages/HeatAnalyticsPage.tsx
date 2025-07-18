import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Sun, Wind, MapPin, TrendingUp, AlertTriangle, Calendar, BarChart3, Activity } from "lucide-react";
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
    case "safe": return "bg-green-500";
    case "mild": return "bg-yellow-400";
    case "high": return "bg-orange-500";
    case "extreme": return "bg-red-500";
    default: return "bg-gray-400";
  }
};

const getRiskLabel = (risk: string) => {
  switch (risk) {
    case "safe": return "Low Risk";
    case "mild": return "Moderate Risk";
    case "high": return "High Risk";
    case "extreme": return "Extreme Risk";
    default: return "Unknown";
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
  const [analytics, setAnalytics] = useState<any>(null);
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

  // Fetch weather, analytics, and history when coords are set
  useEffect(() => {
    if (!coords) return;
    setLoading(true);
    setError("");
    Promise.all([
      fetch(`/api/weather?lat=${coords.lat}&lng=${coords.lng}`).then(res => res.json()),
      fetch(`/api/weather/analytics?lat=${coords.lat}&lng=${coords.lng}`).then(res => res.json()),
      fetch(`/api/weather/history?lat=${coords.lat}&lng=${coords.lng}&days=7`).then(res => res.json()),
    ])
      .then(([weatherData, analyticsData, historyData]) => {
        setWeather(weatherData);
        setAnalytics(analyticsData);
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
                      <div className={`text-xs font-semibold mt-1 ${getUVColor(weather.uv || 0)} text-white rounded px-2`}>
                        {weather.uv < 3 ? "Low" : weather.uv < 6 ? "Moderate" : weather.uv < 8 ? "High" : weather.uv < 11 ? "Very High" : "Extreme"}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AQI Card */}
                <Card className="text-center shadow-card">
                  <CardContent className="p-6 flex flex-col items-center">
                    <Wind className="h-8 w-8 mb-2 text-gray-500" />
                    <div className={`text-3xl font-bold ${getAQIColor(weather.aqi)} text-white rounded px-3 py-1`}>{weather.aqi}</div>
                    <div className="text-xs text-muted-foreground mt-1">Air Quality Index</div>
                    <div className="text-sm text-muted-foreground mt-2">
                      {weather.aqi <= 50 ? "Good" : weather.aqi <= 100 ? "Moderate" : weather.aqi <= 150 ? "Unhealthy" : weather.aqi <= 200 ? "Very Unhealthy" : "Hazardous"}
                    </div>
                  </CardContent>
                </Card>

                {/* Heat Risk Level Card */}
                <Card className="text-center shadow-card">
                  <CardContent className="p-6 flex flex-col items-center">
                    <AlertTriangle className="h-10 w-10 text-red-400 mb-2" />
                    <div className={`text-2xl font-bold ${getRiskColor(weather.risk?.level || 'safe')} text-white rounded px-3 py-1 mb-2`}>
                      {getRiskLabel(weather.risk?.level || 'safe')}
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">Heat Risk Level</div>
                    <div className="text-sm text-muted-foreground text-center">
                      {weather.risk?.description || "Risk assessment unavailable"}
                    </div>
                    {weather.risk?.recommendations && (
                      <div className="mt-3 text-xs text-muted-foreground">
                        <div className="font-semibold mb-1">Recommendations:</div>
                        <ul className="text-left space-y-1">
                          {weather.risk.recommendations.slice(0, 2).map((rec: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-primary">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Enhanced Analytics Section */}
          {analytics && (
            <section className="py-8 bg-muted/30">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  Enhanced Analytics
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Temperature Trends */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Thermometer className="h-5 w-5" />
                        Temperature Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Average:</span>
                          <span className="font-semibold">{analytics.trends.temp.average.toFixed(1)}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Max:</span>
                          <span className="font-semibold text-red-600">{analytics.trends.temp.max.toFixed(1)}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Min:</span>
                          <span className="font-semibold text-blue-600">{analytics.trends.temp.min.toFixed(1)}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Trend:</span>
                          <span className={`font-semibold flex items-center gap-1 ${analytics.trends.temp.trend > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                            <TrendingUp className={`h-4 w-4 ${analytics.trends.temp.trend > 0 ? 'rotate-0' : 'rotate-180'}`} />
                            {Math.abs(analytics.trends.temp.trend).toFixed(1)}°C
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Humidity Trends */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Droplets className="h-5 w-5" />
                        Humidity Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Average:</span>
                          <span className="font-semibold">{analytics.trends.humidity.average.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Max:</span>
                          <span className="font-semibold text-blue-600">{analytics.trends.humidity.max.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Min:</span>
                          <span className="font-semibold text-orange-600">{analytics.trends.humidity.min.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Trend:</span>
                          <span className={`font-semibold flex items-center gap-1 ${analytics.trends.humidity.trend > 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                            <TrendingUp className={`h-4 w-4 ${analytics.trends.humidity.trend > 0 ? 'rotate-0' : 'rotate-180'}`} />
                            {Math.abs(analytics.trends.humidity.trend).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Alerts Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Alerts Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Current Risk:</span>
                          <span className={`font-semibold ${getRiskColor(analytics.alerts.currentHeatRisk)} text-white rounded px-2 py-1 text-xs`}>
                            {getRiskLabel(analytics.alerts.currentHeatRisk)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">UV Level:</span>
                          <span className="font-semibold text-yellow-600">{analytics.alerts.currentUVLevel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Air Quality:</span>
                          <span className="font-semibold text-green-600">{analytics.alerts.currentAQILevel}</span>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="text-xs text-muted-foreground mb-2">Historical (7 days):</div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Heat Waves:</span>
                            <span className="font-semibold text-red-600">{analytics.alerts.heatWaves} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">High UV:</span>
                            <span className="font-semibold text-yellow-600">{analytics.alerts.highUV} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Poor AQI:</span>
                            <span className="font-semibold text-purple-600">{analytics.alerts.poorAQI} days</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>
          )}

          {/* 7-Day Forecast */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                7-Day Forecast
              </h2>
              {forecastLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading forecast...</div>
              ) : forecastError ? (
                <div className="text-center py-8 text-red-500">{forecastError}</div>
              ) : (
                <div className="grid md:grid-cols-7 gap-4">
                  {forecast.map((day, index) => (
                    <Card key={index} className="text-center">
                      <CardContent className="p-4">
                        <div className="text-sm font-semibold mb-2">
                          {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                        </div>
                        <div className="text-xs text-muted-foreground mb-3">
                          {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                        <div className="text-2xl font-bold text-orange-600 mb-1">{day.temp}°C</div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {day.temp_min}°C - {day.temp_max}°C
                        </div>
                        <div className="text-sm text-blue-500 mb-2">{day.humidity}%</div>
                        <div className={`text-xs font-semibold ${getRiskColor(day.risk?.level || 'safe')} text-white rounded px-2 py-1 mb-2`}>
                          {getRiskLabel(day.risk?.level || 'safe')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          UV: {day.uv?.toFixed(1) || '-'}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Historical Trends */}
          <section className="py-8 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                Historical Trends
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Temperature Trend Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Temperature Trend (7 Days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {trendTemp.length > 0 ? (
                      <div className="h-48 flex items-end justify-between gap-1">
                        {trendTemp.map((temp, index) => (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div
                              className="w-full bg-orange-500 rounded-t"
                              style={{ height: `${(temp / Math.max(...trendTemp)) * 100}%` }}
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                              {trendDays[index] || index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-muted-foreground">
                        No historical data available
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Humidity Trend Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Humidity Trend (7 Days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {trendHumidity.length > 0 ? (
                      <div className="h-48 flex items-end justify-between gap-1">
                        {trendHumidity.map((humidity, index) => (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div
                              className="w-full bg-blue-500 rounded-t"
                              style={{ height: `${humidity}%` }}
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                              {trendDays[index] || index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-muted-foreground">
                        No historical data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
};

export default HeatAnalyticsDashboard;