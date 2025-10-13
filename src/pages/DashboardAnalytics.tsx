import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, DollarSign, Users } from "lucide-react";

const DashboardAnalytics = () => {
  const metrics = [
    {
      title: "Total Spend",
      value: "$2,450",
      change: "+12.5%",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "ROAS",
      value: "4.2x",
      change: "+0.8x",
      icon: TrendingUp,
      trend: "up",
    },
    {
      title: "Conversions",
      value: "1,234",
      change: "+23%",
      icon: Users,
      trend: "up",
    },
    {
      title: "Click-through Rate",
      value: "3.2%",
      change: "+0.5%",
      icon: BarChart3,
      trend: "up",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold">Analytics Overview</h2>
        <p className="text-muted-foreground text-lg mt-2">
          Track your ad performance metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-success">
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>
            Your campaigns are performing well across all channels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-center py-12">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p>Detailed analytics charts coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardAnalytics;
