import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
          <div key={elements.length} className="overflow-x-auto mb-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 shadow-lg">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-primary/20">
                <tr>
                  {tableHeaders.map((header, i) => (
                    <th key={i} className="px-6 py-4 text-left text-sm font-bold text-foreground tracking-wide">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {tableRows.map((row, i) => (
                  <tr key={i} className="hover:bg-primary/5 transition-colors">
                    {row.map((cell, j) => (
                      <td key={j} className="px-6 py-4 text-sm font-medium text-foreground/90">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
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
          <h2 key={elements.length} className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6 mt-10 first:mt-0">
            {line.replace('# ', '')}
          </h2>
        );
      }
      // Subheadings
      else if (line.startsWith('## ')) {
        flushSection();
        flushTable();
        flushList();
        elements.push(
          <h3 key={elements.length} className="text-2xl font-bold text-foreground mb-4 mt-8 flex items-center gap-3">
            <span className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full"></span>
            {line.replace('## ', '')}
          </h3>
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
          <li key={`list-${elements.length}-${listItems.length}`} className="text-foreground/80 leading-relaxed ml-6 list-disc marker:text-primary">
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
    <Card className="overflow-hidden border-primary/20 shadow-2xl bg-gradient-to-br from-card via-card to-primary/5 backdrop-blur-sm">
      <CardHeader className="border-b border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 backdrop-blur-sm">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
          Your Personalized Ad Strategy
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 lg:p-10">
        <div className="max-w-none space-y-2">
          {renderContent(strategy.content)}
        </div>
      </CardContent>
    </Card>
  );
};
