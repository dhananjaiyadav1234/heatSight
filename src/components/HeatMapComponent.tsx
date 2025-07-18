import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Thermometer, Wind, Droplets, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data for heat risk zones
const mockHeatZones = [
  { id: 1, name: "Downtown", temp: 42, humidity: 65, aqi: 89, risk: "extreme" },
  { id: 2, name: "Industrial Area", temp: 39, humidity: 70, aqi: 112, risk: "high" },
  { id: 3, name: "Residential North", temp: 36, humidity: 55, aqi: 67, risk: "mild" },
  { id: 4, name: "Coastal Region", temp: 32, humidity: 75, aqi: 45, risk: "safe" },
];

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "extreme": return "extreme";
    case "high": return "high";
    case "mild": return "mild";
    case "safe": return "safe";
    default: return "mild";
  }
};

const getRiskIcon = (risk: string) => {
  return risk === "extreme" || risk === "high" ? AlertTriangle : Thermometer;
};

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

const HeatMapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedZone, setSelectedZone] = useState(mockHeatZones[0]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userAnalytics, setUserAnalytics] = useState<null | {
    peakTemp: number;
    avgHumidity: number;
    peakAQI: number;
    heatAlerts: number;
  }>(null);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [72.8777, 19.076], // Mumbai [lng, lat]
      zoom: 10,
    });

    // Add heat zone markers
    mockHeatZones.forEach((zone) => {
      const el = document.createElement('div');
      el.className = `w-8 h-8 rounded-full flex items-center justify-center bg-heat-${getRiskColor(zone.risk)}`;
      el.style.background = '';
      el.style.color = 'white';
      el.style.fontWeight = 'bold';
      el.innerText = `${zone.temp}°`;
      el.style.cursor = 'pointer';
      el.onclick = () => setSelectedZone(zone);
      // Example positions for demo (should use real lat/lng in real app)
      const lngLat =
        zone.name === "Downtown" ? [72.8777, 19.076] :
        zone.name === "Industrial Area" ? [72.85, 19.1] :
        zone.name === "Residential North" ? [72.88, 19.15] :
        [72.82, 19.05];
      new mapboxgl.Marker(el).setLngLat(lngLat as [number, number]).addTo(mapRef.current!);
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  // Add user location marker and center map when userLocation changes
  useEffect(() => {
    if (userLocation && mapRef.current) {
      new mapboxgl.Marker({ color: '#2563eb' })
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(mapRef.current);
      mapRef.current.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 13,
        essential: true,
      });
    }
  }, [userLocation]);

  const getCurrentLocation = async () => {
    console.log("Clicked My Location");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast({
            title: "Location found",
            description: "Heat map centered on your location",
          });
          try {
            // First, fetch and store real weather data for this location
            const weatherRes = await fetch('/api/weather/fetch', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              }),
            });
            if (!weatherRes.ok) throw new Error('Weather fetch failed');
            const weatherData = await weatherRes.json();
            toast({
              title: "Weather Data Fetched",
              description: `Temp: ${weatherData.temp}°C, Humidity: ${weatherData.humidity}%`,
            });

            // Now fetch analytics for this location
            const analyticsRes = await fetch(`/api/routes/analytics?lat=${position.coords.latitude}&lng=${position.coords.longitude}`);
            if (!analyticsRes.ok) throw new Error('Analytics fetch failed');
            const data = await analyticsRes.json();
            setUserAnalytics({
              peakTemp: data.peakTemp,
              avgHumidity: data.avgHumidity,
              peakAQI: data.peakAQI,
              heatAlerts: data.heatAlerts,
            });
            toast({
              title: "Your Location Analytics",
              description: (
                <div>
                  <div><b>Peak Temperature:</b> {data.peakTemp}°C</div>
                  <div><b>Avg Humidity:</b> {data.avgHumidity}%</div>
                  <div><b>Peak AQI:</b> {data.peakAQI}</div>
                  <div><b>Heat Alerts:</b> {data.heatAlerts}</div>
                </div>
              ),
              duration: 7000,
            });
          } catch (err) {
            toast({
              title: "Error",
              description: (err as Error).message,
              variant: "destructive",
            });
          }
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Unable to get your location. Using default view.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const getAISummary = (zone: any) => {
    const riskMessages = {
      extreme: "🔥 EXTREME HEAT WARNING: Avoid outdoor work. Seek immediate cooling.",
      high: "⚠️ HIGH HEAT RISK: Limit outdoor exposure. Stay hydrated.",
      mild: "🌡️ MODERATE CONDITIONS: Take regular breaks in shade.",
      safe: "✅ SAFE CONDITIONS: Normal outdoor activities permitted.",
    };
    return riskMessages[zone.risk as keyof typeof riskMessages] || "";
  };

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <Card className="overflow-hidden shadow-heat">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Live Heat Risk Map
            </CardTitle>
            <Button
              variant="cool"
              size="sm"
              onClick={getCurrentLocation}
              className="gap-2"
            >
              <MapPin className="h-4 w-4" />
              My Location
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div 
            ref={mapContainer}
            style={{ width: "100%", height: "400px" }}
          />
        </CardContent>
      </Card>

      {/* Zone Info Card */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {(() => {
              const Icon = getRiskIcon(selectedZone.risk);
              return <Icon className={`h-5 w-5 text-heat-${getRiskColor(selectedZone.risk)}`} />;
            })()}
            {selectedZone.name}
            <Badge variant={getRiskColor(selectedZone.risk) as any}>
              {selectedZone.risk.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Thermometer className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Temp</span>
              </div>
              <div className="text-2xl font-bold text-primary">{userAnalytics ? `${userAnalytics.peakTemp}°C` : `${selectedZone.temp}°C`}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Droplets className="h-4 w-4 text-cool-primary" />
                <span className="text-sm font-medium">Humidity</span>
              </div>
              <div className="text-2xl font-bold text-cool-primary">{userAnalytics ? `${userAnalytics.avgHumidity}%` : `${selectedZone.humidity}%`}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Wind className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">AQI</span>
              </div>
              <div className="text-2xl font-bold text-muted-foreground">{userAnalytics ? userAnalytics.peakAQI : selectedZone.aqi}</div>
            </div>
          </div>

          {/* AI Summary */}
          <Card className="bg-gradient-hero border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold text-sm">AI</span>
                </div>
                <div>
                  <div className="font-medium text-sm mb-1">AI Risk Assessment</div>
                  <div className="text-sm text-muted-foreground">
                    {getAISummary(selectedZone)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeatMapComponent;