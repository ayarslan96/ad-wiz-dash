import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface StrategyProps {
  strategy: {
    websiteAnalysis: string;
    strategicApproach: string;
    channels: Array<{
      name: string;
      allocation: number;
      percentage: number;
      strategy: string;
      predictedMetrics: {
        dailyBudget: number;
        averageCPC: string;
        clicks: string;
        conversionRate: string;
        conversions: string;
        costPerAcquisition: string;
      };
    }>;
    totalPredictedResults: {
      totalClicks: string;
      totalConversions: string;
      blendedCPA: string;
      summary: string;
    };
  };
}

export const StrategyDisplay = ({ strategy }: StrategyProps) => {
  const totalBudget = strategy.channels.reduce((sum, channel) => sum + channel.allocation, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Website & Goal Analysis */}
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="font-medium">Website & Goal Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{strategy.websiteAnalysis}</p>
          <div className="mt-6 pt-6 border-t border-border/30">
            <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{strategy.strategicApproach}</p>
          </div>
        </CardContent>
      </Card>

      {/* Budget Allocation Summary */}
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="font-medium">Budget Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {strategy.channels.map((channel, index) => (
              <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-accent/5 border border-border/30">
                <span className="font-medium">{channel.name}</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-primary">${channel.allocation}</span>
                  <span className="text-sm text-muted-foreground ml-2">({channel.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predicted Metrics Table */}
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="font-medium">Predicted Metrics for ${totalBudget} Ad Spend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  {strategy.channels.map((channel, index) => (
                    <TableHead key={index}>{channel.name}</TableHead>
                  ))}
                  <TableHead>Total / Blended</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Ad Spend Allocation</TableCell>
                  {strategy.channels.map((channel, index) => (
                    <TableCell key={index}>${channel.allocation.toFixed(2)}</TableCell>
                  ))}
                  <TableCell>${totalBudget.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Predicted Clicks</TableCell>
                  {strategy.channels.map((channel, index) => (
                    <TableCell key={index}>{channel.predictedMetrics.clicks}</TableCell>
                  ))}
                  <TableCell>{strategy.totalPredictedResults.totalClicks}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Predicted Avg. CPC</TableCell>
                  {strategy.channels.map((channel, index) => (
                    <TableCell key={index}>{channel.predictedMetrics.averageCPC}</TableCell>
                  ))}
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Predicted Conversion Rate</TableCell>
                  {strategy.channels.map((channel, index) => (
                    <TableCell key={index}>{channel.predictedMetrics.conversionRate}</TableCell>
                  ))}
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">New Conversions</TableCell>
                  {strategy.channels.map((channel, index) => (
                    <TableCell key={index}>{channel.predictedMetrics.conversions}</TableCell>
                  ))}
                  <TableCell>{strategy.totalPredictedResults.totalConversions}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Cost Per Acquisition (CPA)</TableCell>
                  {strategy.channels.map((channel, index) => (
                    <TableCell key={index}>{channel.predictedMetrics.costPerAcquisition}</TableCell>
                  ))}
                  <TableCell>{strategy.totalPredictedResults.blendedCPA}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Channel Strategies */}
      {strategy.channels.map((channel, index) => (
        <Card key={index} className="border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="font-medium">
              {index + 1}. {channel.name} (${channel.allocation})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{channel.strategy}</p>
              
              <div className="pt-4 border-t border-border/30">
                <h4 className="font-semibold mb-3">Predicted Metrics for {channel.name} (${channel.allocation} Spend):</h4>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="p-3 rounded-lg bg-accent/5 border border-border/30">
                    <div className="text-sm text-muted-foreground">Average CPC</div>
                    <div className="text-lg font-semibold">{channel.predictedMetrics.averageCPC}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-accent/5 border border-border/30">
                    <div className="text-sm text-muted-foreground">Website Clicks</div>
                    <div className="text-lg font-semibold">{channel.predictedMetrics.clicks}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-accent/5 border border-border/30">
                    <div className="text-sm text-muted-foreground">Conversion Rate</div>
                    <div className="text-lg font-semibold">{channel.predictedMetrics.conversionRate}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-accent/5 border border-border/30">
                    <div className="text-sm text-muted-foreground">Predicted Conversions</div>
                    <div className="text-lg font-semibold">{channel.predictedMetrics.conversions}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Total Predicted Results */}
      <Card className="border-border/50 shadow-card bg-primary/5">
        <CardHeader>
          <CardTitle className="font-medium">Total Predicted Results (${totalBudget} Budget)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 mb-4">
            <div className="p-4 rounded-lg bg-background border border-border/30">
              <div className="text-sm text-muted-foreground mb-1">Total Website Clicks</div>
              <div className="text-2xl font-bold text-primary">{strategy.totalPredictedResults.totalClicks}</div>
            </div>
            <div className="p-4 rounded-lg bg-background border border-border/30">
              <div className="text-sm text-muted-foreground mb-1">Total Conversions</div>
              <div className="text-2xl font-bold text-primary">{strategy.totalPredictedResults.totalConversions}</div>
            </div>
            <div className="p-4 rounded-lg bg-background border border-border/30">
              <div className="text-sm text-muted-foreground mb-1">Blended CPA</div>
              <div className="text-2xl font-bold text-primary">{strategy.totalPredictedResults.blendedCPA}</div>
            </div>
          </div>
          <p className="text-foreground/80 leading-relaxed">{strategy.totalPredictedResults.summary}</p>
        </CardContent>
      </Card>
    </div>
  );
};
