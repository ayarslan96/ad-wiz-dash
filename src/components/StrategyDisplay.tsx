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
            <p key={elements.length} className="text-muted-foreground leading-relaxed mb-4">
              {parts.map((part, i) => 
                i % 2 === 1 ? <strong key={i} className="font-semibold text-foreground">{part}</strong> : part
              )}
            </p>
          );
        } else {
          elements.push(
            <p key={elements.length} className="text-muted-foreground leading-relaxed mb-4">
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
          <ul key={elements.length} className="space-y-2 mb-4">
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
          <div key={elements.length} className="overflow-x-auto mb-6 rounded-xl border border-border/50">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  {tableHeaders.map((header, i) => (
                    <th key={i} className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {tableRows.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-3 text-sm text-muted-foreground">
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
          <h2 key={elements.length} className="text-2xl font-bold text-foreground mb-4 mt-8 first:mt-0">
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
          <h3 key={elements.length} className="text-xl font-semibold text-foreground mb-3 mt-6">
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
          <h4 key={elements.length} className="text-lg font-semibold text-foreground mb-2 mt-4">
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
          <li key={`list-${elements.length}-${listItems.length}`} className="text-muted-foreground leading-relaxed ml-6 list-disc">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i} className="font-semibold text-foreground">{part}</strong> : part
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
    <Card className="overflow-hidden border-border/50 shadow-xl bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
      <CardHeader className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Your Personalized Ad Strategy
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="prose prose-sm max-w-none">
          {renderContent(strategy.content)}
        </div>
      </CardContent>
    </Card>
  );
};
