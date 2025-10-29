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
      ? `You are a senior business and marketing analyst. Analyze this website in detail:

Website URL: ${websiteUrl}
Website Content: ${websiteContent}
Marketing Goal: ${goal}
Monthly Budget: $${budget}

Provide a comprehensive analysis covering:

1. BUSINESS ANALYSIS (be specific):
   - What exactly does this business offer (products/services)?
   - What is their unique value proposition?
   - What industry/niche do they operate in?
   - What stage of business maturity are they at?

2. TARGET AUDIENCE (be detailed):
   - Who are their ideal customers (demographics, psychographics)?
   - What pain points does this audience have?
   - Where does this audience spend time online?
   - What is their likely buying behavior?

3. COMPETITIVE LANDSCAPE:
   - What type of competition do they likely face?
   - What makes them different from competitors?

4. MARKETING GOAL ALIGNMENT:
   - How does their stated goal (${goal}) align with their business?
   - What specific metrics should success be measured by?
   - What are the likely conversion points?

Be specific, actionable, and avoid generic statements. Base your analysis on the actual content and URL provided.`
      : `You are a senior business and marketing analyst. Based on the limited information available, provide your best analysis:

Website URL: ${websiteUrl}
Marketing Goal: ${goal}
Monthly Budget: $${budget}

Provide a detailed educated analysis covering:

1. BUSINESS INFERENCE (based on URL and goal):
   - What type of business is this likely to be?
   - What products/services might they offer?
   - What value proposition might they have?

2. TARGET AUDIENCE (educated guess):
   - Who would likely be their ideal customers?
   - What demographics and psychographics are probable?
   - Where might this audience be found online?

3. MARKETING APPROACH:
   - Given the goal "${goal}", what strategy makes sense?
   - What channels would be most effective?
   - What should be the primary focus?

Be specific and actionable, even with limited information. Make informed assumptions based on the URL structure and stated goal.`;

    const chatGPTResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          { role: 'system', content: 'You are a senior business and marketing analyst with 15+ years of experience. You provide specific, detailed, and actionable insights based on website analysis. You avoid generic statements and focus on concrete observations and recommendations.' },
          { role: 'user', content: chatGPTPrompt }
        ],
        max_completion_tokens: 2000,
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
