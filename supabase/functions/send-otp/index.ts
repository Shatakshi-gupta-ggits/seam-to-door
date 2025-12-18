import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, action } = await req.json();

    if (!phone) {
      throw new Error('Phone number is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (action === 'send') {
      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Delete any existing OTPs for this phone
      await supabase
        .from('phone_otps')
        .delete()
        .eq('phone', phone);

      // Store OTP in database
      const { error: insertError } = await supabase
        .from('phone_otps')
        .insert({
          phone,
          otp_code: otpCode,
          expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
        });

      if (insertError) {
        console.error('Error storing OTP:', insertError);
        throw new Error('Failed to generate OTP');
      }

      // Send SMS via Twilio
      const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')!;
      const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')!;
      const twilioPhone = Deno.env.get('TWILIO_PHONE_NUMBER')!;

      const twilioResponse = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: phone,
            From: twilioPhone,
            Body: `Your Mr Finisher verification code is: ${otpCode}. Valid for 5 minutes.`
          })
        }
      );

      if (!twilioResponse.ok) {
        const twilioError = await twilioResponse.text();
        console.error('Twilio error:', twilioError);
        throw new Error('Failed to send SMS');
      }

      console.log('OTP sent successfully to:', phone);
      return new Response(
        JSON.stringify({ success: true, message: 'OTP sent successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'verify') {
      const { otp } = await req.json();
      
      if (!otp) {
        throw new Error('OTP is required');
      }

      // Check OTP
      const { data: otpData, error: selectError } = await supabase
        .from('phone_otps')
        .select('*')
        .eq('phone', phone)
        .eq('otp_code', otp)
        .eq('verified', false)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (selectError) {
        console.error('Error checking OTP:', selectError);
        throw new Error('Failed to verify OTP');
      }

      if (!otpData) {
        return new Response(
          JSON.stringify({ success: false, message: 'Invalid or expired OTP' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Mark OTP as verified
      await supabase
        .from('phone_otps')
        .update({ verified: true })
        .eq('id', otpData.id);

      console.log('OTP verified successfully for:', phone);
      return new Response(
        JSON.stringify({ success: true, message: 'Phone verified successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid action');

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    console.error('Error in send-otp function:', errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
