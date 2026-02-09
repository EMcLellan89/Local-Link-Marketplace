import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get slug from URL
    const url = new URL(req.url);
    const slug = url.pathname.split('/').pop();

    if (!slug) {
      return new Response(
        JSON.stringify({ error: 'Product slug is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch product
    const { data: product, error: productError } = await supabase
      .from('dfy_products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (productError || !product) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch add-ons
    const { data: addons, error: addonsError } = await supabase
      .from('dfy_addons')
      .select('*')
      .eq('product_id', product.id)
      .eq('is_active', true);

    if (addonsError) {
      throw addonsError;
    }

    // Format response
    const response = {
      product: {
        id: product.id,
        slug: product.slug,
        name: product.name,
        category_key: product.category,
        short_value_prop: product.short_value_prop,
        long_description: product.long_description,
        setup_sla_hours: product.setup_sla_hours,
        outcomes: product.outcomes || [],
        includes: product.includes || [],
        faq: product.faq || [],
      },
      pricing: {
        setup_usd: product.setup_price_cents / 100,
        monthly_usd: product.monthly_price_cents / 100,
        addons: (addons || []).map((a: any) => ({
          id: a.id,
          code: a.code,
          name: a.name,
          description: a.description,
          price_usd: a.price_cents / 100,
          is_recurring: a.is_recurring,
        })),
      },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Error fetching DFY product detail:', error);

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
