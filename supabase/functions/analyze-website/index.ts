import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

    if (!LOVABLE_API_KEY || !OPENAI_API_KEY) {
      throw new Error('API keys are not configured');
    }

    console.log('Analyzing website:', websiteUrl, 'Budget:', budget, 'Goal:', goal);

    // Step 1: Fetch website content
    let websiteContent = '';
    try {
      const url = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
      const websiteResponse = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        signal: AbortSignal.timeout(5000)
      });
      
      if (websiteResponse.ok) {
        const html = await websiteResponse.text();
        websiteContent = html
          .replace(/<script[^>]*>.*?<\/script>/gis, '')
          .replace(/<style[^>]*>.*?<\/style>/gis, '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 3000);
      }
    } catch (error) {
      console.log('Failed to fetch website content:', error);
    }

    // Step 2: Use ChatGPT to analyze website content and goal
    console.log('Step 1: ChatGPT analyzing website and goal...');
    const chatGPTPrompt = websiteContent 
      ? `Analyze this website and marketing goal. Website URL: ${websiteUrl}, Content: ${websiteContent}. Marketing Goal: ${goal}. Budget: $${budget}/month. Provide a detailed analysis of: 1) What the business does and its value proposition, 2) Target audience, 3) Key selling points, 4) How this relates to the marketing goal. Be concise but thorough.`
      : `Analyze this marketing scenario. Website URL: ${websiteUrl}, Marketing Goal: ${goal}, Budget: $${budget}/month. Based on the URL and goal, provide analysis of likely business type, target audience, and marketing approach.`;

    const chatGPTResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          { role: 'system', content: 'You are a business analyst specializing in understanding websites and marketing goals.' },
          { role: 'user', content: chatGPTPrompt }
        ],
        max_completion_tokens: 1000,
      }),
    });

    if (!chatGPTResponse.ok) {
      const errorText = await chatGPTResponse.text();
      console.error('ChatGPT API Error:', chatGPTResponse.status, errorText);
      throw new Error(`ChatGPT API request failed: ${chatGPTResponse.status}`);
    }

    const chatGPTData = await chatGPTResponse.json();
    const websiteAnalysis = chatGPTData.choices[0].message.content;
    console.log('ChatGPT Analysis:', websiteAnalysis);

    // Step 3: Use Gemini to create full marketing strategy based on ChatGPT's analysis
    console.log('Step 2: Gemini creating marketing strategy...');
    const geminiSystemPrompt = `You are a marketing strategist. Based on the website analysis provided, create a comprehensive JSON marketing strategy with: websiteAnalysis (STRING - use the provided analysis), strategicApproach (STRING), channels array with each channel having: name (STRING), allocation (NUMBER), percentage (NUMBER), strategy (STRING), predictedMetrics object with ALL fields: dailyBudget (NUMBER), averageCPC (NUMBER), clicks (NUMBER), conversionRate (NUMBER), conversions (NUMBER), costPerAcquisition (NUMBER). Also include totalPredictedResults with: totalClicks (NUMBER), totalConversions (NUMBER), blendedCPA (NUMBER), summary (STRING). IMPORTANT: All numeric fields must have actual numbers, never null or undefined.`;

    const geminiUserPrompt = `Website & Goal Analysis from our analyst:\n${websiteAnalysis}\n\nBudget: $${budget}/month\nMarketing Goal: ${goal}\n\nBased on this analysis, create a detailed marketing strategy with budget allocation and predicted metrics.`;

    const geminiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: geminiSystemPrompt },
          { role: 'user', content: geminiUserPrompt }
        ],
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API Error:', geminiResponse.status, errorText);
      throw new Error(`Gemini API request failed: ${geminiResponse.status}`);
    }

    // Stream the Gemini response back to client
    return new Response(geminiResponse.body, {
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
