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
      const { data, error } = await supabase.functions.invoke('analyze-website', {
        body: {
          websiteUrl,
          budget: parseFloat(budget),
          goal
        }
      });

      if (error) throw error;

      if (!data?.strategy) {
        throw new Error('No strategy data received');
      }

      // Format the structured response into markdown content
      const { strategy } = data;
      let content = `# Website & Goal Analysis\n\n${strategy.websiteAnalysis}\n\n`;
      content += `## Strategic Approach\n\n${strategy.strategicApproach}\n\n`;
      
      // Budget allocation table
      if (strategy.channels?.length > 0) {
        content += `## Budget Allocation\n\n`;
        content += `| Platform | Budget | Percentage |\n`;
        content += `|----------|--------|------------|\n`;
        strategy.channels.forEach((channel: any) => {
          content += `| ${channel.name} | $${channel.allocation.toFixed(2)} | ${channel.percentage}% |\n`;
        });
        content += `\n`;
      }

      // Predicted metrics table
      if (strategy.channels?.length > 0) {
        content += `## Predicted Metrics Overview\n\n`;
        content += `| Metric | `;
        strategy.channels.forEach((channel: any) => {
          content += `${channel.name} | `;
        });
        content += `Total / Blended |\n`;
        content += `|--------|`;
        strategy.channels.forEach(() => content += `-----------|`);
        content += `-----------------|\n`;
        
        content += `| Ad Spend Allocation | `;
        strategy.channels.forEach((channel: any) => {
          content += `$${channel.allocation.toFixed(2)} | `;
        });
        content += `$${budget} |\n`;
        
        content += `| Daily Budget | `;
        strategy.channels.forEach((channel: any) => {
          content += `$${channel.predictedMetrics.dailyBudget} | `;
        });
        content += `- |\n`;
        
        content += `| Predicted Clicks | `;
        strategy.channels.forEach((channel: any) => {
          content += `${channel.predictedMetrics.clicks} | `;
        });
        content += `${strategy.totalPredictedResults.totalClicks} |\n`;
        
        content += `| Predicted Avg. CPC | `;
        strategy.channels.forEach((channel: any) => {
          content += `${channel.predictedMetrics.averageCPC} | `;
        });
        content += `- |\n`;
        
        content += `| Predicted Conversion Rate | `;
        strategy.channels.forEach((channel: any) => {
          content += `${channel.predictedMetrics.conversionRate} | `;
        });
        content += `- |\n`;
        
        content += `| New Conversions | `;
        strategy.channels.forEach((channel: any) => {
          content += `${channel.predictedMetrics.conversions} | `;
        });
        content += `${strategy.totalPredictedResults.totalConversions} |\n`;
        
        content += `| Cost Per Acquisition (CPA) | `;
        strategy.channels.forEach((channel: any) => {
          content += `${channel.predictedMetrics.costPerAcquisition} | `;
        });
        content += `${strategy.totalPredictedResults.blendedCPA} |\n\n`;
      }

      // Channel details
      strategy.channels?.forEach((channel: any, index: number) => {
        content += `---\n\n## ${index + 1}. ${channel.name}: $${channel.allocation.toFixed(2)}\n\n`;
        content += `${channel.strategy}\n\n`;
      });

      // Summary
      if (strategy.totalPredictedResults?.summary) {
        content += `---\n\n## Total Predicted Results\n\n${strategy.totalPredictedResults.summary}\n`;
      }

      onStrategyGenerated({ content });
      toast({
        title: "Analysis complete!",
        description: "Your AI-powered marketing strategy is ready."
      });
    } catch (error) {
      console.error('Error analyzing website:', error);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to generate strategy. Please try again."
      });
    } finally {
      setAnalyzing(false);
    }
  };
  return <Card className="border-border/50 shadow-card">
      <CardHeader>
        <div>
          <CardTitle className="font-medium">Campaign Strategy</CardTitle>
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