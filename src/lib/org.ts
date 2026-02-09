export function getActiveOrgId(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('org_id');
}

export function requireOrgId(): string {
  const orgId = getActiveOrgId();
  if (!orgId) {
    throw new Error('org_id required in URL');
  }
  return orgId;
}
