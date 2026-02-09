/*
  # Add High-Risk Merchant Application Fields

  ## Overview
  Extends the merchant_applications table with comprehensive fields required for high-risk merchant accounts.
  These fields enable enhanced due diligence, risk assessment, and compliance verification.

  ## New Columns Added

  ### Financial Documentation
  - `bank_statements_urls` - URLs to 3-6 months of bank statements
  - `processing_statements_urls` - URLs to current processor statements
  - `personal_credit_score` - Self-disclosed credit score
  - `reserve_agreement_accepted` - Acknowledgment of reserve requirements
  - `financial_statements_urls` - URLs to business financial statements

  ### Enhanced Due Diligence
  - `voided_check_url` - URL to uploaded voided check for bank verification
  - `incorporation_docs_urls` - Articles of incorporation/business registration docs
  - `personal_financial_statements_urls` - Personal financial statements for 25%+ owners
  - `background_check_authorized` - Authorization for criminal background check

  ### High-Risk Specific
  - `chargeback_mitigation_plan` - Written strategy for preventing chargebacks
  - `customer_service_response_time` - Committed response time
  - `dispute_resolution_procedures` - Detailed procedures for handling disputes
  - `refund_policy_text` - Full refund/return policy
  - `cancellation_policy_text` - Cancellation policy for subscriptions
  - `marketing_channels` - Advertising and marketing methods used

  ### Security & Fraud Prevention
  - `ssl_certificate_info` - SSL certificate details
  - `fraud_prevention_tools` - Current fraud prevention tools in use
  - `three_d_secure_enabled` - 3D Secure implementation status
  - `avs_enabled` - Address Verification System usage
  - `cvv_verification_required` - CVV verification requirements

  ### Insurance & Liability
  - `general_liability_insurance` - General liability insurance details (JSONB)
  - `product_liability_insurance` - Product liability coverage (JSONB)
  - `professional_liability_insurance` - Professional liability/E&O coverage (JSONB)

  ### Industry-Specific
  - `state_licenses` - State-specific licenses and permits (JSONB array)
  - `fda_registration_number` - FDA registration (if applicable)
  - `lab_testing_certificates_urls` - Lab testing certificates for products
  - `age_verification_procedures` - Age verification process description
  - `product_composition_disclosure` - Product ingredients/composition

  ### Business Validation
  - `social_media_profiles` - Social media presence (JSONB)
  - `bbb_rating` - Better Business Bureau rating
  - `trade_references` - Vendor/supplier references (JSONB array)
  - `customer_testimonials_urls` - URLs to testimonials or reviews

  ## Security
  - All new columns are optional to maintain backward compatibility
  - Existing RLS policies continue to apply
*/

-- Add Financial Documentation fields
ALTER TABLE merchant_applications
ADD COLUMN IF NOT EXISTS bank_statements_urls text[],
ADD COLUMN IF NOT EXISTS processing_statements_urls text[],
ADD COLUMN IF NOT EXISTS personal_credit_score integer,
ADD COLUMN IF NOT EXISTS reserve_agreement_accepted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS financial_statements_urls text[];

-- Add Enhanced Due Diligence fields
ALTER TABLE merchant_applications
ADD COLUMN IF NOT EXISTS voided_check_url text,
ADD COLUMN IF NOT EXISTS incorporation_docs_urls text[],
ADD COLUMN IF NOT EXISTS personal_financial_statements_urls text[],
ADD COLUMN IF NOT EXISTS background_check_authorized boolean DEFAULT false;

-- Add High-Risk Specific fields
ALTER TABLE merchant_applications
ADD COLUMN IF NOT EXISTS chargeback_mitigation_plan text,
ADD COLUMN IF NOT EXISTS customer_service_response_time text,
ADD COLUMN IF NOT EXISTS dispute_resolution_procedures text,
ADD COLUMN IF NOT EXISTS refund_policy_text text,
ADD COLUMN IF NOT EXISTS cancellation_policy_text text,
ADD COLUMN IF NOT EXISTS marketing_channels text;

-- Add Security & Fraud Prevention fields
ALTER TABLE merchant_applications
ADD COLUMN IF NOT EXISTS ssl_certificate_info text,
ADD COLUMN IF NOT EXISTS fraud_prevention_tools text,
ADD COLUMN IF NOT EXISTS three_d_secure_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS avs_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS cvv_verification_required boolean DEFAULT false;

-- Add Insurance & Liability fields (stored as JSONB for flexibility)
ALTER TABLE merchant_applications
ADD COLUMN IF NOT EXISTS general_liability_insurance jsonb,
ADD COLUMN IF NOT EXISTS product_liability_insurance jsonb,
ADD COLUMN IF NOT EXISTS professional_liability_insurance jsonb;

-- Add Industry-Specific fields
ALTER TABLE merchant_applications
ADD COLUMN IF NOT EXISTS state_licenses jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS fda_registration_number text,
ADD COLUMN IF NOT EXISTS lab_testing_certificates_urls text[],
ADD COLUMN IF NOT EXISTS age_verification_procedures text,
ADD COLUMN IF NOT EXISTS product_composition_disclosure text;

-- Add Business Validation fields
ALTER TABLE merchant_applications
ADD COLUMN IF NOT EXISTS social_media_profiles jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS bbb_rating text,
ADD COLUMN IF NOT EXISTS trade_references jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS customer_testimonials_urls text[];

-- Create indexes for commonly queried high-risk fields
CREATE INDEX IF NOT EXISTS idx_merchant_applications_background_check ON merchant_applications(background_check_authorized)
  WHERE is_high_risk = true;
CREATE INDEX IF NOT EXISTS idx_merchant_applications_three_d_secure ON merchant_applications(three_d_secure_enabled)
  WHERE is_high_risk = true;

-- Add helpful comments
COMMENT ON COLUMN merchant_applications.bank_statements_urls IS 'URLs to 3-6 months of business bank statements';
COMMENT ON COLUMN merchant_applications.chargeback_mitigation_plan IS 'Written strategy for preventing and managing chargebacks';
COMMENT ON COLUMN merchant_applications.trade_references IS 'Array of vendor/supplier references with contact information';
COMMENT ON COLUMN merchant_applications.general_liability_insurance IS 'Insurance details: {provider, policy_number, amount, expiration_date}';
