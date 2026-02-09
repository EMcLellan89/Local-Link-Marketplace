export async function openaiCategorize(
  transactionName: string,
  amount: number,
  chartOfAccounts: Array<{ id: string; name: string; type: string }>
): Promise<{ coa_id: string; confidence: number }> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  const model = Deno.env.get("OPENAI_MODEL") || "gpt-4o-mini";

  const categories = chartOfAccounts
    .map((c) => `${c.id}: ${c.name} (${c.type})`)
    .join("\n");

  const prompt = `Categorize this business transaction:
Transaction: "${transactionName}"
Amount: $${Math.abs(amount)}

Available categories:
${categories}

Respond with ONLY a JSON object: {"coa_id": "uuid", "confidence": 0.0-1.0}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a bookkeeping AI. Categorize transactions accurately. Always respond with valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 100,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("No response from OpenAI");
  }

  const result = JSON.parse(content);
  return result;
}
