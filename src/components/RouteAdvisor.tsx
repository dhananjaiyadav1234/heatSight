import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navigation, MapPin, Clock, Thermometer, Route, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

// Mock route data
const mockRoutes = {
  default: {
    duration: "35 mins",
    distance: "18.5 km",
    heatRisk: "high",
    segments: [
      { name: "Main St", risk: "mild", temp: 36 },
      { name: "Industrial Rd", risk: "extreme", temp: 44 },
      { name: "Highway 101", risk: "high", temp: 40 },
    ]
  },
  alternative: {
    duration: "42 mins",
    distance: "21.2 km",
    heatRisk: "safe",
    segments: [
      { name: "Coastal Rd", risk: "safe", temp: 32 },
      { name: "Shaded Ave", risk: "mild", temp: 35 },
      { name: "Tree Line Blvd", risk: "safe", temp: 31 },
    ]
  }
};

const RouteAdvisor = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [routes, setRoutes] = useState<any[]>([]);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const handlePlanRoute = async () => {
    if (!from || !to) {
      toast({
        title: "Missing information",
        description: "Please enter both start and destination locations",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await fetch(`/api/routes/heat-safe-navigation?startName=${encodeURIComponent(from)}&endName=${encodeURIComponent(to)}`);
      if (!res.ok) throw new Error("Failed to fetch route");
      const data = await res.json();
      setRoutes(data.routes || []);
      setSelectedRouteIdx(0);
    setShowResults(true);
    toast({
      title: "Route calculated",
      description: "Showing heat-optimized routes",
    });
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  // Draw route on the map
  useEffect(() => {
    if (!mapRef.current && mapContainer.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [77.5946, 12.9716], // Default to Bangalore
        zoom: 12,
      });
    }

    if (mapRef.current && routes[selectedRouteIdx]) {
      const map = mapRef.current;
      function addRouteLayer() {
        // Remove previous route layer/source if exists
        if (map.getLayer('route')) {
          map.removeLayer('route');
        }
        if (map.getSource('route')) {
          map.removeSource('route');
        }
        map.flyTo({
          center: routes[selectedRouteIdx].geometry.coordinates[0],
          zoom: 12,
        });
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: routes[selectedRouteIdx].geometry,
          },
        });
        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': '#ff6600', 'line-width': 6 },
        });
      }
      if (!map.isStyleLoaded()) {
        map.once('style.load', addRouteLayer);
      } else {
        addRouteLayer();
      }
    }
  }, [routes, selectedRouteIdx]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "extreme": return "extreme";
      case "high": return "high";
      case "mild": return "mild";
      case "safe": return "safe";
      default: return "mild";
    }
  };

  const getRouteIcon = (risk: string) => {
    return risk === "safe" ? Route : AlertTriangle;
  };

  return (
    <div className="space-y-6">
      {/* Route Input */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            Heat-Safe Route Planner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter starting location"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter destination"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <Button onClick={handlePlanRoute} className="w-full" variant="heat">
            <Route className="h-4 w-4 mr-2" />
            Plan Heat-Safe Route
          </Button>
        </CardContent>
      </Card>

      {/* Route Results */}
      {showResults && routes.length > 0 && (
        <div className="space-y-4">
          {/* Route Options */}
          <div className="grid gap-4 md:grid-cols-2">
            {routes.map((route, idx) => (
            <Card 
                key={idx}
              className={`cursor-pointer transition-all duration-300 ${
                  selectedRouteIdx === idx ? "ring-2 ring-primary shadow-heat" : "hover:shadow-card"
              }`}
                onClick={() => setSelectedRouteIdx(idx)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Route {idx + 1}</CardTitle>
                    <Badge variant="mild">Route</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                      {Math.round(route.duration / 60)} mins
                    </div>
                    <div>{(route.distance / 1000).toFixed(1)} km</div>
                  </div>
                  {/* You can add more details here, e.g., steps, risk, etc. */}
              </CardContent>
            </Card>
            ))}
          </div>

          {/* Route Visualization */}
          <Card className="shadow-heat">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5 text-primary" />
                Route Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={mapContainer} style={{ width: "100%", height: "300px" }} />
            </CardContent>
          </Card>

          {/* Turn-by-Turn Directions */}
          {routes[selectedRouteIdx]?.legs && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-primary" />
                  Turn-by-Turn Directions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal pl-6 space-y-1">
                  {routes[selectedRouteIdx].legs[0].steps.map((step: any, idx: number) => (
                    <li key={idx}>{step.maneuver.instruction}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          {/* Route Summary */}
          <Card className="bg-gradient-hero border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold text-sm">AI</span>
                </div>
                <div>
                  <div className="font-medium text-sm mb-1">Route Recommendation</div>
                  <div className="text-sm text-muted-foreground">
                    {routes.length > 0
                      ? `Recommended: Route ${selectedRouteIdx + 1} is the best available based on current data.`
                      : "No routes found."}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RouteAdvisor;