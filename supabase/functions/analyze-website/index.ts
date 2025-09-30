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
Analyze the provided website content, budget, and marketing goal to create a data-driven marketing strategy.

Key analysis points:
- Identify the business type, target audience, and value proposition from the website content
- Consider the industry, competition level, and market dynamics
- Factor in the budget constraints and goal timeline
- Recommend channels based on actual business model and audience behavior
- Provide realistic ROAS expectations based on industry benchmarks

Your response must be a valid JSON object with this exact structure:
{
  "channels": [
    {
      "name": "Channel name (e.g., Google Ads, Facebook Ads, etc.)",
      "allocation": percentage as a number (total must equal 100),
      "expectedROAS": expected return as a number,
      "reasoning": "Brief explanation of why this allocation makes sense for this specific business"
    }
  ],
  "overallStrategy": "Comprehensive strategy description tailored to this business",
  "expectedResults": {
    "projectedRevenue": number,
    "projectedROAS": number,
    "timeframe": "e.g., 3 months"
  }
}

Focus on realistic, data-driven recommendations based on the actual website analysis.`;

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
