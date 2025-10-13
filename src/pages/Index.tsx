import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, Target, DollarSign, ArrowRight, BarChart3 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative">
      {/* Minimal red accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      {/* Subtle red glow */}
      <div className="absolute top-40 right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium tracking-wide uppercase text-foreground/80">AI-Powered Intelligence</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold leading-[1.1] tracking-tight mb-8">
              Maximize ROI.
              <br />
              <span className="text-primary">Minimize Waste.</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12 leading-relaxed">
              Data-driven marketing strategies powered by AI. 
              Optimize your ad spend with precision recommendations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-base px-8 py-6 h-auto group"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/auth")}
                className="border-border hover:bg-secondary text-base px-8 py-6 h-auto"
              >
                View Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-20 border-y border-border/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto">
            {[
              { value: "45%", label: "Avg ROAS Increase" },
              { value: "12min", label: "Setup Time" },
              { value: "500+", label: "Active Users" },
              { value: "24/7", label: "AI Analysis" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2 text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-32">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-px bg-border/50 border border-border/50">
              {[
                {
                  icon: TrendingUp,
                  title: "Optimize ROAS",
                  description: "AI-powered recommendations to maximize return on ad spend."
                },
                {
                  icon: Target,
                  title: "Smart Allocation",
                  description: "Intelligent budget distribution across all channels."
                },
                {
                  icon: BarChart3,
                  title: "Real-time Analytics",
                  description: "Live performance tracking and instant insights."
                }
              ].map((feature, i) => (
                <div key={i} className="bg-background p-8 group hover:bg-secondary/50 transition-colors">
                  <feature.icon className="w-8 h-8 mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-32">
          <div className="max-w-4xl mx-auto text-center border border-border/50 p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Ready to optimize your marketing?
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join forward-thinking businesses using AI to maximize ad performance.
              </p>
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-base px-8 py-6 h-auto group"
              >
                Start Free Analysis
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
