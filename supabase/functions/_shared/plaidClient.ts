import { Configuration, PlaidApi, PlaidEnvironments } from "npm:plaid@18.1.0";

export function plaidClient() {
  const configuration = new Configuration({
    basePath: PlaidEnvironments[Deno.env.get("PLAID_ENV") || "sandbox"],
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": Deno.env.get("PLAID_CLIENT_ID")!,
        "PLAID-SECRET": Deno.env.get("PLAID_SECRET")!,
      },
    },
  });

  return new PlaidApi(configuration);
}
