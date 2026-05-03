import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const MAILCHIMP_API_KEY = Deno.env.get('MAILCHIMP_API_KEY')
const MAILCHIMP_AUDIENCE_ID = 'c010e0be73'
const MAILCHIMP_DC = 'us22'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!MAILCHIMP_API_KEY) {
      throw new Error('MAILCHIMP_API_KEY not configured')
    }

    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'A valid email address is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const response = await fetch(
      `https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`anystring:${MAILCHIMP_API_KEY}`)}`,
        },
        body: JSON.stringify({
          email_address: email,
          status: 'pending',
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      // Member already exists — treat as success
      if (data.title === 'Member Exists') {
        return new Response(
          JSON.stringify({ success: true, message: 'Check your inbox — a confirmation email is on its way!' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      throw new Error(data.detail || data.title || 'Mailchimp error')
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Almost there! Check your inbox to confirm your subscription.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
