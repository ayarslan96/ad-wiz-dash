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
      const websiteResponse = await fetch(websiteUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (websiteResponse.ok) {
        const html = await websiteResponse.text();
        // Extract text content from HTML (basic extraction)
        websiteContent = html
          .replace(/<script[^>]*>.*?<\/script>/gis, '')
          .replace(/<style[^>]*>.*?<\/style>/gis, '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 3000); // Limit content length
      }
    } catch (error) {
      console.log('Failed to fetch website content:', error);
      websiteContent = 'Website content could not be fetched for analysis.';
    }

    const systemPrompt = `You are an expert marketing strategist specializing in digital advertising and ROAS optimization. 
Analyze the provided website content, budget, and marketing goal to create a comprehensive, data-driven marketing strategy.

Your response must be a valid JSON object with this exact structure:
{
  "websiteAnalysis": "Detailed analysis of what the website/business does, its value proposition, and target audience",
  "strategicApproach": "Explanation of why this budget allocation strategy makes sense for this specific business and goal",
  "channels": [
    {
      "name": "Channel name (e.g., Google Search Ads, X (Twitter) Ads, etc.)",
      "allocation": dollar amount as a number,
      "percentage": percentage as a number,
      "strategy": "Detailed campaign strategy including targeting, ad creative approach, and tactics",
      "predictedMetrics": {
        "dailyBudget": number,
        "averageCPC": "range as string (e.g., $4.00 - $7.00)",
        "clicks": "range as string (e.g., 25 - 44)",
        "conversionRate": "percentage as string (e.g., ~7.0%)",
        "conversions": "range as string (e.g., 2 - 3)",
        "costPerAcquisition": "range as string (e.g., $58 - $88)"
      }
    }
  ],
  "totalPredictedResults": {
    "totalClicks": "range as string",
    "totalConversions": "range as string",
    "blendedCPA": "range as string",
    "summary": "Brief summary of expected outcomes"
  }
}

Requirements:
- Focus on 1-2 high-intent channels that match the budget and goal
- Provide realistic, data-driven predictions based on industry benchmarks
- Include specific targeting strategies and ad creative recommendations
- Calculate precise metrics including CPC, conversion rates, and CPA
- Ensure all budget allocations add up to the total budget provided`;

    const userPrompt = `Website URL: ${websiteUrl}
Monthly Budget: $${budget}
Marketing Goal: ${goal}

Website Content Analysis:
${websiteContent}

Based on the actual website content above, provide a detailed marketing strategy with budget allocation across the most effective channels for this specific business. Consider the business model, target audience, and value proposition evident from the website content.`;

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
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', response.status, errorText);
      throw new Error(`AI API request failed: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    console.log('AI Response:', aiResponse);

    // Parse the JSON response
    let strategy;
    try {
      // Try to extract JSON if it's wrapped in markdown code blocks
      const jsonMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiResponse;
      strategy = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('AI Response was:', aiResponse);
      throw new Error('Failed to parse AI response as JSON');
    }

    return new Response(
      JSON.stringify({ strategy }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
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
