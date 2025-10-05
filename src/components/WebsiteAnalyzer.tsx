import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Globe, DollarSign, Target } from "lucide-react";
interface WebsiteAnalyzerProps {
  onStrategyGenerated: (strategy: any) => void;
}
export const WebsiteAnalyzer = ({
  onStrategyGenerated
}: WebsiteAnalyzerProps) => {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [budget, setBudget] = useState("");
  const [goal, setGoal] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const {
    toast
  } = useToast();
  const handleAnalyze = async () => {
    if (!websiteUrl || !budget || !goal) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all fields"
      });
      return;
    }
    setAnalyzing(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke("analyze-website", {
        body: {
          websiteUrl,
          budget: parseFloat(budget),
          goal
        }
      });
      if (error) throw error;
      onStrategyGenerated(data.strategy);
      toast({
        title: "Analysis complete!",
        description: "Your marketing strategy is ready."
      });
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: error.message || "Failed to analyze website. Please try again."
      });
    } finally {
      setAnalyzing(false);
    }
  };
  return <Card className="border-border/50 shadow-card">
      <CardHeader>
        <div>
          <CardTitle className="font-medium">Website </CardTitle>
          <CardDescription className="font-semibold">Enter your details to get your marketing playbook</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="website" className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            Website URL
          </Label>
          <Input id="website" type="url" placeholder="https://example.com" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} className="bg-background/50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal" className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Marketing Goal
          </Label>
          <Textarea id="goal" placeholder="e.g., Increase online sales by 50% in the next quarter" value={goal} onChange={e => setGoal(e.target.value)} className="bg-background/50 min-h-[100px]" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            Monthly Budget (USD)
          </Label>
          <Input id="budget" type="number" placeholder="5000" value={budget} onChange={e => setBudget(e.target.value)} className="bg-background/50" />
        </div>

        <Button onClick={handleAnalyze} disabled={analyzing} className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity" size="lg">
          {analyzing ? <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Analyzing...
            </> : <>
              <Sparkles className="mr-2 h-5 w-5" />
              Analyze & Generate Strategy
            </>}
        </Button>
      </CardContent>
    </Card>;
};