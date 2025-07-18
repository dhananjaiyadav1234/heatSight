import Navigation from "@/components/Navigation";
import RouteAdvisor from "@/components/RouteAdvisor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, Bus, Car, AlertTriangle, Shield, Thermometer, Clock, Users } from "lucide-react";
import routePlanningImage from "@/assets/route-planning.jpg";

const TransportStaffPage = () => {
  const vehicleTypes = [
    { icon: Bus, label: "Public Bus", risk: "High passenger exposure" },
    { icon: Truck, label: "Delivery Truck", risk: "Cargo temperature risk" },
    { icon: Car, label: "Taxi/Rideshare", risk: "AC system strain" },
  ];

  const safetyTips = [
    {
      icon: Thermometer,
      title: "Pre-Trip Cooling",
      description: "Start AC 10 minutes before departure to reduce cabin temperature"
    },
    {
      icon: Clock,
      title: "Schedule Optimization",
      description: "Avoid 11 AM - 4 PM peak heat hours when possible"
    },
    {
      icon: Users,
      title: "Passenger Safety",
      description: "Monitor elderly and children for heat stress symptoms"
    },
    {
      icon: Shield,
      title: "Vehicle Maintenance",
      description: "Check AC refrigerant and coolant levels weekly during summer"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${routePlanningImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-cool" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-cool-primary rounded-2xl flex items-center justify-center shadow-cool">
                <Bus className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Transport Heat Safety
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Smart routing and safety protocols for buses, delivery vehicles, and rideshare services 
              during extreme heat conditions.
            </p>
            <Badge variant="safe" className="text-sm px-4 py-2">
              AI-Optimized Route Planning
            </Badge>
          </div>
        </div>
      </section>

      {/* Vehicle Type Selection */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
              Select Your Vehicle Type
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {vehicleTypes.map((vehicle, index) => (
                <Card key={index} className="group hover:shadow-cool transition-all duration-300 cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-cool-primary rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <vehicle.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{vehicle.label}</h3>
                    <p className="text-sm text-muted-foreground">{vehicle.risk}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Route Planning */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Heat-Safe Route Planning
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our AI analyzes real-time temperature data to suggest routes that minimize 
                heat exposure for drivers and passengers while optimizing travel time.
              </p>
            </div>
            
            <RouteAdvisor />
          </div>
        </div>
      </section>

      {/* Safety Guidelines */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Heat Safety Guidelines
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {safetyTips.map((tip, index) => (
                <Card key={index} className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <tip.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{tip.title}</h3>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Protocols */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-alert text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Emergency Heat Protocols
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">For Drivers</h3>
                    <ul className="space-y-2 text-sm opacity-90">
                      <li>• Pull over in shaded areas if experiencing heat exhaustion</li>
                      <li>• Keep extra water bottles and cooling towels</li>
                      <li>• Monitor dashboard temperature warnings</li>
                      <li>• Report AC malfunctions immediately</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">For Passengers</h3>
                    <ul className="space-y-2 text-sm opacity-90">
                      <li>• Provide water to elderly and children passengers</li>
                      <li>• Watch for signs of heat stroke (confusion, nausea)</li>
                      <li>• Open windows if AC fails</li>
                      <li>• Contact emergency services if needed: 108</li>
                    </ul>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/20">
                  <Button variant="secondary" size="lg" className="w-full">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Report Heat Emergency
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="cool" className="h-20 flex-col gap-2">
                <Thermometer className="h-5 w-5" />
                <span className="text-xs">Check Vehicle Temp</span>
              </Button>
              <Button variant="heat" className="h-20 flex-col gap-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-xs">Report Issue</span>
              </Button>
              <Button variant="safe" className="h-20 flex-col gap-2">
                <Shield className="h-5 w-5" />
                <span className="text-xs">Safety Checklist</span>
              </Button>
              <Button variant="mild" className="h-20 flex-col gap-2">
                <Clock className="h-5 w-5" />
                <span className="text-xs">Schedule Break</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TransportStaffPage;