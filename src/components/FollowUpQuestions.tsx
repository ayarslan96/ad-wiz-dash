import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Send } from "lucide-react";

interface FollowUpQuestionsProps {
  strategy: any;
}

export const FollowUpQuestions = ({ strategy }: FollowUpQuestionsProps) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast({
        title: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to ask questions",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('answer-followup', {
        body: { question, strategy }
      });

      if (error) throw error;

      setAnswer(data.answer);
      setQuestion("");
    } catch (error: any) {
      console.error('Error asking follow-up question:', error);
      toast({
        title: "Failed to get answer",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ask Follow-up Questions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Ask anything about your marketing strategy..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            disabled={loading}
          />
          <Button 
            onClick={handleAskQuestion} 
            disabled={loading || !question.trim()}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Ask Question
              </>
            )}
          </Button>
        </div>

        {answer && (
          <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-card/50 to-card border border-border/50 backdrop-blur-sm">
            <p className="text-base leading-relaxed whitespace-pre-wrap">{answer}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
