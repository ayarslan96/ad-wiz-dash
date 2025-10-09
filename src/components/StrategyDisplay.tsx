import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, DollarSign, Users } from "lucide-react";

interface StrategyProps {
  strategy: {
    content: string;
  };
}

export const StrategyDisplay = ({ strategy }: StrategyProps) => {
  // Parse the markdown-like content into structured sections
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentSection: string[] = [];
    let inTable = false;
    let tableHeaders: string[] = [];
    let tableRows: string[][] = [];
    let inList = false;
    let listItems: JSX.Element[] = [];

    const flushSection = () => {
      if (currentSection.length > 0) {
        const text = currentSection.join(' ');
        // Check for bold markers
        if (text.includes('**')) {
          const parts = text.split(/\*\*(.*?)\*\*/g);
          elements.push(
            <p key={elements.length} className="text-foreground/80 leading-relaxed mb-4 text-base">
              {parts.map((part, i) => 
                i % 2 === 1 ? <strong key={i} className="font-bold text-foreground">{part}</strong> : part
              )}
            </p>
          );
        } else {
          elements.push(
            <p key={elements.length} className="text-foreground/80 leading-relaxed mb-4 text-base">
              {text}
            </p>
          );
        }
        currentSection = [];
      }
    };

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={elements.length} className="space-y-3 mb-6 pl-2">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    const flushTable = () => {
      if (tableHeaders.length > 0 && tableRows.length > 0) {
        elements.push(
          <div key={elements.length} className="mb-10">
            <div className="overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-card via-primary/5 to-secondary/5 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary/20 via-primary/15 to-secondary/20 border-b-2 border-primary/30">
                      {tableHeaders.map((header, i) => (
                        <th key={i} className="px-6 py-5 text-left text-sm font-bold text-foreground tracking-wider uppercase">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {tableRows.map((row, i) => (
                      <tr key={i} className="hover:bg-primary/10 transition-all duration-200 group">
                        {row.map((cell, j) => (
                          <td key={j} className="px-6 py-5 text-base font-semibold text-foreground/95 group-hover:text-foreground transition-colors">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        tableHeaders = [];
        tableRows = [];
        inTable = false;
      }
    };

    lines.forEach((line) => {
      // Main headings
      if (line.startsWith('# ')) {
        flushSection();
        flushTable();
        flushList();
        elements.push(
          <div key={elements.length} className="mt-12 mb-8 first:mt-0">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl border border-primary/30 shadow-lg">
              <Target className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                {line.replace('# ', '')}
              </h2>
            </div>
          </div>
        );
      }
      // Subheadings
      else if (line.startsWith('## ')) {
        flushSection();
        flushTable();
        flushList();
        const text = line.replace('## ', '');
        const icon = text.includes('Google') ? <TrendingUp className="w-5 h-5" /> : 
                     text.includes('X ') || text.includes('Twitter') ? <Users className="w-5 h-5" /> :
                     text.includes('Budget') ? <DollarSign className="w-5 h-5" /> :
                     <Target className="w-5 h-5" />;
        elements.push(
          <div key={elements.length} className="mt-10 mb-6">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/20">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
                {icon}
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {text}
              </h3>
            </div>
          </div>
        );
      }
      // Sub-subheadings
      else if (line.startsWith('### ')) {
        flushSection();
        flushTable();
        flushList();
        elements.push(
          <h4 key={elements.length} className="text-xl font-semibold text-foreground/90 mb-3 mt-6">
            {line.replace('### ', '')}
          </h4>
        );
      }
      // Horizontal rules
      else if (line.trim() === '---') {
        flushSection();
        flushTable();
        flushList();
        elements.push(
          <hr key={elements.length} className="border-border/50 my-8" />
        );
      }
      // Table detection
      else if (line.includes('|') && line.split('|').length > 2) {
        flushSection();
        flushList();
        const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
        
        if (!inTable) {
          // First row is headers
          tableHeaders = cells;
          inTable = true;
        } else if (cells.every(cell => cell.match(/^[-:]+$/))) {
          // Skip separator row
        } else {
          // Data row
          tableRows.push(cells);
        }
      }
      // Bullet points
      else if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        flushSection();
        flushTable();
        const content = line.replace(/^[-•]\s+/, '');
        const parts = content.split(/\*\*(.*?)\*\*/g);
        listItems.push(
          <li key={`list-${elements.length}-${listItems.length}`} className="text-foreground/90 leading-relaxed text-base ml-6 list-disc marker:text-primary marker:text-lg">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i} className="font-bold text-foreground">{part}</strong> : part
            )}
          </li>
        );
        inList = true;
      }
      // Regular paragraphs
      else if (line.trim()) {
        flushTable();
        if (inList) {
          flushList();
        }
        currentSection.push(line.trim());
      }
      // Empty line
      else {
        flushSection();
        flushTable();
        if (inList) {
          flushList();
        }
      }
    });

    flushSection();
    flushTable();
    flushList();
    return elements;
  };

  return (
    <Card className="overflow-hidden border-2 border-primary/30 shadow-2xl bg-gradient-to-br from-card via-card to-primary/5 backdrop-blur-sm">
      <CardHeader className="border-b-2 border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 backdrop-blur-sm pb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              Your Personalized Ad Strategy
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Data-driven campaign recommendations</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-10 lg:p-12">
        <div className="max-w-none space-y-2">
          {renderContent(strategy.content)}
        </div>
      </CardContent>
    </Card>
  );
};
