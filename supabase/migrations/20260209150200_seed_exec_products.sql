/*
  # Seed Executive Solutions Products

  1. Products
    - Business Systems Audit
    - Sales Engine
    - Profit Optimization
    - Trust Engine
    - Local Visibility Domination
    - AI Operations Team
    - Compliance & Risk Shield
    - Fractional Growth Team
    - Expansion Playbooks
    - Exit / PE Readiness
*/

INSERT INTO exec_products (product_key, name, description, unit_label, active, job_board_enabled)
VALUES
  (
    'exec_business_systems_audit',
    'Local-Link Business Systems Audit™',
    'Comprehensive audit of your business systems, processes, and CRM setup with actionable recommendations.',
    'audit',
    true,
    true
  ),
  (
    'exec_sales_engine',
    'Local-Link Sales Engine™',
    'Complete sales pipeline build with automated follow-ups, lead nurturing, and booking optimization.',
    'engine',
    true,
    true
  ),
  (
    'exec_profit_optimization',
    'Local-Link Profit Optimization™',
    'Pricing strategy, upsell systems, and profit margin improvement implementation.',
    'system',
    true,
    true
  ),
  (
    'exec_trust_engine',
    'Local-Link Trust Engine™',
    'Review generation, testimonial management, and trust-building asset deployment.',
    'engine',
    true,
    true
  ),
  (
    'exec_local_visibility_domination',
    'Local-Link Local Visibility Domination™',
    'Google Business Profile optimization, citation alignment, and local content strategy.',
    'campaign',
    true,
    true
  ),
  (
    'exec_ai_operations_team',
    'Local-Link AI Operations Team™',
    'AI-powered operations including intake automation, handoff workflows, and escalation management.',
    'team',
    true,
    true
  ),
  (
    'exec_compliance_risk_shield',
    'Local-Link Compliance & Risk Shield™',
    'Consent verification, opt-in compliance, and messaging risk mitigation.',
    'shield',
    true,
    true
  ),
  (
    'exec_fractional_growth_team',
    'Local-Link Fractional Growth Team™',
    'Dedicated fractional team for ongoing growth initiatives and strategic execution.',
    'team',
    true,
    false
  ),
  (
    'exec_expansion_playbooks',
    'Local-Link Expansion Playbooks™',
    'CRM replication and playbook creation for new locations or service lines.',
    'playbook',
    true,
    true
  ),
  (
    'exec_exit_pe_readiness',
    'Local-Link Exit / PE Readiness™',
    'Process documentation, KPI dashboards, and operational readiness for exit or private equity.',
    'package',
    true,
    true
  )
ON CONFLICT (product_key) DO NOTHING;
