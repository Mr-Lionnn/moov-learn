import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  message: string;
  context?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context }: ChatRequest = await req.json();

    // For now, return a mock response
    // TODO: Integrate with AI service like OpenAI when API key is provided
    const mockResponses = [
      "Je peux vous aider à comprendre ce concept. Pouvez-vous me donner plus de détails?",
      "Excellente question! Laissez-moi vous expliquer cela étape par étape.",
      "Basé sur le contexte du cours, voici ma recommandation...",
      "Cette notion est importante. Voulez-vous que je vous donne des exemples pratiques?"
    ];

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    return new Response(JSON.stringify({ 
      response: randomResponse,
      context: context 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);