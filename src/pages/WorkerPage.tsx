import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { HardHat, Truck, Stethoscope, MapPin, Clock, Thermometer, Droplets, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const WorkerPage = () => {
  const [selectedProfession, setSelectedProfession] = useState("");
  const [location, setLocation] = useState("");

  const professions = [
    { value: "construction", label: "Construction Worker", icon: HardHat, risk: "extreme" },
    { value: "delivery", label: "Delivery Agent", icon: Truck, risk: "high" },
  ];

  const getAdviceForProfession = (profession: string) => {
    const advice = {
      construction: {
        avoid: ["10 AM - 4 PM outdoor work", "Heavy lifting in direct sun", "Dark colored protective gear"],
        recommend: ["Frequent water breaks every 15 mins", "Light-colored clothing", "Seek shade during breaks"],
        schedule: "Start work at 6 AM, break 10 AM-4 PM, resume 4 PM-7 PM"
      },
      delivery: {
        avoid: ["Long stops in unshaded areas", "Heavy packages during peak heat", "Closed vehicle cabins"],
        recommend: ["Pre-cool delivery vehicle", "Carry insulated water bottles", "Plan shorter routes"],
        schedule: "Early morning (6-10 AM) and evening (5-8 PM) deliveries"
      }
    };
    return advice[profession as keyof typeof advice] || advice.construction;
  };

  const handleGetAdvice = () => {
    if (!selectedProfession || !location) {
      toast({
        title: "Missing information",
        description: "Please select profession and enter location",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Advice generated",
      description: "Personalized heat safety recommendations ready",
    });
  };

  const selectedProfessionData = professions.find(p => p.value === selectedProfession);
  const advice = selectedProfession ? getAdviceForProfession(selectedProfession) : null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-heat" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-heat">
                <HardHat className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Worker Heat Safety
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Personalized heat safety recommendations for construction workers and delivery agents based on real-time conditions and AI risk assessment.
            </p>
          </div>
        </div>
      </section>

      {/* Profession Selection */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-center">Get Personalized Heat Safety Advice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Your Profession</label>
                    <Select value={selectedProfession} onValueChange={setSelectedProfession}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your profession" />
                      </SelectTrigger>
                      <SelectContent>
                        {professions.map((profession) => (
                          <SelectItem key={profession.value} value={profession.value}>
                            <div className="flex items-center gap-2">
                              <profession.icon className="h-4 w-4" />
                              {profession.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Work Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter your work location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                <Button onClick={handleGetAdvice} className="w-full" variant="heat">
                  <Thermometer className="h-4 w-4 mr-2" />
                  Get AI-Powered Safety Advice
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Profession-Specific Advice */}
      {selectedProfessionData && advice && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Current Risk Level */}
              <Card className="shadow-heat">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <selectedProfessionData.icon className="h-5 w-5 text-primary" />
                    Current Risk Level - {selectedProfessionData.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">42°C</div>
                        <div className="text-sm text-muted-foreground">Temperature</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-cool-primary">68%</div>
                        <div className="text-sm text-muted-foreground">Humidity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-heat-high">89</div>
                        <div className="text-sm text-muted-foreground">AQI</div>
                      </div>
                    </div>
                    <Badge variant="destructive" className="text-lg px-4 py-2">
                      {selectedProfessionData.risk.toUpperCase()} RISK
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Work Schedule Recommendation */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Recommended Work Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-hero rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-foreground font-bold text-sm">AI</span>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Optimal Schedule</div>
                        <div className="text-sm text-muted-foreground">
                          {advice.schedule}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Safety Guidelines */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Things to Avoid */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-heat-high">
                      <AlertTriangle className="h-5 w-5" />
                      Avoid During Heat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {advice.avoid.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-heat-high mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-heat-safe">
                      <CheckCircle className="h-5 w-5" />
                      Recommended Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {advice.recommend.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-heat-safe mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Heat Stress Symptoms */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-alert text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recognize Heat Stress Symptoms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Early Warning Signs</h3>
                    <ul className="space-y-2 text-sm opacity-90">
                      <li>• Excessive sweating or stopped sweating</li>
                      <li>• Dizziness or lightheadedness</li>
                      <li>• Nausea or headache</li>
                      <li>• Fatigue or weakness</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Emergency Signs</h3>
                    <ul className="space-y-2 text-sm opacity-90">
                      <li>• High body temperature (40°C+)</li>
                      <li>• Confusion or altered mental state</li>
                      <li>• Hot, dry skin or profuse sweating</li>
                      <li>• Rapid, strong pulse</li>
                    </ul>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/20">
                  <Button variant="secondary" size="lg" className="w-full">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Emergency Hotline: 108
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Hydration Tracker */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-cool">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-cool-primary" />
                  Daily Hydration Tracker
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-cool-primary mb-2">2.5L</div>
                  <div className="text-sm text-muted-foreground">Recommended daily water intake for outdoor workers</div>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                  {Array.from({ length: 8 }, (_, i) => (
                    <Button
                      key={i}
                      variant={i < 3 ? "cool" : "outline"}
                      size="sm"
                      className="h-12 flex-col gap-1"
                    >
                      <Droplets className="h-4 w-4" />
                      <span className="text-xs">250ml</span>
                    </Button>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <span className="text-sm text-muted-foreground">
                    3/8 glasses completed today
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkerPage;