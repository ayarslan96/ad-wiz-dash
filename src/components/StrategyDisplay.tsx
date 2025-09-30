import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, DollarSign, Target, Zap } from "lucide-react";

interface StrategyProps {
  strategy: {
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
  };
}

export const StrategyDisplay = ({ strategy }: StrategyProps) => {
  const chartColors = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"];

  return (
    <div className="space-y-6">
      {/* Overall Strategy */}
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <CardTitle>Strategic Recommendation</CardTitle>
              <CardDescription>AI-generated marketing strategy</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{strategy.overallStrategy}</p>
        </CardContent>
      </Card>

      {/* Budget Allocation */}
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-accent" />
            </div>
            <div>
              <CardTitle>Budget Allocation</CardTitle>
              <CardDescription>Recommended spend distribution across channels</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {strategy.channels.map((channel, index) => (
            <div key={channel.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${chartColors[index % chartColors.length]}`} />
                  <span className="font-medium">{channel.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{channel.allocation}%</div>
                  <div className="text-xs text-muted-foreground">
                    ROAS: {channel.expectedROAS.toFixed(2)}x
                  </div>
                </div>
              </div>
              <Progress value={channel.allocation} className="h-2" />
              <p className="text-sm text-muted-foreground">{channel.reasoning}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Expected Results */}
      <Card className="border-border/50 shadow-card bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-success" />
            </div>
            <div>
              <CardTitle>Projected Results</CardTitle>
              <CardDescription>Expected performance metrics</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Projected Revenue</div>
              <div className="text-3xl font-bold text-success">
                ${strategy.expectedResults.projectedRevenue.toLocaleString()}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Expected ROAS</div>
              <div className="text-3xl font-bold text-primary">
                {strategy.expectedResults.projectedROAS.toFixed(2)}x
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Timeframe</div>
              <div className="text-3xl font-bold text-secondary">
                {strategy.expectedResults.timeframe}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
