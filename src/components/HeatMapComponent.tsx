import { useEffect, useRef, useState } from "react";
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

const HeatMapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [selectedZone, setSelectedZone] = useState(mockHeatZones[0]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Initialize mock map display
    if (mapContainer.current) {
      mapContainer.current.style.backgroundImage = `url('/api/placeholder/800/600')`;
      mapContainer.current.style.backgroundSize = 'cover';
      mapContainer.current.style.backgroundPosition = 'center';
    }
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast({
            title: "Location found",
            description: "Heat map centered on your location",
          });
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
            className="h-64 md:h-96 bg-gradient-to-br from-primary/10 to-primary-glow/20 relative"
          >
            {/* Mock Heat Zone Markers */}
            <div className="absolute inset-0 p-4">
              {mockHeatZones.map((zone, index) => (
                <div
                  key={zone.id}
                  className={`absolute cursor-pointer transform transition-all duration-300 hover:scale-110 ${
                    index === 0 ? 'top-4 left-4' :
                    index === 1 ? 'top-8 right-8' :
                    index === 2 ? 'bottom-8 left-8' :
                    'bottom-4 right-4'
                  }`}
                  onClick={() => setSelectedZone(zone)}
                >
                  <div className={`w-8 h-8 rounded-full bg-heat-${getRiskColor(zone.risk)} flex items-center justify-center animate-heat-pulse`}>
                    <span className="text-white text-xs font-bold">{zone.temp}°</span>
                  </div>
                </div>
              ))}
              
              {userLocation && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 bg-cool-primary rounded-full animate-pulse border-2 border-white"></div>
                </div>
              )}
            </div>
            
            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-card">
              <div className="text-xs font-medium mb-2">Heat Risk Levels</div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-heat-safe rounded-full"></div>
                  <span className="text-xs">Safe (&lt;35°C)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-heat-mild rounded-full"></div>
                  <span className="text-xs">Mild (35-38°C)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-heat-high rounded-full"></div>
                  <span className="text-xs">High (38-42°C)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-heat-extreme rounded-full"></div>
                  <span className="text-xs">Extreme (&gt;42°C)</span>
                </div>
              </div>
            </div>
          </div>
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
              <div className="text-2xl font-bold text-primary">{selectedZone.temp}°C</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Droplets className="h-4 w-4 text-cool-primary" />
                <span className="text-sm font-medium">Humidity</span>
              </div>
              <div className="text-2xl font-bold text-cool-primary">{selectedZone.humidity}%</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Wind className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">AQI</span>
              </div>
              <div className="text-2xl font-bold text-muted-foreground">{selectedZone.aqi}</div>
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