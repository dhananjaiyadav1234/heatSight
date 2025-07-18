import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navigation, MapPin, Clock, Thermometer, Route, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  const [selectedRoute, setSelectedRoute] = useState<"default" | "alternative">("alternative");
  const [showResults, setShowResults] = useState(false);

  const handlePlanRoute = () => {
    if (!from || !to) {
      toast({
        title: "Missing information",
        description: "Please enter both start and destination locations",
        variant: "destructive",
      });
      return;
    }
    setShowResults(true);
    toast({
      title: "Route calculated",
      description: "Showing heat-optimized routes",
    });
  };

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
      {showResults && (
        <div className="space-y-4">
          {/* Route Options */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Default Route */}
            <Card 
              className={`cursor-pointer transition-all duration-300 ${
                selectedRoute === "default" ? "ring-2 ring-primary shadow-heat" : "hover:shadow-card"
              }`}
              onClick={() => setSelectedRoute("default")}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Fastest Route</CardTitle>
                  <Badge variant={getRiskColor(mockRoutes.default.heatRisk) as any}>
                    {mockRoutes.default.heatRisk.toUpperCase()} HEAT
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {mockRoutes.default.duration}
                  </div>
                  <div>{mockRoutes.default.distance}</div>
                </div>
                <div className="space-y-2">
                  {mockRoutes.default.segments.map((segment, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{segment.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={getRiskColor(segment.risk) as any}>
                          {segment.temp}°C
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alternative Route */}
            <Card 
              className={`cursor-pointer transition-all duration-300 ${
                selectedRoute === "alternative" ? "ring-2 ring-cool-primary shadow-cool" : "hover:shadow-card"
              }`}
              onClick={() => setSelectedRoute("alternative")}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Heat-Safe Route</CardTitle>
                  <Badge variant={getRiskColor(mockRoutes.alternative.heatRisk) as any}>
                    {mockRoutes.alternative.heatRisk.toUpperCase()} HEAT
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {mockRoutes.alternative.duration}
                  </div>
                  <div>{mockRoutes.alternative.distance}</div>
                </div>
                <div className="space-y-2">
                  {mockRoutes.alternative.segments.map((segment, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{segment.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={getRiskColor(segment.risk) as any}>
                          {segment.temp}°C
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Route Visualization */}
          <Card className="shadow-heat">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const Icon = getRouteIcon(mockRoutes[selectedRoute].heatRisk);
                  return <Icon className="h-5 w-5 text-primary" />;
                })()}
                Route Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg relative overflow-hidden">
                {/* Mock route visualization */}
                <div className="absolute inset-4 flex items-center">
                  <div className="flex-1 h-2 bg-gradient-to-r from-heat-safe via-heat-mild to-heat-safe rounded-full relative">
                    {/* Route markers */}
                    <div className="absolute -top-1 left-0 w-4 h-4 bg-primary rounded-full border-2 border-white"></div>
                    <div className="absolute -top-1 right-0 w-4 h-4 bg-primary rounded-full border-2 border-white"></div>
                    
                    {/* Route segments visualization */}
                    {selectedRoute === "default" && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <Badge variant="extreme">Extreme Heat Zone</Badge>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-sm font-medium mb-2">
                      {selectedRoute === "default" ? "Fastest but risky route" : "Longer but heat-safe route"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Selected route avoids high-heat zones for safer transport
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
                    {selectedRoute === "alternative" 
                      ? "✅ Recommended: This route adds 7 minutes but avoids extreme heat zones, reducing health risks for drivers and passengers."
                      : "⚠️ Caution: Fastest route includes extreme heat zones. Consider the safer alternative for sensitive passengers or long stops."
                    }
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