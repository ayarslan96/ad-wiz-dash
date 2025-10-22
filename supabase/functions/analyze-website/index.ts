import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { websiteUrl, budget, goal } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing website:', websiteUrl, 'Budget:', budget, 'Goal:', goal);

    // Fetch website content for analysis
    let websiteContent = '';
    try {
      // Ensure URL has protocol
      const url = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
      const websiteResponse = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      if (websiteResponse.ok) {
        const html = await websiteResponse.text();
        websiteContent = html
          .replace(/<script[^>]*>.*?<\/script>/gis, '')
          .replace(/<style[^>]*>.*?<\/style>/gis, '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 2000); // Reduced content length
      }
    } catch (error) {
      console.log('Failed to fetch website content:', error);
      websiteContent = '';
    }

    const systemPrompt = `You are a marketing strategist. Create a JSON strategy with: websiteAnalysis (STRING text analysis), strategicApproach (STRING text), channels array (each with: name, allocation, percentage, strategy (STRING), predictedMetrics object), totalPredictedResults (totalClicks, totalConversions, blendedCPA, summary STRING). All text fields must be plain strings, not objects.`;

    const userPrompt = websiteContent 
      ? `URL: ${websiteUrl}, Budget: $${budget}, Goal: ${goal}. Content: ${websiteContent}. Provide marketing strategy.`
      : `URL: ${websiteUrl}, Budget: $${budget}, Goal: ${goal}. Provide marketing strategy based on URL and goal.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', response.status, errorText);
      throw new Error(`AI API request failed: ${response.status}`);
    }

    // Stream the response back to client
    return new Response(response.body, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      },
    });
  } catch (error) {
    console.error('Error in analyze-website function:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
