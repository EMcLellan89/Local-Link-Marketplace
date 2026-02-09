import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface Form1099Data {
  '1099_id': string;
  tax_year: number;
  form_type: string;
  total_compensation: number;
  federal_tax_withheld: number;
  state_tax_withheld: number;
  state_id: string;
  partner: {
    id: string;
    name: string;
    email: string;
    business_name: string;
    address: string;
    tax_classification: string;
    ssn_or_ein: string;
  };
  payer: {
    name: string;
    address: string;
    city_state_zip: string;
    phone: string;
    ein: string;
  };
  generated_at: string;
  status: string;
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
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      throw new Error('Admin access required');
    }

    const { form_1099_id } = await req.json();
    if (!form_1099_id) {
      throw new Error('form_1099_id is required');
    }

    const { data: formData, error: dataError } = await supabase
      .rpc('get_1099_data', { p_1099_id: form_1099_id });

    if (dataError) throw dataError;
    if (!formData) throw new Error('1099 form not found');

    const data = formData as Form1099Data;

    const html = generateForm1099HTML(data);

    const pdfResponse = {
      success: true,
      form_1099_id: form_1099_id,
      html: html,
      download_note: 'Print this page or save as PDF using your browser',
    };

    return new Response(
      JSON.stringify(pdfResponse),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error: any) {
    console.error('Error generating 1099 PDF:', error);
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

function generateForm1099HTML(data: Form1099Data): string {
  const maskTaxId = (taxId: string) => {
    if (!taxId) return 'XXX-XX-XXXX';
    if (taxId.length === 9) {
      return `XXX-XX-${taxId.slice(-4)}`;
    }
    if (taxId.length === 11) {
      return `XX-XXX${taxId.slice(-4)}`;
    }
    return taxId;
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Form 1099-NEC - ${data.tax_year}</title>
  <style>
    @page {
      size: 8.5in 11in;
      margin: 0.5in;
    }
    body {
      font-family: 'Courier New', monospace;
      font-size: 10pt;
      line-height: 1.2;
      margin: 0;
      padding: 20px;
    }
    .form-container {
      border: 2px solid black;
      padding: 10px;
      max-width: 8in;
      margin: 0 auto;
    }
    .header {
      border-bottom: 2px solid black;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    .title {
      text-align: center;
      font-size: 14pt;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .subtitle {
      text-align: center;
      font-size: 10pt;
      margin-bottom: 10px;
    }
    .row {
      display: flex;
      margin-bottom: 8px;
    }
    .col {
      flex: 1;
      padding: 5px;
    }
    .col-half {
      flex: 0.5;
    }
    .box {
      border: 1px solid black;
      padding: 8px;
      min-height: 50px;
      position: relative;
    }
    .box-label {
      font-size: 7pt;
      font-weight: bold;
      margin-bottom: 3px;
    }
    .box-value {
      font-size: 11pt;
      font-weight: bold;
    }
    .amount-box {
      background-color: #f0f0f0;
    }
    .amount-box .box-value {
      font-size: 14pt;
      text-align: right;
    }
    .instructions {
      margin-top: 20px;
      font-size: 8pt;
      border-top: 1px solid black;
      padding-top: 10px;
    }
    .copy-label {
      position: absolute;
      top: 5px;
      right: 5px;
      font-size: 8pt;
      font-weight: bold;
      background-color: white;
      padding: 2px 5px;
      border: 1px solid black;
    }
    @media print {
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="no-print" style="text-align: center; margin-bottom: 20px;">
    <button onclick="window.print()" style="padding: 10px 20px; font-size: 14pt; cursor: pointer;">
      Print or Save as PDF
    </button>
  </div>

  <div class="form-container">
    <div class="copy-label">Copy B - For Recipient</div>

    <div class="header">
      <div class="title">1099-NEC</div>
      <div class="subtitle">Nonemployee Compensation</div>
      <div style="text-align: center; font-size: 8pt;">
        Copy B. For Recipient<br>
        This is important tax information and is being furnished to the IRS.<br>
        If you are required to file a return, a negligence penalty or other sanction may be imposed on you<br>
        if this income is taxable and the IRS determines that it has not been reported.
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="box">
          <div class="box-label">PAYER'S name, street address, city or town, state or province, country, ZIP or foreign postal code, and telephone no.</div>
          <div class="box-value">
            ${data.payer.name}<br>
            ${data.payer.address}<br>
            ${data.payer.city_state_zip}<br>
            ${data.payer.phone}
          </div>
        </div>
      </div>
      <div class="col col-half">
        <div class="box">
          <div class="box-label">PAYER'S TIN</div>
          <div class="box-value">${data.payer.ein}</div>
        </div>
        <div class="box" style="margin-top: 8px;">
          <div class="box-label">RECIPIENT'S TIN</div>
          <div class="box-value">${maskTaxId(data.partner.ssn_or_ein)}</div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="box">
          <div class="box-label">RECIPIENT'S name</div>
          <div class="box-value">
            ${data.partner.business_name || data.partner.name}
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="box">
          <div class="box-label">Street address (including apt. no.)</div>
          <div class="box-value">${data.partner.address || 'Address on file'}</div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="box">
          <div class="box-label">City or town, state or province, country, and ZIP or foreign postal code</div>
          <div class="box-value">&nbsp;</div>
        </div>
      </div>
      <div class="col col-half">
        <div class="box">
          <div class="box-label">Account number (see instructions)</div>
          <div class="box-value">${data.partner.id.slice(0, 8)}</div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col col-half">
        <div class="box amount-box">
          <div class="box-label">1. Nonemployee compensation</div>
          <div class="box-value">$ ${data.total_compensation.toFixed(2)}</div>
        </div>
      </div>
      <div class="col col-half">
        <div class="box">
          <div class="box-label">2. Payer made direct sales totaling $5,000 or more of consumer products to recipient for resale</div>
          <div class="box-value" style="text-align: center;">☐</div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col col-half">
        <div class="box">
          <div class="box-label">4. Federal income tax withheld</div>
          <div class="box-value" style="text-align: right;">$ ${data.federal_tax_withheld.toFixed(2)}</div>
        </div>
      </div>
      <div class="col col-half">
        <div class="box">
          <div class="box-label">5. State tax withheld</div>
          <div class="box-value" style="text-align: right;">$ ${data.state_tax_withheld.toFixed(2)}</div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col col-half">
        <div class="box">
          <div class="box-label">6. State/Payer's state no.</div>
          <div class="box-value">${data.state_id || ''}</div>
        </div>
      </div>
      <div class="col col-half">
        <div class="box">
          <div class="box-label">7. State income</div>
          <div class="box-value" style="text-align: right;">$ ${data.total_compensation.toFixed(2)}</div>
        </div>
      </div>
    </div>

    <div class="instructions">
      <strong>Form 1099-NEC</strong> (Rev. January ${data.tax_year})<br>
      Department of the Treasury - Internal Revenue Service<br><br>
      <strong>RECIPIENT'S COPY</strong> - Keep for your records. You may need to include this information when you prepare your tax return.<br><br>
      Box 1 shows nonemployee compensation. If you are in a trade or business, you must generally report this income on Schedule C (Form 1040), Schedule C-EZ (Form 1040), or Schedule F (Form 1040).<br><br>
      Generated on: ${new Date(data.generated_at).toLocaleDateString()}<br>
      Tax Year: ${data.tax_year}
    </div>
  </div>

  <div class="no-print" style="text-align: center; margin-top: 20px;">
    <button onclick="window.print()" style="padding: 10px 20px; font-size: 14pt; cursor: pointer;">
      Print or Save as PDF
    </button>
  </div>
</body>
</html>
  `.trim();
}
