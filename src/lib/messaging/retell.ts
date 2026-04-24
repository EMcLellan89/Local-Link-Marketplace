type RetellCallParams = {
  toNumber: string;
  agentId: string;
  metadata?: Record<string, unknown>;
};

export async function retellMakeCall(params: RetellCallParams) {
  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey) throw new Error("Missing RETELL_API_KEY");

  const resp = await fetch("https://api.retellai.com/v2/create-phone-call", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to_number: params.toNumber,
      agent_id: params.agentId,
      metadata: params.metadata || {},
    }),
  });

  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(json?.message || `Retell call failed (${resp.status})`);
  return json;
}

export async function retellListCalls(limit = 50) {
  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey) throw new Error("Missing RETELL_API_KEY");

  const resp = await fetch(`https://api.retellai.com/v2/list-calls?limit=${limit}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(json?.message || `Retell list calls failed (${resp.status})`);
  return json;
}
