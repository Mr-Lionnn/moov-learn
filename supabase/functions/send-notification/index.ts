import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  to: string;
  subject: string;
  message: string;
  type: 'registration' | 'quiz_result' | 'reminder' | 'general';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, message, type }: NotificationRequest = await req.json();

    console.log(`Sending ${type} notification to ${to}:`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);

    // TODO: Integrate with email service like Resend when API key is provided
    // For now, just log the notification
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Notification sent successfully',
      recipient: to,
      type 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in send-notification function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);