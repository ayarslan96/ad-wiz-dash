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

    // Simulate a brief delay for better UX
    setTimeout(() => {
      const staticStrategy = {
        content: `# Website & Goal Analysis

outrank.so is a comprehensive, AI-powered platform designed to automate and scale Search Engine Optimization (SEO) and content creation. It handles the entire workflow, from analyzing a business's niche and finding low-competition keywords to automatically generating, optimizing, and publishing unique blog posts daily.

With a modest $250 budget to get more traffic, the most profitable strategy is to focus on capturing users who are already looking for a solution. Splitting the budget too thinly across multiple platforms with low purchase intent would be inefficient. Therefore, the budget should be strategically split between the two highest-intent platforms for this audience: Google Search and X (formerly Twitter).

## Budget Allocation

| Platform | Budget | Percentage |
|----------|--------|------------|
| Google Search Ads | $175.00 | 70% |
| X (Twitter) Ads | $75.00 | 30% |

## Predicted Metrics for a $250 Ad Spend

| Metric | Google Ads | X (Twitter) Ads | Total / Blended |
|--------|-----------|-----------------|-----------------|
| Ad Spend Allocation | $175.00 | $75.00 | $250.00 |
| Predicted Clicks | 25 - 44 | 90 - 150 | 115 - 194 |
| Predicted Avg. CPC | $4.00 - $7.00 | $0.50 - $0.80 | $1.29 - $2.17 |
| Predicted Conversion Rate | ~7.0% | ~3.0% | ~4.1% |
| New Free Trial Sign-ups | 2 - 3 | 3 - 5 | 5 - 8 |
| Cost Per Acquisition (CPA) | $58 - $88 | $15 - $25 | $31 - $50 |

---

## 1. Google Search Ads: Capturing Active Searchers ($175)

This is the most crucial channel. You are placing your solution directly in front of people who are actively typing "how do I automate my SEO" into Google.

**Campaign Goal:** Website Traffic, with a focus on Conversions (Free Trial Sign-ups).

**Budget:** ~$12 per day for a 14-day test period.

### Targeting Strategy

**Keywords:** Focus on specific, long-tail keywords that signal high purchase intent. The SEO tool space has very high CPCs (some keywords exceeding $100), so you must be precise.

- **High-Intent Keywords to Target:** "automated seo content," "ai blog writer for wordpress," "outrank.so alternative," "ai seo automation tool," "generate blog posts automatically."
- **Negative Keywords to Add:** "free," "jobs," "course," "how to learn," "examples." This prevents you from wasting money on searchers who are not looking to buy a tool.

**Audience:** Layer on "In-Market Audiences" such as "SEO & SEM Services" and "Advertising & Marketing Services" to further qualify your traffic.

### Ad Creative

- **Headline 1:** Automated SEO Content Engine
- **Headline 2:** Outrank: AI-Powered Blogging
- **Description:** Stop writing, start ranking. Outrank.so finds keywords, writes, and publishes unique SEO articles to your blog every single day.
- **Call to Action (CTA):** "Start Free Trial"

### Predicted Metrics for Google Ads ($175 Spend)

- **Average CPC:** $4.00 - $7.00 (This is a competitive B2B SaaS niche)
- **Website Clicks:** 25 - 44
- **Conversion Rate (to Free Trial):** ~7% (Higher intent from search traffic)
- **Predicted New Free Trial Sign-ups:** 2 - 3

---

## 2. X (Twitter) Ads: Targeting the Community ($75)

X is where your target audience of marketers, founders, and SEO professionals congregates. The goal here is to get in front of them with a compelling offer at a lower cost-per-click than Google.

**Campaign Goal:** Website Traffic.

**Budget:** ~$5 per day for a 14-day test period.

### Targeting Strategy

- **Follower Look-alikes:** Target users who are similar to the followers of major SEO and marketing accounts (e.g., @semrush, @ahrefs, @randfish, @neilpatel). This is a powerful way to find your ideal customer profile.
- **Keyword Targeting:** Show ads to users who have recently used or searched for terms like "#SEO," "#contentmarketing," "AI writer," or "organic growth."
- **Interest Targeting:** Target users interested in "Search engine optimization," "Marketing," and "Startups."

### Ad Creative

- **Format:** A short, compelling video ad (under 30 seconds) showing a screen recording of the Outrank dashboard in action. Video ads get significantly more engagement on X.
- **Ad Copy:** "Tired of the SEO grind? Our AI finds your keywords, writes unique articles, and publishes to your blog every day. Automate your organic growth. See how Outrank.so works 👇"
- **Call to Action (CTA):** "Learn More" or "Try for Free"

### Predicted Metrics for X Ads ($75 Spend)

- **Average CPC:** $0.50 - $0.80 (More efficient for traffic than Google)
- **Website Clicks:** 90 - 150
- **Conversion Rate (to Free Trial):** ~3% (Lower intent than search, more of a discovery platform)
- **Predicted New Free Trial Sign-ups:** 3 - 5

---

## Total Predicted Results ($250 Budget)

By combining these two platforms, you leverage the high intent of Google and the targeted reach of X.

- **Total Website Clicks:** 115 - 194
- **Total New Free Trial Sign-ups:** 5 - 8
- **Blended Cost Per Acquisition (CPA):** $31 - $50 per trial user

This focused strategy provides the best chance of acquiring your first paying customers with a small budget and, more importantly, gathering the essential data needed to understand which channel is most profitable for future, larger-scale campaigns.`
      };

      onStrategyGenerated(staticStrategy);
      setAnalyzing(false);
      toast({
        title: "Analysis complete!",
        description: "Your marketing strategy is ready."
      });
    }, 1000);
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