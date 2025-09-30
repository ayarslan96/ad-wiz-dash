import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, Zap, Target, DollarSign, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Marketing Intelligence</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Maximize Your Ad Spend with{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                AI-Driven Insights
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get personalized, data-driven marketing strategies that optimize your ROAS. 
              Our AI analyzes your website and goals to deliver actionable recommendations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-lg px-8"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/auth")}
                className="border-primary/50 hover:bg-primary/10 text-lg px-8"
              >
                View Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-glow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Optimize ROAS</h3>
              <p className="text-muted-foreground">
                Get AI-powered recommendations to maximize your return on ad spend across all channels.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-secondary/50 transition-all hover:shadow-glow">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Allocation</h3>
              <p className="text-muted-foreground">
                Intelligent budget distribution across Google Ads, Facebook, Instagram, and more.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-accent/50 transition-all hover:shadow-glow">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Increase Revenue</h3>
              <p className="text-muted-foreground">
                Data-driven strategies designed to boost conversions and revenue growth.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm border border-border/50">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Marketing?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join businesses already optimizing their ad spend with AI
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-lg px-8"
            >
              Start Analyzing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
