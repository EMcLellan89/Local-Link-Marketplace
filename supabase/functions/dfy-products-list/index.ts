import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const categories = [
  { key: 'lead_capture', name: 'AI Lead Capture & Conversion', description: 'Capture and convert leads automatically.' },
  { key: 'funnels', name: 'AI Funnels & Sales Automation', description: 'Turn clicks into booked jobs on autopilot.' },
  { key: 'reviews', name: 'AI Reviews & Reputation', description: 'More 5-star reviews with protection built in.' },
  { key: 'visibility', name: 'AI Visibility & Content', description: 'Stay visible everywhere without doing content work.' },
  { key: 'operations', name: 'AI Operations & Retention', description: 'Reduce churn and improve workflow automatically.' },
];

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch active products
    const { data: products, error } = await supabase
      .from('dfy_products')
      .select('id, slug, name, category, short_value_prop, setup_price_cents, monthly_price_cents, setup_sla_hours')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    // Format response
    const formattedProducts = (products || []).map((p: any) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category_key: p.category,
      short_value_prop: p.short_value_prop,
      setup_sla_hours: p.setup_sla_hours,
      pricing_preview: {
        setup_usd: p.setup_price_cents / 100,
        monthly_usd: p.monthly_price_cents / 100,
      },
    }));

    return new Response(
      JSON.stringify({
        categories,
        products: formattedProducts,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching DFY products:', error);

    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
