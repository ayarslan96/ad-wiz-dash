import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, LogOut } from "lucide-react";
import { WebsiteAnalyzer } from "@/components/WebsiteAnalyzer";
import { StrategyDisplay } from "@/components/StrategyDisplay";

interface Strategy {
  channels: Array<{
    name: string;
    allocation: number;
    expectedROAS: number;
    reasoning: string;
  }>;
  overallStrategy: string;
  expectedResults: {
    projectedRevenue: number;
    projectedROAS: number;
    timeframe: string;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [strategy, setStrategy] = useState<Strategy | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out successfully" });
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-card/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              HigherROAS
            </h1>
          </div>
          <Button variant="ghost" onClick={handleLogout} size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold">AI-Powered Ad Strategy</h2>
            <p className="text-muted-foreground text-lg">
              Get data-driven recommendations for your ad spend allocation
            </p>
          </div>

          <WebsiteAnalyzer onStrategyGenerated={setStrategy} />

          {strategy && <StrategyDisplay strategy={strategy} />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
