
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.2.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    // Create the storage bucket for testimonial media if it doesn't exist yet
    const { data: buckets, error: bucketsError } = await supabaseClient
      .storage
      .listBuckets();
    
    if (bucketsError) throw bucketsError;

    const bucketExists = buckets.some(bucket => bucket.name === 'testimonial-media');
    
    if (!bucketExists) {
      const { data, error } = await supabaseClient
        .storage
        .createBucket('testimonial-media', {
          public: true,
          fileSizeLimit: 52428800, // 50MB
          allowedMimeTypes: [
            'audio/webm',
            'video/webm'
          ]
        });
        
      if (error) throw error;
      
      // Set bucket policy to public
      const { error: policyError } = await supabaseClient
        .storage
        .from('testimonial-media')
        .createSignedUrl('dummy', 1); // This will create the bucket if it doesn't exist
      
      if (policyError && !policyError.message.includes('not found')) throw policyError;
    }

    return new Response(
      JSON.stringify({ message: "Testimonial media storage bucket configured" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
