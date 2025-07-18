import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, Database, Thermometer, Wind, Droplets } from "lucide-react";
import { useState } from "react";

// Mock chart data
const mockTemperatureData = [
  { day: "Mon", temp: 38, aqi: 67 },
  { day: "Tue", temp: 41, aqi: 89 },
  { day: "Wed", temp: 44, aqi: 112 },
  { day: "Thu", temp: 42, aqi: 95 },
  { day: "Fri", temp: 39, aqi: 73 },
  { day: "Sat", temp: 37, aqi: 56 },
  { day: "Sun", temp: 35, aqi: 45 },
];

const dataSourcesInfo = [
  { name: "OpenAQ", description: "Air quality data from global monitoring stations", status: "Active", color: "safe" },
  { name: "NOAA", description: "Weather and climate data from US National Weather Service", status: "Active", color: "safe" },
  { name: "IMD", description: "India Meteorological Department weather data", status: "Active", color: "safe" },
  { name: "ISRO", description: "Satellite-based earth observation data", status: "Limited", color: "mild" },
];

const regionData = [
  { region: "Mumbai Central", alerts: 23, avgTemp: 42, risk: "extreme" },
  { region: "Delhi NCR", alerts: 18, avgTemp: 44, risk: "extreme" },
  { region: "Pune Industrial", alerts: 15, avgTemp: 39, risk: "high" },
  { region: "Chennai Coastal", alerts: 8, avgTemp: 36, risk: "mild" },
  { region: "Bangalore Tech", alerts: 3, avgTemp: 32, risk: "safe" },
];

const HeatAnalyticsPage = () => {
  const [selectedDataSource, setSelectedDataSource] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("7days");

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "extreme": return "extreme";
      case "high": return "high";
      case "mild": return "mild";
      case "safe": return "safe";
      default: return "mild";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Active" ? "safe" : "mild";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary-glow/5 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-heat">
                <BarChart3 className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Heat Analytics Dashboard
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Comprehensive heat wave analysis with AI-powered predictions using data from 
              OpenAQ, NOAA, IMD, and ISRO monitoring systems.
            </p>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Data Source</label>
                    <Select value={selectedDataSource} onValueChange={setSelectedDataSource}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        <SelectItem value="openaq">OpenAQ</SelectItem>
                        <SelectItem value="noaa">NOAA</SelectItem>
                        <SelectItem value="imd">IMD</SelectItem>
                        <SelectItem value="isro">ISRO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Time Frame</label>
                    <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7days">Last 7 Days</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                        <SelectItem value="3months">Last 3 Months</SelectItem>
                        <SelectItem value="1year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button variant="heat" className="w-full">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Update Charts
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="text-center shadow-card">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-heat-high rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Thermometer className="h-6 w-6 text-heat-high-foreground" />
                  </div>
                  <div className="text-2xl font-bold text-heat-high">44°C</div>
                  <div className="text-sm text-muted-foreground">Peak Temperature</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-heat-high" />
                    <span className="text-xs text-heat-high">+2°C from yesterday</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center shadow-card">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-cool-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Droplets className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-cool-primary">68%</div>
                  <div className="text-sm text-muted-foreground">Avg Humidity</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <TrendingDown className="h-3 w-3 text-cool-primary" />
                    <span className="text-xs text-cool-primary">-5% from last week</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center shadow-card">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Wind className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold text-muted-foreground">112</div>
                  <div className="text-sm text-muted-foreground">Peak AQI</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-heat-high" />
                    <span className="text-xs text-heat-high">Unhealthy</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center shadow-card">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-heat-extreme rounded-lg flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="h-6 w-6 text-heat-extreme-foreground" />
                  </div>
                  <div className="text-2xl font-bold text-heat-extreme">67</div>
                  <div className="text-sm text-muted-foreground">Heat Alerts</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-heat-extreme" />
                    <span className="text-xs text-heat-extreme">+23 this week</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Temperature Trend Chart */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="shadow-heat">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  7-Day Temperature & AQI Correlation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-muted/20 to-background rounded-lg relative overflow-hidden">
                  {/* Mock chart visualization */}
                  <div className="absolute inset-4">
                    <div className="flex items-end justify-between h-full">
                      {mockTemperatureData.map((data, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                          {/* Temperature bar */}
                          <div 
                            className="bg-gradient-heat rounded-t-lg w-8"
                            style={{ height: `${(data.temp / 50) * 100}%` }}
                          />
                          {/* AQI bar */}
                          <div 
                            className="bg-muted rounded-t-lg w-4"
                            style={{ height: `${(data.aqi / 150) * 60}%` }}
                          />
                          <span className="text-xs text-muted-foreground">{data.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Chart legend */}
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex flex-col gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-heat rounded"></div>
                        <span>Temperature (°C)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-muted rounded"></div>
                        <span>AQI</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Regional Heatwave Data */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Regional Heatwave Alert Frequency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionData.map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{region.region}</div>
                        <div className="text-sm text-muted-foreground">
                          {region.alerts} alerts this month • Avg temp: {region.avgTemp}°C
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold">{region.alerts}</div>
                          <div className="text-xs text-muted-foreground">alerts</div>
                        </div>
                        <Badge variant={getRiskColor(region.risk) as any}>
                          {region.risk.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Data Sources & Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {dataSourcesInfo.map((source, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Database className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{source.name}</span>
                          <Badge variant={getStatusColor(source.status) as any} className="text-xs">
                            {source.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{source.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Insights */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-hero border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">AI</span>
                  </div>
                  AI-Generated Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2 text-heat-high">⚠️ Heat Wave Prediction</h3>
                    <p className="text-sm text-muted-foreground">
                      AI models predict a severe heat wave lasting 5-7 days starting tomorrow. 
                      Mumbai and Delhi regions at highest risk with temperatures exceeding 45°C.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-cool-primary">💡 Optimization Suggestion</h3>
                    <p className="text-sm text-muted-foreground">
                      Recommend shifting outdoor work schedules 2 hours earlier and increasing 
                      hydration break frequency by 40% during predicted peak heat period.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeatAnalyticsPage;