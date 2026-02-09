import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface RequestBody {
  promptId?: string;
  prompt?: string;
  input?: Record<string, unknown>;
  merchant_id?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiKey = Deno.env.get('OPENAI_API_KEY')!;

    const supabase = createClient(supabaseUrl, serviceKey);

    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = userData.user.id;
    const body = (await req.json()) as RequestBody;

    let rendered = '';
    let promptId = body.promptId || null;

    if (body.prompt) {
      rendered = body.prompt;
    } else if (body.promptId) {
      const { data: prompt, error: promptErr } = await supabase
        .from('prompts')
        .select('id,title,prompt_template,is_active')
        .eq('id', body.promptId)
        .single();

      if (promptErr || !prompt || !prompt.is_active) {
        return new Response(JSON.stringify({ error: 'Prompt not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: creditBalance } = await supabase.rpc('get_my_credit_balance');
      const credits = Number(creditBalance ?? 0);
      if (credits <= 0) {
        return new Response(JSON.stringify({ error: 'No credits available' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      rendered = prompt.prompt_template;
      for (const [k, v] of Object.entries(body.input ?? {})) {
        rendered = rendered.replaceAll(`{{${k}}}`, String(v));
      }
    } else {
      return new Response(JSON.stringify({ error: 'Either prompt or promptId required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiResp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an assistant that outputs concise, ready-to-use marketing assets for local businesses.' },
          { role: 'user', content: rendered }
        ],
        temperature: 0.7,
      })
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      return new Response(JSON.stringify({ error: 'AI error', details: errText }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiJson = await aiResp.json();
    const output = aiJson.choices?.[0]?.message?.content ?? '';
    const tokensUsed = aiJson.usage?.total_tokens ?? 0;

    if (promptId) {
      await supabase.from('credit_ledger').insert({
        user_id: userId,
        delta: -1,
        reason: 'prompt_run',
        metadata: { promptId, tokensUsed }
      });

      await supabase.from('prompt_runs').insert({
        user_id: userId,
        prompt_id: promptId,
        input: body.input,
        output,
        tokens_used: tokensUsed,
        credits_used: 1
      });
    }

    return new Response(JSON.stringify({ response: output, output, tokensUsed }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Server error', details: String(e) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
