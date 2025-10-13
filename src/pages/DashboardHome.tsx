import { useState } from "react";
import { WebsiteAnalyzer } from "@/components/WebsiteAnalyzer";
import { StrategyDisplay } from "@/components/StrategyDisplay";
import { FollowUpQuestions } from "@/components/FollowUpQuestions";

interface Strategy {
  content: string;
}

const DashboardHome = () => {
  const [strategy, setStrategy] = useState<Strategy | null>(null);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold">AI-Powered Ad Strategy</h2>
        <p className="text-muted-foreground text-lg">
          Get data-driven recommendations for your ad spend allocation
        </p>
      </div>

      <WebsiteAnalyzer onStrategyGenerated={setStrategy} />

      {strategy && (
        <>
          <StrategyDisplay strategy={strategy} />
          <FollowUpQuestions strategy={strategy} />
        </>
      )}
    </div>
  );
};

export default DashboardHome;
