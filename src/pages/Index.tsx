import Navigation from "@/components/Navigation";
import HeatMapComponent from "@/components/HeatMapComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Thermometer, Route, BarChart3, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-heat rounded-2xl flex items-center justify-center shadow-heat">
                <Thermometer className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              HeatSight
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              AI-powered climate resilience platform helping workers and transport staff navigate extreme heat with real-time risk assessment and route optimization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="heat" size="lg" className="gap-2">
                <MapPin className="h-5 w-5" />
                View Live Heat Map
              </Button>
              <Button variant="cool" size="lg" className="gap-2">
                <Zap className="h-5 w-5" />
                Get Smart Routes
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Choose Your Role
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Link to="/transport">
              <Card className="group hover:shadow-heat transition-all duration-300 cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-cool rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Route className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Transport Staff</h3>
                  <p className="text-muted-foreground">
                    Get heat-safe routes and vehicle cooling recommendations for safer passenger transport.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/worker">
              <Card className="group hover:shadow-heat transition-all duration-300 cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-heat rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Thermometer className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Field Workers</h3>
                  <p className="text-muted-foreground">
                    Personalized heat safety advice for construction, delivery, and outdoor workers.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/analytics">
              <Card className="group hover:shadow-heat transition-all duration-300 cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Heat Analytics</h3>
                  <p className="text-muted-foreground">
                    View trends, predictions, and regional heat wave patterns with AI insights.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Heat Map */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Live Heat Risk Map
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Real-time temperature monitoring with AI-powered risk assessment. 
                Click on heat zones for detailed information and safety recommendations.
              </p>
            </div>
            
            <HeatMapComponent />
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              AI-Powered Climate Intelligence
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-heat-safe rounded-lg flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-heat-safe-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Real-Time Monitoring</h3>
                  <p className="text-sm text-muted-foreground">
                    Live temperature, humidity, and AQI data from multiple sources
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-heat-mild rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Route className="h-6 w-6 text-heat-mild-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Smart Routing</h3>
                  <p className="text-sm text-muted-foreground">
                    Optimize routes to avoid extreme heat zones and reduce exposure
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-heat-high rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-heat-high-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">AI Predictions</h3>
                  <p className="text-sm text-muted-foreground">
                    Machine learning models predict heat waves and health risks
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-cool-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Data Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive insights from OpenAQ, NOAA, IMD, and ISRO data
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-heat rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-bold text-lg">HeatSight</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Building climate resilience through AI-powered heat risk management
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
