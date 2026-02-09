import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle2, Building2, MapPin, User, Users, CreditCard, Package, DollarSign, History, ShieldAlert, FileCheck, FileSignature } from 'lucide-react';
import BackButton from '../../components/ui/BackButton';

interface Owner {
  firstName: string;
  lastName: string;
  title: string;
  ownershipPercentage: number;
  ssn: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface Equipment {
  type: string;
  model: string;
  quantity: number;
}

export default function MerchantApplicationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState('');

  const [formData, setFormData] = useState({
    legalBusinessName: '',
    dbaName: '',
    businessType: '',
    taxId: '',
    businessStartDate: '',
    industryCategory: '',
    businessModel: '',
    businessAddress: '',
    businessCity: '',
    businessState: '',
    businessZip: '',
    businessPhone: '',
    businessEmail: '',
    websiteUrl: '',
    contactFirstName: '',
    contactLastName: '',
    contactTitle: '',
    contactPhone: '',
    contactEmail: '',
    owners: [] as Owner[],
    bankName: '',
    bankRoutingNumber: '',
    bankAccountNumber: '',
    bankAccountType: 'checking',
    monthlyVolume: '',
    averageTicket: '',
    highestTicket: '',
    creditCardSalesPercentage: '',
    ecommercePercentage: '',
    cardPresentPercentage: '',
    acceptsAmex: false,
    acceptsDiscover: false,
    acceptsPinDebit: false,
    acceptsEbt: false,
    pricingStructure: '',
    processor: '',
    ratePercentage: '2.99',
    transactionFee: '0.30',
    gateway: '',
    onlineAccessFee: '',
    upgradeFee: '',
    equipmentTotal: '',
    equipment: [] as Equipment[],
    yearsProcessing: '',
    currentProcessor: '',
    previousProcessor: '',
    previousAccountTerminated: false,
    terminationReason: '',
    isHighRisk: false,
    averageChargebackRate: '',
    averageRefundRate: '',
    fulfillmentTimeframe: '',
    deliveryTimeframe: '',
    recurringBilling: false,
    seasonalBusiness: false,
    acceptsInternationalPayments: false,
    advanceDeposits: false,
    inventorySource: '',
    deliveryMethod: '',
    businessLicenseNumber: '',
    professionalLicenseNumber: '',
    mccCode: '',
    privacyPolicyUrl: '',
    termsOfServiceUrl: '',
    termsAccepted: false,
    signatureName: '',
    personalCreditScore: '',
    reserveAgreementAccepted: false,
    backgroundCheckAuthorized: false,
    chargebackMitigationPlan: '',
    customerServiceResponseTime: '',
    disputeResolutionProcedures: '',
    refundPolicyText: '',
    cancellationPolicyText: '',
    marketingChannels: '',
    sslCertificateInfo: '',
    fraudPreventionTools: '',
    threeDSecureEnabled: false,
    avsEnabled: false,
    cvvVerificationRequired: false,
    generalLiabilityProvider: '',
    generalLiabilityPolicyNumber: '',
    generalLiabilityAmount: '',
    generalLiabilityExpiration: '',
    productLiabilityProvider: '',
    productLiabilityPolicyNumber: '',
    productLiabilityAmount: '',
    productLiabilityExpiration: '',
    professionalLiabilityProvider: '',
    professionalLiabilityPolicyNumber: '',
    professionalLiabilityAmount: '',
    professionalLiabilityExpiration: '',
    fdaRegistrationNumber: '',
    ageVerificationProcedures: '',
    productCompositionDisclosure: '',
    socialMediaFacebook: '',
    socialMediaInstagram: '',
    socialMediaTwitter: '',
    socialMediaLinkedIn: '',
    bbbRating: '',
  });

  const totalSteps = 12;

  const steps = [
    { number: 1, name: 'Business Info', icon: Building2 },
    { number: 2, name: 'Address', icon: MapPin },
    { number: 3, name: 'Contact', icon: User },
    { number: 4, name: 'Ownership', icon: Users },
    { number: 5, name: 'Banking', icon: CreditCard },
    { number: 6, name: 'Processing', icon: DollarSign },
    { number: 7, name: 'Equipment', icon: Package },
    { number: 8, name: 'Pricing', icon: DollarSign },
    { number: 9, name: 'History', icon: History },
    { number: 10, name: 'Risk', icon: ShieldAlert },
    { number: 11, name: 'Compliance', icon: FileCheck },
    { number: 12, name: 'Signature', icon: FileSignature },
  ];

  const equipmentOptions = {
    Clover: [
      { model: 'Clover Go' },
      { model: 'Clover Flex' },
      { model: 'Clover Mini' },
      { model: 'Clover Station' },
    ],
    'First Data': [
      { model: 'FD150' },
      { model: 'RP10' },
    ],
    Dejavoo: [
      { model: 'P1' },
      { model: 'P5' },
      { model: 'P8' },
    ],
    'Swipe Simple': [
      { model: 'B250' },
    ],
  };

  useEffect(() => {
    const fetchMerchantData = async () => {
      if (!user?.id) return;

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();

        const { data: merchant } = await supabase
          .from('merchants')
          .select('business_name, business_address, business_city, business_state, business_zip, business_phone, website_url')
          .eq('user_id', user.id)
          .maybeSingle();

        if (merchant || profile) {
          const nameParts = profile?.full_name?.split(' ') || [];
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          setFormData(prev => ({
            ...prev,
            legalBusinessName: merchant?.business_name || '',
            dbaName: merchant?.business_name || '',
            businessAddress: merchant?.business_address || '',
            businessCity: merchant?.business_city || '',
            businessState: merchant?.business_state || '',
            businessZip: merchant?.business_zip || '',
            businessPhone: merchant?.business_phone || '',
            businessEmail: user?.email || '',
            websiteUrl: merchant?.website_url || '',
            contactFirstName: firstName,
            contactLastName: lastName,
            contactPhone: merchant?.business_phone || '',
            contactEmail: user?.email || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching merchant data:', error);
      }
    };

    fetchMerchantData();
  }, [user?.id]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const addOwner = () => {
    setFormData({
      ...formData,
      owners: [
        ...formData.owners,
        {
          firstName: '',
          lastName: '',
          title: '',
          ownershipPercentage: 0,
          ssn: '',
          dateOfBirth: '',
          address: '',
          city: '',
          state: '',
          zip: '',
        },
      ],
    });
  };

  const updateOwner = (index: number, field: keyof Owner, value: string | number) => {
    const updatedOwners = [...formData.owners];
    updatedOwners[index] = { ...updatedOwners[index], [field]: value };
    setFormData({ ...formData, owners: updatedOwners });
  };

  const removeOwner = (index: number) => {
    const updatedOwners = formData.owners.filter((_, i) => i !== index);
    setFormData({ ...formData, owners: updatedOwners });
  };

  const addEquipment = (type: string, model: string) => {
    const existing = formData.equipment.find(e => e.type === type && e.model === model);
    if (existing) {
      const updated = formData.equipment.map(e =>
        e.type === type && e.model === model
          ? { ...e, quantity: e.quantity + 1 }
          : e
      );
      setFormData({ ...formData, equipment: updated });
    } else {
      setFormData({
        ...formData,
        equipment: [...formData.equipment, { type, model, quantity: 1 }],
      });
    }
  };

  const removeEquipment = (type: string, model: string) => {
    const updated = formData.equipment.filter(e => !(e.type === type && e.model === model));
    setFormData({ ...formData, equipment: updated });
  };

  const updateEquipmentQuantity = (type: string, model: string, quantity: number) => {
    const updated = formData.equipment.map(e =>
      e.type === type && e.model === model
        ? { ...e, quantity: Math.max(1, quantity) }
        : e
    );
    setFormData({ ...formData, equipment: updated });
  };

  const handleSubmit = async () => {
    if (!formData.termsAccepted) {
      alert('Please accept the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      const appNumber = `MPA-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

      const { data: application, error: appError } = await supabase
        .from('merchant_applications')
        .insert({
          application_number: appNumber,
          legal_business_name: formData.legalBusinessName,
          dba_name: formData.dbaName,
          business_type: formData.businessType,
          tax_id: formData.taxId,
          business_start_date: formData.businessStartDate || null,
          industry_category: formData.industryCategory,
          business_model: formData.businessModel,
          business_address: formData.businessAddress,
          business_city: formData.businessCity,
          business_state: formData.businessState,
          business_zip: formData.businessZip,
          business_phone: formData.businessPhone,
          business_email: formData.businessEmail,
          website_url: formData.websiteUrl,
          contact_first_name: formData.contactFirstName,
          contact_last_name: formData.contactLastName,
          contact_title: formData.contactTitle,
          contact_phone: formData.contactPhone,
          contact_email: formData.contactEmail,
          owners: formData.owners,
          bank_name: formData.bankName,
          bank_routing_number: formData.bankRoutingNumber,
          bank_account_number: formData.bankAccountNumber,
          bank_account_type: formData.bankAccountType,
          monthly_volume: parseFloat(formData.monthlyVolume) || null,
          average_ticket: parseFloat(formData.averageTicket) || null,
          highest_ticket: parseFloat(formData.highestTicket) || null,
          credit_card_sales_percentage: parseInt(formData.creditCardSalesPercentage) || null,
          ecommerce_percentage: parseInt(formData.ecommercePercentage) || null,
          card_present_percentage: parseInt(formData.cardPresentPercentage) || null,
          accepts_amex: formData.acceptsAmex,
          accepts_discover: formData.acceptsDiscover,
          accepts_pin_debit: formData.acceptsPinDebit,
          accepts_ebt: formData.acceptsEbt,
          pricing_structure: formData.pricingStructure,
          processor: formData.processor,
          rate_percentage: parseFloat(formData.ratePercentage) || null,
          transaction_fee: parseFloat(formData.transactionFee) || null,
          gateway: formData.gateway,
          online_access_fee: parseFloat(formData.onlineAccessFee) || null,
          upgrade_fee: parseFloat(formData.upgradeFee) || null,
          equipment_total: parseFloat(formData.equipmentTotal) || null,
          years_processing: parseInt(formData.yearsProcessing) || null,
          current_processor: formData.currentProcessor,
          previous_processor: formData.previousProcessor,
          previous_account_terminated: formData.previousAccountTerminated,
          termination_reason: formData.terminationReason,
          is_high_risk: formData.isHighRisk,
          average_chargeback_rate: parseFloat(formData.averageChargebackRate) || null,
          average_refund_rate: parseFloat(formData.averageRefundRate) || null,
          fulfillment_timeframe: formData.fulfillmentTimeframe,
          delivery_timeframe: formData.deliveryTimeframe,
          recurring_billing: formData.recurringBilling,
          seasonal_business: formData.seasonalBusiness,
          accepts_international_payments: formData.acceptsInternationalPayments,
          advance_deposits: formData.advanceDeposits,
          inventory_source: formData.inventorySource,
          delivery_method: formData.deliveryMethod,
          business_license_number: formData.businessLicenseNumber,
          professional_license_number: formData.professionalLicenseNumber,
          mcc_code: formData.mccCode,
          privacy_policy_url: formData.privacyPolicyUrl,
          terms_of_service_url: formData.termsOfServiceUrl,
          terms_accepted: formData.termsAccepted,
          signature_name: formData.signatureName,
          signature_date: new Date().toISOString().split('T')[0],
          email: user?.email || formData.businessEmail,
          status: 'pending',
          personal_credit_score: formData.personalCreditScore ? parseInt(formData.personalCreditScore) : null,
          reserve_agreement_accepted: formData.reserveAgreementAccepted,
          background_check_authorized: formData.backgroundCheckAuthorized,
          chargeback_mitigation_plan: formData.chargebackMitigationPlan,
          customer_service_response_time: formData.customerServiceResponseTime,
          dispute_resolution_procedures: formData.disputeResolutionProcedures,
          refund_policy_text: formData.refundPolicyText,
          cancellation_policy_text: formData.cancellationPolicyText,
          marketing_channels: formData.marketingChannels,
          ssl_certificate_info: formData.sslCertificateInfo,
          fraud_prevention_tools: formData.fraudPreventionTools,
          three_d_secure_enabled: formData.threeDSecureEnabled,
          avs_enabled: formData.avsEnabled,
          cvv_verification_required: formData.cvvVerificationRequired,
          general_liability_insurance: formData.generalLiabilityProvider ? {
            provider: formData.generalLiabilityProvider,
            policy_number: formData.generalLiabilityPolicyNumber,
            amount: formData.generalLiabilityAmount,
            expiration_date: formData.generalLiabilityExpiration
          } : null,
          product_liability_insurance: formData.productLiabilityProvider ? {
            provider: formData.productLiabilityProvider,
            policy_number: formData.productLiabilityPolicyNumber,
            amount: formData.productLiabilityAmount,
            expiration_date: formData.productLiabilityExpiration
          } : null,
          professional_liability_insurance: formData.professionalLiabilityProvider ? {
            provider: formData.professionalLiabilityProvider,
            policy_number: formData.professionalLiabilityPolicyNumber,
            amount: formData.professionalLiabilityAmount,
            expiration_date: formData.professionalLiabilityExpiration
          } : null,
          fda_registration_number: formData.fdaRegistrationNumber,
          age_verification_procedures: formData.ageVerificationProcedures,
          product_composition_disclosure: formData.productCompositionDisclosure,
          social_media_profiles: {
            facebook: formData.socialMediaFacebook,
            instagram: formData.socialMediaInstagram,
            twitter: formData.socialMediaTwitter,
            linkedin: formData.socialMediaLinkedIn
          },
          bbb_rating: formData.bbbRating,
        })
        .select()
        .single();

      if (appError) throw appError;

      if (formData.equipment.length > 0) {
        const equipmentInserts = formData.equipment.map(eq => ({
          application_id: application.id,
          equipment_type: eq.type,
          equipment_model: eq.model,
          quantity: eq.quantity,
          unit_price: 0,
          total_price: 0,
        }));

        const { error: equipError } = await supabase
          .from('merchant_application_equipment')
          .insert(equipmentInserts);

        if (equipError) throw equipError;
      }

      setApplicationNumber(appNumber);
      setCurrentStep(totalSteps + 1);
    } catch (error: any) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (currentStep === totalSteps + 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-12 px-4">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Your merchant processing application has been successfully submitted.
            </p>
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">Application Number</p>
              <p className="text-2xl font-bold text-blue-600">{applicationNumber}</p>
            </div>
            <div className="space-y-4 text-left mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Review Process</p>
                  <p className="text-sm text-gray-600">We'll review your application within 1-2 business days.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Approval & Boarding</p>
                  <p className="text-sm text-gray-600">Upon approval, we'll board your account and send gateway information.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Start Processing</p>
                  <p className="text-sm text-gray-600">Begin accepting payments and grow your business!</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/merchant')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold text-white">Merchant Processing Application</h1>
              <div className="text-right">
                <p className="text-sm text-blue-200">Standard Rep ID:</p>
                <p className="text-2xl font-bold text-red-500">07288-2186</p>
              </div>
            </div>
            <p className="text-blue-100">Step {currentStep} of {totalSteps}: {steps[currentStep - 1].name}</p>
          </div>

          <div className="px-8 py-4 bg-gray-50 border-b">
            <div className="flex justify-between items-center">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.number} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                        step.number < currentStep
                          ? 'bg-green-500 text-white'
                          : step.number === currentStep
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {step.number < currentStep ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className="text-xs text-gray-600 hidden sm:block">{step.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Information</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Legal Business Name *</label>
                  <input
                    type="text"
                    value={formData.legalBusinessName}
                    onChange={(e) => setFormData({ ...formData, legalBusinessName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">DBA Name (if different)</label>
                  <input
                    type="text"
                    value={formData.dbaName}
                    onChange={(e) => setFormData({ ...formData, dbaName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select...</option>
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                      <option value="Partnership">Partnership</option>
                      <option value="LLC">LLC</option>
                      <option value="Corporation">Corporation</option>
                      <option value="Non-Profit">Non-Profit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID / EIN *</label>
                    <input
                      type="text"
                      value={formData.taxId}
                      onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="XX-XXXXXXX"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Start Date</label>
                    <input
                      type="date"
                      value={formData.businessStartDate}
                      onChange={(e) => setFormData({ ...formData, businessStartDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry Category</label>
                    <select
                      value={formData.industryCategory}
                      onChange={(e) => setFormData({ ...formData, industryCategory: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select...</option>
                      <option value="Retail">Retail</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Professional Services">Professional Services</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="CBD">CBD / Hemp</option>
                      <option value="Nutraceuticals">Nutraceuticals</option>
                      <option value="Travel">Travel</option>
                      <option value="Subscription">Subscription Services</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Model</label>
                  <select
                    value={formData.businessModel}
                    onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="Retail Store">Retail Store</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Mail Order / Telephone Order">Mail Order / Telephone Order</option>
                    <option value="Subscription">Subscription</option>
                    <option value="Service Provider">Service Provider</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Address</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                  <input
                    type="text"
                    value={formData.businessAddress}
                    onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      value={formData.businessCity}
                      onChange={(e) => setFormData({ ...formData, businessCity: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <input
                      type="text"
                      value={formData.businessState}
                      onChange={(e) => setFormData({ ...formData, businessState: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={2}
                      placeholder="CA"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                    <input
                      type="text"
                      value={formData.businessZip}
                      onChange={(e) => setFormData({ ...formData, businessZip: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Phone *</label>
                    <input
                      type="tel"
                      value={formData.businessPhone}
                      onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(555) 555-5555"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                  <input
                    type="url"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Primary Contact Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={formData.contactFirstName}
                      onChange={(e) => setFormData({ ...formData, contactFirstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={formData.contactLastName}
                      onChange={(e) => setFormData({ ...formData, contactLastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.contactTitle}
                    onChange={(e) => setFormData({ ...formData, contactTitle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Owner, Manager"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Ownership Information</h2>
                  <button
                    onClick={addOwner}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Owner
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  List all owners with 25% or more ownership stake
                </p>

                {formData.owners.map((owner, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-900">Owner {index + 1}</h3>
                      <button
                        onClick={() => removeOwner(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={owner.firstName}
                        onChange={(e) => updateOwner(index, 'firstName', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={owner.lastName}
                        onChange={(e) => updateOwner(index, 'lastName', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Title"
                        value={owner.title}
                        onChange={(e) => updateOwner(index, 'title', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Ownership %"
                        value={owner.ownershipPercentage || ''}
                        onChange={(e) => updateOwner(index, 'ownershipPercentage', parseFloat(e.target.value))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        min="0"
                        max="100"
                      />
                      <input
                        type="text"
                        placeholder="SSN (XXX-XX-XXXX)"
                        value={owner.ssn}
                        onChange={(e) => updateOwner(index, 'ssn', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="date"
                        placeholder="Date of Birth"
                        value={owner.dateOfBirth}
                        onChange={(e) => updateOwner(index, 'dateOfBirth', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Address"
                        value={owner.address}
                        onChange={(e) => updateOwner(index, 'address', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 md:col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="City"
                        value={owner.city}
                        onChange={(e) => updateOwner(index, 'city', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={owner.state}
                        onChange={(e) => updateOwner(index, 'state', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        maxLength={2}
                      />
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={owner.zip}
                        onChange={(e) => updateOwner(index, 'zip', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}

                {formData.owners.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No owners added yet</p>
                    <button
                      onClick={addOwner}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add First Owner
                    </button>
                  </div>
                )}
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Banking Information</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Routing Number *</label>
                    <input
                      type="text"
                      value={formData.bankRoutingNumber}
                      onChange={(e) => setFormData({ ...formData, bankRoutingNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={9}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                    <input
                      type="text"
                      value={formData.bankAccountNumber}
                      onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Type *</label>
                  <select
                    value={formData.bankAccountType}
                    onChange={(e) => setFormData({ ...formData, bankAccountType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Processing Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Volume</label>
                    <input
                      type="number"
                      value={formData.monthlyVolume}
                      onChange={(e) => setFormData({ ...formData, monthlyVolume: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="$"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Average Ticket</label>
                    <input
                      type="number"
                      value={formData.averageTicket}
                      onChange={(e) => setFormData({ ...formData, averageTicket: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="$"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Highest Ticket</label>
                    <input
                      type="number"
                      value={formData.highestTicket}
                      onChange={(e) => setFormData({ ...formData, highestTicket: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="$"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Credit Card Sales %</label>
                    <input
                      type="number"
                      value={formData.creditCardSalesPercentage}
                      onChange={(e) => setFormData({ ...formData, creditCardSalesPercentage: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="100"
                      placeholder="%"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-commerce %</label>
                    <input
                      type="number"
                      value={formData.ecommercePercentage}
                      onChange={(e) => setFormData({ ...formData, ecommercePercentage: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="100"
                      placeholder="%"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Present %</label>
                    <input
                      type="number"
                      value={formData.cardPresentPercentage}
                      onChange={(e) => setFormData({ ...formData, cardPresentPercentage: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="100"
                      placeholder="%"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Card Types Accepted</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.acceptsAmex}
                        onChange={(e) => setFormData({ ...formData, acceptsAmex: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">American Express</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.acceptsDiscover}
                        onChange={(e) => setFormData({ ...formData, acceptsDiscover: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Discover</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.acceptsPinDebit}
                        onChange={(e) => setFormData({ ...formData, acceptsPinDebit: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">PIN Debit</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.acceptsEbt}
                        onChange={(e) => setFormData({ ...formData, acceptsEbt: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">EBT / SNAP</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 7 && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Equipment Selection</h2>
                  <p className="text-green-600 font-semibold mt-2">All equipment is FREE - select what you need</p>
                </div>

                {Object.entries(equipmentOptions).map(([type, models]) => (
                  <div key={type} className="space-y-3">
                    <h3 className="font-semibold text-gray-900">{type}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {models.map((item) => {
                        const selected = formData.equipment.find(e => e.type === type && e.model === item.model);
                        return (
                          <div key={item.model} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium text-gray-900">{item.model}</p>
                                <p className="text-sm font-semibold text-green-600">FREE</p>
                              </div>
                              {selected ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    value={selected.quantity}
                                    onChange={(e) => updateEquipmentQuantity(type, item.model, parseInt(e.target.value))}
                                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                                    min="1"
                                  />
                                  <button
                                    onClick={() => removeEquipment(type, item.model)}
                                    className="text-red-600 hover:text-red-700 text-sm"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addEquipment(type, item.model)}
                                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                >
                                  Add
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {formData.equipment.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Selected Equipment</h3>
                    <div className="space-y-2">
                      {formData.equipment.map((eq, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{eq.model} x{eq.quantity}</span>
                          <span className="font-semibold text-green-600">FREE</span>
                        </div>
                      ))}
                      <div className="border-t border-green-300 pt-2 mt-3">
                        <p className="text-sm text-gray-600">All equipment included at no charge</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 8 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing Structure</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Structure</label>
                  <select
                    value={formData.pricingStructure}
                    onChange={(e) => setFormData({ ...formData, pricingStructure: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="Cash Discount/Dual Pricing">Cash Discount/Dual Pricing</option>
                    <option value="Flat Rate/Fee">Flat Rate/Fee</option>
                    <option value="Interchange Plus">Interchange Plus</option>
                    <option value="True Surcharging">True Surcharging</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Processor</label>
                  <select
                    value={formData.processor}
                    onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="First Data">First Data</option>
                    <option value="TSYS">TSYS</option>
                    <option value="Global Payments">Global Payments</option>
                    <option value="Worldpay">Worldpay</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rate Percentage</label>
                    <input
                      type="number"
                      value={formData.ratePercentage}
                      onChange={(e) => setFormData({ ...formData, ratePercentage: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.01"
                      placeholder="%"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Fee</label>
                    <input
                      type="number"
                      value={formData.transactionFee}
                      onChange={(e) => setFormData({ ...formData, transactionFee: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.01"
                      placeholder="$"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gateway</label>
                  <select
                    value={formData.gateway}
                    onChange={(e) => setFormData({ ...formData, gateway: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Please Select</option>
                    <option value="PayBright Gateway">PayBright Gateway</option>
                    <option value="Swipe Simple Virtual Terminal Only">Swipe Simple Virtual Terminal Only</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Online Access Fee</label>
                    <input
                      type="number"
                      value={formData.onlineAccessFee}
                      onChange={(e) => setFormData({ ...formData, onlineAccessFee: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.01"
                      placeholder="$"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upgrade Fee</label>
                    <input
                      type="number"
                      value={formData.upgradeFee}
                      onChange={(e) => setFormData({ ...formData, upgradeFee: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.01"
                      placeholder="$"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 9 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Processing History</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years Processing Credit Cards</label>
                  <input
                    type="number"
                    value={formData.yearsProcessing}
                    onChange={(e) => setFormData({ ...formData, yearsProcessing: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Processor</label>
                  <input
                    type="text"
                    value={formData.currentProcessor}
                    onChange={(e) => setFormData({ ...formData, currentProcessor: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Previous Processor (if any)</label>
                  <input
                    type="text"
                    value={formData.previousProcessor}
                    onChange={(e) => setFormData({ ...formData, previousProcessor: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.previousAccountTerminated}
                      onChange={(e) => setFormData({ ...formData, previousAccountTerminated: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Previous account was terminated</span>
                  </label>
                </div>

                {formData.previousAccountTerminated && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Termination</label>
                    <textarea
                      value={formData.terminationReason}
                      onChange={(e) => setFormData({ ...formData, terminationReason: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            )}

            {currentStep === 10 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Risk Assessment</h2>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isHighRisk}
                      onChange={(e) => setFormData({ ...formData, isHighRisk: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">High-risk industry</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Average Chargeback Rate (%)</label>
                    <input
                      type="number"
                      value={formData.averageChargebackRate}
                      onChange={(e) => setFormData({ ...formData, averageChargebackRate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Average Refund Rate (%)</label>
                    <input
                      type="number"
                      value={formData.averageRefundRate}
                      onChange={(e) => setFormData({ ...formData, averageRefundRate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fulfillment Timeframe</label>
                    <input
                      type="text"
                      value={formData.fulfillmentTimeframe}
                      onChange={(e) => setFormData({ ...formData, fulfillmentTimeframe: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 24 hours, 7 days"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Timeframe</label>
                    <input
                      type="text"
                      value={formData.deliveryTimeframe}
                      onChange={(e) => setFormData({ ...formData, deliveryTimeframe: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 3-5 business days"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Business Characteristics</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.recurringBilling}
                        onChange={(e) => setFormData({ ...formData, recurringBilling: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Recurring Billing</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.seasonalBusiness}
                        onChange={(e) => setFormData({ ...formData, seasonalBusiness: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Seasonal Business</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.acceptsInternationalPayments}
                        onChange={(e) => setFormData({ ...formData, acceptsInternationalPayments: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">International Payments</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.advanceDeposits}
                        onChange={(e) => setFormData({ ...formData, advanceDeposits: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Advance Deposits</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Inventory Source</label>
                    <input
                      type="text"
                      value={formData.inventorySource}
                      onChange={(e) => setFormData({ ...formData, inventorySource: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Manufacturer, Distributor"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Method</label>
                    <input
                      type="text"
                      value={formData.deliveryMethod}
                      onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., UPS, FedEx, In-person"
                    />
                  </div>
                </div>

                {formData.isHighRisk && (
                  <>
                    <div className="border-t border-gray-300 pt-6 mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">High-Risk Additional Requirements</h3>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-yellow-800">
                          High-risk accounts require additional documentation and enhanced due diligence. Please complete all fields below.
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Personal Credit Score (Self-Disclosed)</label>
                          <input
                            type="number"
                            value={formData.personalCreditScore}
                            onChange={(e) => setFormData({ ...formData, personalCreditScore: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="300"
                            max="850"
                            placeholder="e.g., 720"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Chargeback Mitigation Plan *</label>
                          <textarea
                            value={formData.chargebackMitigationPlan}
                            onChange={(e) => setFormData({ ...formData, chargebackMitigationPlan: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={4}
                            placeholder="Describe your strategy for preventing and managing chargebacks"
                            required={formData.isHighRisk}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Service Response Time</label>
                            <input
                              type="text"
                              value={formData.customerServiceResponseTime}
                              onChange={(e) => setFormData({ ...formData, customerServiceResponseTime: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="e.g., 24 hours"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Marketing Channels Used</label>
                            <input
                              type="text"
                              value={formData.marketingChannels}
                              onChange={(e) => setFormData({ ...formData, marketingChannels: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="e.g., Social Media, Email, PPC"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Dispute Resolution Procedures</label>
                          <textarea
                            value={formData.disputeResolutionProcedures}
                            onChange={(e) => setFormData({ ...formData, disputeResolutionProcedures: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            placeholder="Describe your procedures for handling customer disputes"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Refund/Return Policy</label>
                          <textarea
                            value={formData.refundPolicyText}
                            onChange={(e) => setFormData({ ...formData, refundPolicyText: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            placeholder="Full refund and return policy"
                          />
                        </div>

                        {formData.recurringBilling && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Policy</label>
                            <textarea
                              value={formData.cancellationPolicyText}
                              onChange={(e) => setFormData({ ...formData, cancellationPolicyText: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={3}
                              placeholder="Subscription cancellation policy"
                            />
                          </div>
                        )}

                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="font-semibold text-gray-900 mb-3">Security & Fraud Prevention</h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">SSL Certificate Info</label>
                              <input
                                type="text"
                                value={formData.sslCertificateInfo}
                                onChange={(e) => setFormData({ ...formData, sslCertificateInfo: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Provider and expiration"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Fraud Prevention Tools</label>
                              <input
                                type="text"
                                value={formData.fraudPreventionTools}
                                onChange={(e) => setFormData({ ...formData, fraudPreventionTools: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Kount, Sift, MaxMind"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={formData.threeDSecureEnabled}
                                onChange={(e) => setFormData({ ...formData, threeDSecureEnabled: e.target.checked })}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">3D Secure Enabled</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={formData.avsEnabled}
                                onChange={(e) => setFormData({ ...formData, avsEnabled: e.target.checked })}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">AVS Enabled</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={formData.cvvVerificationRequired}
                                onChange={(e) => setFormData({ ...formData, cvvVerificationRequired: e.target.checked })}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">CVV Required</span>
                            </label>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="font-semibold text-gray-900 mb-3">Insurance Coverage</h4>

                          <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h5 className="text-sm font-medium text-gray-700 mb-3">General Liability Insurance</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                  type="text"
                                  placeholder="Provider"
                                  value={formData.generalLiabilityProvider}
                                  onChange={(e) => setFormData({ ...formData, generalLiabilityProvider: e.target.value })}
                                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                  type="text"
                                  placeholder="Policy Number"
                                  value={formData.generalLiabilityPolicyNumber}
                                  onChange={(e) => setFormData({ ...formData, generalLiabilityPolicyNumber: e.target.value })}
                                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                  type="text"
                                  placeholder="Coverage Amount"
                                  value={formData.generalLiabilityAmount}
                                  onChange={(e) => setFormData({ ...formData, generalLiabilityAmount: e.target.value })}
                                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                  type="date"
                                  placeholder="Expiration Date"
                                  value={formData.generalLiabilityExpiration}
                                  onChange={(e) => setFormData({ ...formData, generalLiabilityExpiration: e.target.value })}
                                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                              <h5 className="text-sm font-medium text-gray-700 mb-3">Product Liability Insurance</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                  type="text"
                                  placeholder="Provider"
                                  value={formData.productLiabilityProvider}
                                  onChange={(e) => setFormData({ ...formData, productLiabilityProvider: e.target.value })}
                                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                  type="text"
                                  placeholder="Policy Number"
                                  value={formData.productLiabilityPolicyNumber}
                                  onChange={(e) => setFormData({ ...formData, productLiabilityPolicyNumber: e.target.value })}
                                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                  type="text"
                                  placeholder="Coverage Amount"
                                  value={formData.productLiabilityAmount}
                                  onChange={(e) => setFormData({ ...formData, productLiabilityAmount: e.target.value })}
                                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                  type="date"
                                  placeholder="Expiration Date"
                                  value={formData.productLiabilityExpiration}
                                  onChange={(e) => setFormData({ ...formData, productLiabilityExpiration: e.target.value })}
                                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                              <h5 className="text-sm font-medium text-gray-700 mb-3">Professional Liability / E&O Insurance</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                  type="text"
                                  placeholder="Provider"
                                  value={formData.professionalLiabilityProvider}
                                  onChange={(e) => setFormData({ ...formData, professionalLiabilityProvider: e.target.value })}
                                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                  type="text"
                                  placeholder="Policy Number"
                                  value={formData.professionalLiabilityPolicyNumber}
                                  onChange={(e) => setFormData({ ...formData, professionalLiabilityPolicyNumber: e.target.value })}
                                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                  type="text"
                                  placeholder="Coverage Amount"
                                  value={formData.professionalLiabilityAmount}
                                  onChange={(e) => setFormData({ ...formData, professionalLiabilityAmount: e.target.value })}
                                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                  type="date"
                                  placeholder="Expiration Date"
                                  value={formData.professionalLiabilityExpiration}
                                  onChange={(e) => setFormData({ ...formData, professionalLiabilityExpiration: e.target.value })}
                                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {(formData.industryCategory === 'CBD' || formData.industryCategory === 'Nutraceuticals') && (
                          <div className="border-t border-gray-200 pt-4">
                            <h4 className="font-semibold text-gray-900 mb-3">Industry-Specific Requirements</h4>

                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">FDA Registration Number</label>
                                <input
                                  type="text"
                                  value={formData.fdaRegistrationNumber}
                                  onChange={(e) => setFormData({ ...formData, fdaRegistrationNumber: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Age Verification Procedures</label>
                                <textarea
                                  value={formData.ageVerificationProcedures}
                                  onChange={(e) => setFormData({ ...formData, ageVerificationProcedures: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  rows={3}
                                  placeholder="Describe how you verify customer age"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Composition Disclosure</label>
                                <textarea
                                  value={formData.productCompositionDisclosure}
                                  onChange={(e) => setFormData({ ...formData, productCompositionDisclosure: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  rows={3}
                                  placeholder="List ingredients and composition"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="font-semibold text-gray-900 mb-3">Business Validation</h4>

                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                                <input
                                  type="url"
                                  value={formData.socialMediaFacebook}
                                  onChange={(e) => setFormData({ ...formData, socialMediaFacebook: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="https://facebook.com/..."
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                                <input
                                  type="url"
                                  value={formData.socialMediaInstagram}
                                  onChange={(e) => setFormData({ ...formData, socialMediaInstagram: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="https://instagram.com/..."
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter/X URL</label>
                                <input
                                  type="url"
                                  value={formData.socialMediaTwitter}
                                  onChange={(e) => setFormData({ ...formData, socialMediaTwitter: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="https://twitter.com/..."
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                                <input
                                  type="url"
                                  value={formData.socialMediaLinkedIn}
                                  onChange={(e) => setFormData({ ...formData, socialMediaLinkedIn: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="https://linkedin.com/..."
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Better Business Bureau Rating</label>
                              <select
                                value={formData.bbbRating}
                                onChange={(e) => setFormData({ ...formData, bbbRating: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="">Select...</option>
                                <option value="A+">A+</option>
                                <option value="A">A</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B">B</option>
                                <option value="B-">B-</option>
                                <option value="C+">C+</option>
                                <option value="C">C</option>
                                <option value="C-">C-</option>
                                <option value="D+">D+</option>
                                <option value="D">D</option>
                                <option value="D-">D-</option>
                                <option value="F">F</option>
                                <option value="Not Rated">Not Rated</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">Authorizations</label>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={formData.reserveAgreementAccepted}
                                onChange={(e) => setFormData({ ...formData, reserveAgreementAccepted: e.target.checked })}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">I acknowledge and accept reserve account requirements</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={formData.backgroundCheckAuthorized}
                                onChange={(e) => setFormData({ ...formData, backgroundCheckAuthorized: e.target.checked })}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">I authorize criminal background check for all 25%+ owners</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {currentStep === 11 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Compliance & Verification</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business License Number</label>
                    <input
                      type="text"
                      value={formData.businessLicenseNumber}
                      onChange={(e) => setFormData({ ...formData, businessLicenseNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Professional License Number</label>
                    <input
                      type="text"
                      value={formData.professionalLicenseNumber}
                      onChange={(e) => setFormData({ ...formData, professionalLicenseNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">MCC (Merchant Category Code)</label>
                  <input
                    type="text"
                    value={formData.mccCode}
                    onChange={(e) => setFormData({ ...formData, mccCode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="4-digit code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Privacy Policy URL</label>
                  <input
                    type="url"
                    value={formData.privacyPolicyUrl}
                    onChange={(e) => setFormData({ ...formData, privacyPolicyUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Terms of Service URL</label>
                  <input
                    type="url"
                    value={formData.termsOfServiceUrl}
                    onChange={(e) => setFormData({ ...formData, termsOfServiceUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://"
                  />
                </div>
              </div>
            )}

            {currentStep === 12 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Terms & Electronic Signature</h2>

                <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Merchant Processing Agreement</h3>
                  <div className="space-y-4 text-sm text-gray-700">
                    <p>By submitting this application, you agree to the following terms and conditions:</p>

                    <ol className="list-decimal list-inside space-y-2">
                      <li>All information provided is accurate and complete to the best of your knowledge.</li>
                      <li>You authorize us to verify the information provided and conduct credit checks as necessary.</li>
                      <li>You understand that approval is subject to underwriting and compliance review.</li>
                      <li>You agree to comply with all applicable payment card industry (PCI) standards and regulations.</li>
                      <li>You understand that processing rates and fees are subject to the terms agreed upon approval.</li>
                      <li>You agree to maintain adequate reserves as determined by underwriting.</li>
                      <li>You will notify us immediately of any changes to your business information.</li>
                      <li>You understand that chargebacks and refunds are your responsibility.</li>
                      <li>Equipment purchases are non-refundable once shipped.</li>
                      <li>You agree to a minimum processing term as outlined in your merchant agreement.</li>
                    </ol>

                    <p className="font-semibold mt-6">Privacy Policy</p>
                    <p>We will protect your personal information in accordance with applicable privacy laws and will not share your information with third parties except as required for processing your application and servicing your account.</p>

                    <p className="font-semibold mt-4">PCI Compliance</p>
                    <p>You agree to maintain PCI DSS compliance and implement appropriate security measures to protect cardholder data.</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
                      required
                    />
                    <span className="text-sm text-gray-700">
                      I have read and agree to the Merchant Processing Agreement and terms outlined above. I certify that all information provided is true and accurate.
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Electronic Signature (Full Name) *</label>
                  <input
                    type="text"
                    value={formData.signatureName}
                    onChange={(e) => setFormData({ ...formData, signatureName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Type your full legal name"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    By typing your name, you are providing an electronic signature which has the same legal effect as a handwritten signature.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                  <p>Signature Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>

          <div className="px-8 py-6 bg-gray-50 border-t flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              Back
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.termsAccepted || !formData.signatureName}
                className={`px-8 py-2 rounded-lg font-medium transition-colors ${
                  loading || !formData.termsAccepted || !formData.signatureName
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
