import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext';
import { InternalTeamAuthProvider, useInternalTeamAuth } from './contexts/InternalTeamAuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import { AttachReferralOnLogin } from './components/AttachReferralOnLogin';
import DevModeRoleSwitcher from './components/DevModeRoleSwitcher';

const Landing = lazy(() => import('./pages/Landing'));
const UnifiedLogin = lazy(() => import('./pages/UnifiedLogin'));
const ForBusinesses = lazy(() => import('./pages/ForBusinesses'));
const BusinessPricing = lazy(() => import('./pages/BusinessPricing'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const About = lazy(() => import('./pages/About'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const DealsPage = lazy(() => import('./pages/customer/DealsPage'));
const DealDetailPage = lazy(() => import('./pages/customer/DealDetailPage'));
const PurchaseConfirmationPage = lazy(() => import('./pages/customer/PurchaseConfirmationPage'));
const PurchasesPage = lazy(() => import('./pages/customer/PurchasesPage'));
const FavoritesPage = lazy(() => import('./pages/customer/FavoritesPage'));
const ProfilePage = lazy(() => import('./pages/customer/ProfilePage'));
const CheckoutPage = lazy(() => import('./pages/customer/CheckoutPage'));
const PaymentStatusPage = lazy(() => import('./pages/customer/PaymentStatusPage'));
const ReferralLandingPage = lazy(() => import('./pages/customer/ReferralLandingPage'));
const PartnerReferralLandingPage = lazy(() => import('./pages/ReferralLandingPage'));
const PulseFeedPage = lazy(() => import('./pages/customer/PulseFeedPage'));
const PulseLeaderboardPage = lazy(() => import('./pages/customer/PulseLeaderboardPage'));
const PulseReferralPage = lazy(() => import('./pages/customer/PulseReferralPage'));
const MerchantDashboard = lazy(() => import('./pages/merchant/MerchantDashboard'));
const MerchantPulseDashboard = lazy(() => import('./pages/merchant/MerchantPulseDashboard'));
const MerchantOnboarding = lazy(() => import('./pages/merchant/MerchantOnboarding'));
const MerchantDealsPage = lazy(() => import('./pages/merchant/MerchantDealsPage'));
const CreateDealPage = lazy(() => import('./pages/merchant/CreateDealPage'));
const RedemptionPage = lazy(() => import('./pages/merchant/RedemptionPage'));
const CRMMigrationPage = lazy(() => import('./pages/merchant/CRMMigrationPage'));
const AIBotsPage = lazy(() => import('./pages/merchant/AIBotsPage'));
const AIQuoteAssistantPage = lazy(() => import('./pages/merchant/AIQuoteAssistantPage'));
const AIReviewResponderPage = lazy(() => import('./pages/merchant/AIReviewResponderPage'));
const AISocialMediaPage = lazy(() => import('./pages/merchant/AISocialMediaPage'));
const AIEmailComposerPage = lazy(() => import('./pages/merchant/AIEmailComposerPage'));
const AIAdCopyWriterPage = lazy(() => import('./pages/merchant/AIAdCopyWriterPage'));
const AIAppointmentSchedulerPage = lazy(() => import('./pages/merchant/AIAppointmentSchedulerPage'));
const AILeadQualifierPage = lazy(() => import('./pages/merchant/AILeadQualifierPage'));
const AIFollowUpAutomationPage = lazy(() => import('./pages/merchant/AIFollowUpAutomationPage'));
const AIInvoiceReminderPage = lazy(() => import('./pages/merchant/AIInvoiceReminderPage'));
const AICustomerRetentionPage = lazy(() => import('./pages/merchant/AICustomerRetentionPage'));
const AIReputationMonitorPage = lazy(() => import('./pages/merchant/AIReputationMonitorPage'));
const AIProposalGeneratorPage = lazy(() => import('./pages/merchant/AIProposalGeneratorPage'));
const AISuitePackagesPage = lazy(() => import('./pages/merchant/AISuitePackagesPage'));
const AIMarketingFunnelsPage = lazy(() => import('./pages/merchant/AIMarketingFunnelsPage'));
const AIContentCalendarPage = lazy(() => import('./pages/merchant/AIContentCalendarPage'));
const AIChatbotBuilderPage = lazy(() => import('./pages/merchant/AIChatbotBuilderPage'));
const SwipeFilePage = lazy(() => import('./pages/merchant/SwipeFilePage'));
const SwipeFileTemplatesPage = lazy(() => import('./pages/merchant/SwipeFileTemplatesPage'));
const LandingPageCheckoutPage = lazy(() => import('./pages/merchant/LandingPageCheckoutPage'));
const LandingPageProcessingPage = lazy(() => import('./pages/merchant/LandingPageProcessingPage'));
const WebsitesPage = lazy(() => import('./pages/merchant/WebsitesPage'));
const WebsiteIntakeForm = lazy(() => import('./pages/merchant/WebsiteIntakeForm'));
const PrintingServicesPage = lazy(() => import('./pages/merchant/PrintingServicesPage'));
const DesignServiceCheckoutPage = lazy(() => import('./pages/merchant/DesignServiceCheckoutPage'));
const DesignServiceConfirmationPage = lazy(() => import('./pages/merchant/DesignServiceConfirmationPage'));
const LeadsPage = lazy(() => import('./pages/merchant/LeadsPage'));
const AppointmentSettingPage = lazy(() => import('./pages/merchant/AppointmentSettingPage'));
const AppointmentSettingCheckoutPage = lazy(() => import('./pages/merchant/AppointmentSettingCheckoutPage'));
const AppointmentSettingConfirmationPage = lazy(() => import('./pages/merchant/AppointmentSettingConfirmationPage'));
const HireJobsPage = lazy(() => import('./pages/merchant/HireJobsPage'));
const MerchantServicesPage = lazy(() => import('./pages/merchant/MerchantServicesPage'));
const RecruitingPage = lazy(() => import('./pages/merchant/RecruitingPage'));
const JobTemplatesCheckoutPage = lazy(() => import('./pages/merchant/JobTemplatesCheckoutPage'));
const JobTemplatesConfirmationPage = lazy(() => import('./pages/merchant/JobTemplatesConfirmationPage'));
const ResumeWritingCheckoutPage = lazy(() => import('./pages/merchant/ResumeWritingCheckoutPage'));
const ResumeWritingConfirmationPage = lazy(() => import('./pages/merchant/ResumeWritingConfirmationPage'));
const HiringFunnelCheckoutPage = lazy(() => import('./pages/merchant/HiringFunnelCheckoutPage'));
const HiringFunnelConfirmationPage = lazy(() => import('./pages/merchant/HiringFunnelConfirmationPage'));
const PostcardCheckoutPage = lazy(() => import('./pages/merchant/PostcardCheckoutPage'));
const PostcardConfirmationPage = lazy(() => import('./pages/merchant/PostcardConfirmationPage'));
const SupportPage = lazy(() => import('./pages/merchant/SupportPage'));
const CRMPage = lazy(() => import('./pages/merchant/CRMPage'));
const CRMMarketplacePage = lazy(() => import('./pages/merchant/CRMMarketplacePage'));
const CRMDashboardPage = lazy(() => import('./pages/merchant/CRMDashboardPage'));
const CRMIntegrationPage = lazy(() => import('./pages/merchant/CRMIntegrationPage'));
const CRMContactsList = lazy(() => import('./pages/merchant/CRMContactsList'));
const CRMContactDetail = lazy(() => import('./pages/merchant/CRMContactDetail'));
const CRMContactNew = lazy(() => import('./pages/merchant/CRMContactNew'));
const CRMPipeline = lazy(() => import('./pages/merchant/CRMPipeline'));
const CRMTasks = lazy(() => import('./pages/merchant/CRMTasks'));
const CRMReports = lazy(() => import('./pages/merchant/CRMReports'));
const InvoicingPage = lazy(() => import('./pages/merchant/InvoicingPage'));
const CreateInvoicePage = lazy(() => import('./pages/merchant/CreateInvoicePage'));
const PostcardsPage = lazy(() => import('./pages/merchant/PostcardsPage'));
const CustomerReferralSettings = lazy(() => import('./pages/merchant/CustomerReferralSettings'));
const CustomerReferralDashboard = lazy(() => import('./pages/merchant/CustomerReferralDashboard'));
const ReferralPrintCards = lazy(() => import('./pages/merchant/ReferralPrintCards'));
const ReferralPrint5x7 = lazy(() => import('./pages/merchant/ReferralPrint5x7'));
const ReferralPrintLetter = lazy(() => import('./pages/merchant/ReferralPrintLetter'));
const SettingsPage = lazy(() => import('./pages/merchant/SettingsPage'));
const ReviewsPage = lazy(() => import('./pages/merchant/ReviewsPage'));
const MarketingPage = lazy(() => import('./pages/merchant/MarketingPage'));
const AnalyticsPage = lazy(() => import('./pages/merchant/AnalyticsPage'));
const PaymentSettingsPage = lazy(() => import('./pages/merchant/PaymentSettingsPage'));
const UpgradePage = lazy(() => import('./pages/merchant/UpgradePage'));
const TierUpgradeCheckout = lazy(() => import('./pages/merchant/TierUpgradeCheckout'));
const TierUpgradeSuccess = lazy(() => import('./pages/merchant/TierUpgradeSuccess'));
const AddonsMarketplace = lazy(() => import('./pages/merchant/AddonsMarketplace'));
const AddonCheckoutPage = lazy(() => import('./pages/merchant/AddonCheckoutPage'));
const AddonSuccessPage = lazy(() => import('./pages/merchant/AddonSuccessPage'));
const SubscriptionCheckoutPage = lazy(() => import('./pages/merchant/SubscriptionCheckoutPage'));
const SubscriptionPaymentCompletePage = lazy(() => import('./pages/merchant/SubscriptionPaymentCompletePage'));
const SwipeFileCheckoutPage = lazy(() => import('./pages/merchant/SwipeFileCheckoutPage'));
const SwipeFilePaymentCompletePage = lazy(() => import('./pages/merchant/SwipeFilePaymentCompletePage'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const EnhancedAdminDashboard = lazy(() => import('./pages/admin/EnhancedAdminDashboard'));
const AdminPulseDashboard = lazy(() => import('./pages/admin/AdminPulseDashboard'));
const BudgetBusterAnalytics = lazy(() => import('./pages/admin/BudgetBusterAnalytics'));
const AdminCRMDashboard = lazy(() => import('./pages/admin/AdminCRMDashboard'));
const AccountingDashboard = lazy(() => import('./pages/admin/AccountingDashboard'));
const BusinessDashboard = lazy(() => import('./pages/admin/BusinessDashboard'));
const CommissionPayoutsPage = lazy(() => import('./pages/admin/CommissionPayoutsPage'));
const Admin1099Manager = lazy(() => import('./pages/admin/Admin1099Manager'));
const LocalLinkDashboard = lazy(() => import('./pages/admin/LocalLinkDashboard'));
const ExternalBusinessesDashboard = lazy(() => import('./pages/admin/ExternalBusinessesDashboard'));
const TopPartnersPage = lazy(() => import('./pages/admin/TopPartnersPage'));
const QuarterlyTaxEstimatesPage = lazy(() => import('./pages/admin/QuarterlyTaxEstimatesPage'));
const ProfitNetworkPage = lazy(() => import('./pages/partner/ProfitNetworkPage'));
const ProfitNetworkPlaybookViewer = lazy(() => import('./pages/partner/ProfitNetworkPlaybookViewer'));
const ProfitNetworkSalesPage = lazy(() => import('./pages/partner/ProfitNetworkSalesPage'));

const TeamDashboard = lazy(() => import('./pages/team/TeamDashboard'));
const ManagerDashboard = lazy(() => import('./pages/team/ManagerDashboard'));
const CompaniesPage = lazy(() => import('./pages/team/CompaniesPage'));
const ContactsPage = lazy(() => import('./pages/team/ContactsPage'));
const TasksPage = lazy(() => import('./pages/team/TasksPage'));

const InternalTeamLogin = lazy(() => import('./pages/internal/InternalTeamLogin'));
const InternalDashboard = lazy(() => import('./pages/internal/InternalDashboard'));
const InternalCustomersPage = lazy(() => import('./pages/internal/CustomersPage'));
const InternalSalesPage = lazy(() => import('./pages/internal/SalesPage'));
const InternalInvoicingPage = lazy(() => import('./pages/internal/InvoicingPage'));
const InternalSupportPage = lazy(() => import('./pages/internal/SupportPage'));
const InternalAccountingPage = lazy(() => import('./pages/internal/AccountingPage'));
const InternalBusinessUnitsPage = lazy(() => import('./pages/internal/BusinessUnitsPage'));
const APIIntegrationPage = lazy(() => import('./pages/internal/APIIntegrationPage'));
const MarketingCampaignsPage = lazy(() => import('./pages/internal/MarketingCampaignsPage'));
const PartnerApplications = lazy(() => import('./pages/admin/PartnerApplications'));
const PartnerApplication = lazy(() => import('./pages/PartnerApplication'));
const PartnerAnalytics = lazy(() => import('./pages/admin/PartnerAnalytics'));
const AdminPartnerManager = lazy(() => import('./pages/admin/AdminPartnerManager'));
const TerritoryManagement = lazy(() => import('./pages/admin/TerritoryManagement'));
const TerritoryCreationPage = lazy(() => import('./pages/admin/TerritoryCreationPage'));
const InactivityScannerPage = lazy(() => import('./pages/admin/InactivityScannerPage'));
const ExpansionReviewPage = lazy(() => import('./pages/admin/ExpansionReviewPage'));
const ExpansionRequestPage = lazy(() => import('./pages/partner/ExpansionRequestPage'));
const MerchantApplicationPage = lazy(() => import('./pages/merchant/MerchantApplicationPage'));
const MerchantApplicationsAdmin = lazy(() => import('./pages/admin/MerchantApplicationsAdmin'));
const PartnerDashboard = lazy(() => import('./pages/partner/PartnerDashboard'));
const AIPromptsPage = lazy(() => import('./pages/partner/AIPromptsPage'));
const AffiliateDashboard = lazy(() => import('./pages/partner/AffiliateDashboard'));
const ContractsPage = lazy(() => import('./pages/partner/ContractsPage'));
const EarnLanding = lazy(() => import('./pages/partner/EarnLanding'));
const EarnWizard = lazy(() => import('./pages/partner/EarnWizard'));
const PartnerCRMDashboard = lazy(() => import('./pages/partner/PartnerCRMDashboard'));
const PartnerCRMUpgrade = lazy(() => import('./pages/partner/PartnerCRMUpgrade'));
const PartnerCRMSuccess = lazy(() => import('./pages/partner/PartnerCRMSuccess'));
const PartnerBillingPage = lazy(() => import('./pages/partner/PartnerBillingPage'));
const PartnerOnboardingPage = lazy(() => import('./pages/partner/PartnerOnboardingPage'));
const Partner7DayChallenge = lazy(() => import('./pages/partner/Partner7DayChallenge'));
const PartnerLeaderboard = lazy(() => import('./pages/partner/PartnerLeaderboard'));
const IndustryAdVault = lazy(() => import('./pages/partner/IndustryAdVault'));
const UGCRequestPage = lazy(() => import('./pages/merchant/UGCRequestPage'));
const UGCOrdersPage = lazy(() => import('./pages/merchant/UGCOrdersPage'));
const CommunicationsPage = lazy(() => import('./pages/merchant/CommunicationsPage'));
const CommunicationsActivationPage = lazy(() => import('./pages/merchant/CommunicationsActivationPage'));
const EmailActivationPage = lazy(() => import('./pages/merchant/EmailActivationPage'));
const VapiConfigurationPage = lazy(() => import('./pages/merchant/VapiConfigurationPage'));
const CreatorApplicationPage = lazy(() => import('./pages/creator/CreatorApplicationPage'));
const CreatorDashboardPage = lazy(() => import('./pages/creator/CreatorDashboardPage'));
const CreatorWalletPage = lazy(() => import('./pages/creator/CreatorWalletPage'));
const UGCManagementPage = lazy(() => import('./pages/admin/UGCManagementPage'));
const EarnHub = lazy(() => import('./pages/EarnHub'));
const CourseSalesPage = lazy(() => import('./pages/course/CourseSalesPage'));
const GenericCourseSalesPage = lazy(() => import('./pages/course/GenericCourseSalesPage'));
const CourseEnrollmentPage = lazy(() => import('./pages/course/CourseEnrollmentPage'));
const CourseDashboard = lazy(() => import('./pages/course/CourseDashboard'));
const CourseExamPage = lazy(() => import('./pages/course/CourseExamPage'));
const ModuleDetailPage = lazy(() => import('./pages/course/ModuleDetailPage'));
const LessonViewer = lazy(() => import('./pages/course/LessonViewer'));
const CertificatePage = lazy(() => import('./pages/course/CertificatePage'));
const AffiliatePortal = lazy(() => import('./pages/course/AffiliatePortal'));
const AcademyLanding = lazy(() => import('./pages/course/AcademyLanding'));
const AcademyCourseDetail = lazy(() => import('./pages/course/AcademyCourseDetail'));
const MyCourses = lazy(() => import('./pages/course/MyCourses'));
const GenericCourseDashboard = lazy(() => import('./pages/course/GenericCourseDashboard'));
const PartnerAcceleratorSalesPage = lazy(() => import('./pages/course/PartnerAcceleratorSalesPage'));
const PartnerAcceleratorDashboard = lazy(() => import('./pages/course/PartnerAcceleratorDashboard'));
const MarketplaceAffiliateDashboard = lazy(() => import('./pages/affiliate/AffiliateDashboard'));
const MarketplaceAffiliateProducts = lazy(() => import('./pages/affiliate/AffiliateProducts'));
const MarketplaceAffiliateEarnings = lazy(() => import('./pages/affiliate/AffiliateEarnings'));
const AdminAffiliateCommissions = lazy(() => import('./pages/admin/AdminAffiliateCommissions'));
const AdminProductsRatesPage = lazy(() => import('./pages/admin/AdminProductsRatesPage'));
const PlatformVapiConfig = lazy(() => import('./pages/admin/PlatformVapiConfig'));
const JoinPage = lazy(() => import('./pages/JoinPage'));
const TrainingPortalPage = lazy(() => import('./pages/partner/TrainingPortalPage'));
const LeaderboardPage = lazy(() => import('./pages/partner/LeaderboardPage'));
const PlaybooksPortal = lazy(() => import('./pages/partner/PlaybooksPortal'));
const PlaybookDetail = lazy(() => import('./pages/partner/PlaybookDetail'));
const PlaybookExecutor = lazy(() => import('./pages/partner/PlaybookExecutor'));
const PlaybookLessonViewer = lazy(() => import('./pages/partner/PlaybookLessonViewer'));
const AdminJobsPage = lazy(() => import('./pages/admin/AdminJobsPage'));
const AdminJobDetailPage = lazy(() => import('./pages/admin/AdminJobDetailPage'));
const AdminDeliverablesReview = lazy(() => import('./pages/admin/AdminDeliverablesReview'));
const ExecutiveDashboardV2 = lazy(() => import('./pages/admin/ExecutiveDashboardV2'));
const PartnerJobBoardPage = lazy(() => import('./pages/partner/PartnerJobBoardPage'));
const PartnerJobDetailPage = lazy(() => import('./pages/partner/PartnerJobDetailPage'));
const PartnerJobSubmitPage = lazy(() => import('./pages/partner/PartnerJobSubmitPage'));
const AccountingLitePage = lazy(() => import('./pages/merchant/AccountingLitePage'));
const AccountingProPage = lazy(() => import('./pages/merchant/AccountingProPage'));
const PartnerAccountingProPage = lazy(() => import('./pages/partner/PartnerAccountingProPage'));
const AIBotsMarketplacePageMerchant = lazy(() => import('./pages/merchant/AIBotsMarketplacePage'));
const AIBotsMarketplacePagePartner = lazy(() => import('./pages/partner/AIBotsMarketplacePage'));
const AIBotsMarketplacePageInternal = lazy(() => import('./pages/internal/AIBotsMarketplacePage'));
const PartnerCommandCenter = lazy(() => import('./pages/partner/PartnerCommandCenter'));
const AdminCommandCenter = lazy(() => import('./pages/internal/AdminCommandCenter'));
const CommunicationsCheckoutPageMerchant = lazy(() => import('./pages/merchant/CommunicationsCheckoutPage'));
const CommunicationsCheckoutPagePartner = lazy(() => import('./pages/partner/CommunicationsCheckoutPage'));
const BusinessCoachPageMerchant = lazy(() => import('./pages/merchant/BusinessCoachPage'));
const BusinessCoachPagePartner = lazy(() => import('./pages/partner/BusinessCoachPage'));
const BusinessCoachCheckoutMerchant = lazy(() => import('./pages/merchant/BusinessCoachCheckout'));
const BusinessCoachCheckoutPartner = lazy(() => import('./pages/partner/BusinessCoachCheckout'));
const DFYHub = lazy(() => import('./pages/merchant/DFYHub'));
const DFYProductDetail = lazy(() => import('./pages/merchant/DFYProductDetail'));
const DFYOnboardingPage = lazy(() => import('./pages/merchant/DFYOnboardingPage'));
const BundleProductPage = lazy(() => import('./pages/merchant/BundleProductPage'));
const DFYOrderStatusPage = lazy(() => import('./pages/merchant/DFYOrderStatusPage'));
const AdminDFYOrdersPage = lazy(() => import('./pages/admin/AdminDFYOrdersPage'));
const AdminDFYOrderDetailPage = lazy(() => import('./pages/admin/AdminDFYOrderDetailPage'));
const PartnerDFYToolsPage = lazy(() => import('./pages/partner/PartnerDFYToolsPage'));
const PartnerDFYAdVaultPage = lazy(() => import('./pages/partner/PartnerDFYAdVaultPage'));
const AdminCommissionsPage = lazy(() => import('./pages/admin/AdminCommissionsPage'));
const AcademyModulesPage = lazy(() => import('./pages/admin/AcademyModulesPage'));
const AcademyLessonsPage = lazy(() => import('./pages/admin/AcademyLessonsPage'));
const AcademyExamQuestionsPage = lazy(() => import('./pages/admin/AcademyExamQuestionsPage'));
const StripeSKUManager = lazy(() => import('./pages/admin/StripeSKUManager'));
const AcademyProductMapping = lazy(() => import('./pages/admin/AcademyProductMapping'));
const AcademyMarketplace = lazy(() => import('./pages/merchant/AcademyMarketplace'));
const MerchantWebinarAcademy = lazy(() => import('./pages/merchant/MerchantWebinarAcademy'));
const PartnerEarningsPage = lazy(() => import('./pages/partner/PartnerEarningsPage'));
const BlogGrowthSystemSalesPage = lazy(() => import('./pages/course/BlogGrowthSystemSalesPage'));
const BlogCourseCheckout = lazy(() => import('./pages/merchant/BlogCourseCheckout'));
const BlogGrowthCourseDashboard = lazy(() => import('./pages/course/BlogGrowthCourseDashboard'));

// AutoScale
const AutoScaleMarketplace = lazy(() => import('./pages/merchant/AutoScaleMarketplace'));
const AutoScaleSalesPage = lazy(() => import('./pages/partner/AutoScaleSalesPage'));

// StoryLab
const StoryLabCheckoutSuccess = lazy(() => import('./pages/storylab/CheckoutSuccess'));
const StoryLabCheckoutCancel = lazy(() => import('./pages/storylab/CheckoutCancel'));

// Partner Milestones & Progress
const PartnerProgressPage = lazy(() => import('./pages/partner/PartnerProgressPage'));
const PartnerBadgesPage = lazy(() => import('./pages/partner/PartnerBadgesPage'));
const PartnerCertificationsPage = lazy(() => import('./pages/partner/PartnerCertificationsPage'));
const PartnerOutreachLogPage = lazy(() => import('./pages/partner/PartnerOutreachLogPage'));

// Admin Badge Management
const AdminBadgesManager = lazy(() => import('./pages/admin/AdminBadgesManager'));
const AdminPartnerBadgesPage = lazy(() => import('./pages/admin/AdminPartnerBadgesPage'));
const AdminSystemEventsPage = lazy(() => import('./pages/admin/AdminSystemEventsPage'));

// Admin Course Management
const AdminCoursesList = lazy(() => import('./pages/admin/AdminCoursesList'));
const AdminCourseEditor = lazy(() => import('./pages/admin/AdminCourseEditor'));
const CreativeManager = lazy(() => import('./pages/admin/CreativeManager'));
const WeeklyWinnersFeed = lazy(() => import('./pages/partner/WeeklyWinnersFeed'));
const PartnerCampaignsDashboard = lazy(() => import('./pages/partner/PartnerCampaignsDashboard'));

// Marketplace Routes
const MarketplaceHome = lazy(() => import('./pages/marketplace/MarketplaceHome'));
const ProductDetail = lazy(() => import('./pages/marketplace/ProductDetail'));
const CheckoutSuccess = lazy(() => import('./pages/marketplace/CheckoutSuccess'));
const FinancialEnginePage = lazy(() => import('./pages/marketplace/FinancialEnginePage'));
const BusinessDealsHub = lazy(() => import('./pages/marketplace/BusinessDealsHub'));

// Executive Solutions
const ExecutiveSolutions = lazy(() => import('./pages/merchant/ExecutiveSolutions'));
const NetworkNavigatorsPage = lazy(() => import('./pages/merchant/NetworkNavigatorsPage'));
const PartnerExecutiveSolutions = lazy(() => import('./pages/partner/PartnerExecutiveSolutions'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
  </div>
);

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function InternalTeamRoute({ children }: { children: React.ReactNode }) {
  const { teamMember, loading } = useInternalTeamAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!teamMember) {
    return <Navigate to="/internal/login" replace />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { adminUser, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
      </div>
    );
  }

  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
      <Route path="/business" element={<ForBusinesses />} />
      <Route path="/business/pricing" element={<BusinessPricing />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/about" element={<About />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/earn" element={<EarnHub />} />
      <Route path="/join" element={<JoinPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/unified-login" element={user ? <Navigate to="/dashboard" replace /> : <UnifiedLogin />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />

      {/* Marketplace Routes - Public */}
      <Route path="/marketplace" element={<MarketplaceHome />} />
      <Route path="/marketplace/products/:slug" element={<ProductDetail />} />
      <Route path="/marketplace/financial-engine" element={<FinancialEnginePage />} />
      <Route path="/marketplace/business-deals" element={<BusinessDealsHub />} />
      <Route path="/marketplace/checkout/success" element={<CheckoutSuccess />} />

      {/* StoryLab Routes - Public */}
      <Route path="/storylab/kids/checkout/success" element={<StoryLabCheckoutSuccess />} />
      <Route path="/storylab/teen/checkout/success" element={<StoryLabCheckoutSuccess />} />
      <Route path="/storylab/adult/checkout/success" element={<StoryLabCheckoutSuccess />} />
      <Route path="/storylab/kids/checkout/cancel" element={<StoryLabCheckoutCancel />} />
      <Route path="/storylab/teen/checkout/cancel" element={<StoryLabCheckoutCancel />} />
      <Route path="/storylab/adult/checkout/cancel" element={<StoryLabCheckoutCancel />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {profile?.role === 'customer' && <Navigate to="/pulse" replace />}
            {profile?.role === 'merchant' && <Navigate to="/merchant/dashboard" replace />}
            {profile?.role === 'admin' && <Navigate to="/admin/dashboard" replace />}
            {profile?.role === 'partner' && <Navigate to="/partner/dashboard" replace />}
          </ProtectedRoute>
        }
      />

      <Route path="/r/:landingSlug" element={<ReferralLandingPage />} />
      <Route path="/ref/:referralSlug" element={<PartnerReferralLandingPage />} />

      <Route path="/deals" element={<Navigate to="/pulse" replace />} />

      <Route
        path="/deal/:id"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <DealDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout/:id"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment/status"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <PaymentStatusPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/purchase/:id"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <PurchaseConfirmationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/purchases"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <PurchasesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/favorites"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <FavoritesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="/pulse" element={<PulseFeedPage />} />

      <Route
        path="/pulse/leaderboard"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <PulseLeaderboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pulse/referral"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <PulseReferralPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/dashboard"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <MerchantDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/onboarding"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <MerchantOnboarding />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/deals"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <MerchantDealsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/deals/new"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <CreateDealPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/redemptions"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <RedemptionPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/pulse"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <MerchantPulseDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/crm-migration"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <CRMMigrationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/ai-bots"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AIBotsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/ai-quote-assistant"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AIQuoteAssistantPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/ai-review-responder"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AIReviewResponderPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/ai-social-media"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AISocialMediaPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/ai-email-composer"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AIEmailComposerPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/ai-ad-copy"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AIAdCopyWriterPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/ai-appointment-scheduler"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AIAppointmentSchedulerPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/ai-lead-qualifier"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AILeadQualifierPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/ai-follow-up-automation"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AIFollowUpAutomationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/ai-invoice-reminder"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AIInvoiceReminderPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/ai-customer-retention"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AICustomerRetentionPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/ai-reputation-monitor"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AIReputationMonitorPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/ai-proposal-generator"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AIProposalGeneratorPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/ai-suite-packages"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AISuitePackagesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/ai-marketing-funnels"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AIMarketingFunnelsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/ai-content-calendar"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AIContentCalendarPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/ai-chatbot-builder"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AIChatbotBuilderPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/swipe-file"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <SwipeFilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/swipe-file/templates"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <SwipeFileTemplatesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/swipe-file/landing-page-checkout"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <LandingPageCheckoutPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/swipe-file/landing-page-processing"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <LandingPageProcessingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/websites"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <WebsitesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/websites/intake"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <WebsiteIntakeForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/printing"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <PrintingServicesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/printing/design-service"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <DesignServiceCheckoutPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/printing/design-service/confirmation"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <DesignServiceConfirmationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/leads"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <LeadsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/appointment-setting"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AppointmentSettingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/hire"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <HireJobsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/services/appointment-setting"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AppointmentSettingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/services/appointment-setting/checkout"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AppointmentSettingCheckoutPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/services/appointment-setting/confirmation"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AppointmentSettingConfirmationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/merchant-services"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <MerchantServicesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/merchant-services/application"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <MerchantApplicationPage />
          </ProtectedRoute>
        }
      />


      <Route
        path="/merchant/recruiting"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <RecruitingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/recruiting/job-templates-checkout"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <JobTemplatesCheckoutPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/recruiting/job-templates-confirmation"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <JobTemplatesConfirmationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/recruiting/resume-writing-checkout"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <ResumeWritingCheckoutPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/recruiting/resume-writing-confirmation"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <ResumeWritingConfirmationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/recruiting/hiring-funnel-checkout"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <HiringFunnelCheckoutPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/recruiting/hiring-funnel-confirmation"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <HiringFunnelConfirmationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/crm-marketplace"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <CRMMarketplacePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/crm-dashboard"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <CRMDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/invoices"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <InvoicingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/invoices/new"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <CreateInvoicePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/crm"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <CRMPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/crm-integration"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <CRMIntegrationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/crm/contacts"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <CRMContactsList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/crm/contacts/new"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <CRMContactNew />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/crm/contacts/:id"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <CRMContactDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/crm/pipeline"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <CRMPipeline />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/crm/tasks"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <CRMTasks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/crm/reports"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <CRMReports />
          </ProtectedRoute>
        }
      />


      <Route
        path="/merchant/postcards"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <PostcardsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/postcards/checkout"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <PostcardCheckoutPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/postcards/confirmation"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <PostcardConfirmationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/reviews"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <ReviewsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/referrals"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <CustomerReferralDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/referrals/settings"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <CustomerReferralSettings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/referrals/cards"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <ReferralPrintCards />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/referrals/cards/print/5x7"
        element={<ReferralPrint5x7 />}
      />

      <Route
        path="/merchant/referrals/cards/print/letter"
        element={<ReferralPrintLetter />}
      />

      <Route
        path="/merchant/marketing"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <MarketingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/analytics"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/executive-solutions"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <ExecutiveSolutions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchant/network-navigators"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <NetworkNavigatorsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/accounting/lite"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AccountingLitePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/accounting/pro"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AccountingProPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/partner/accounting"
        element={
          <ProtectedRoute allowedRoles={['partner']}>
            <PartnerAccountingProPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/ai-bots"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AIBotsMarketplacePageMerchant />
          </ProtectedRoute>
        }
      />

      <Route
        path="/partner/ai-bots"
        element={
          <ProtectedRoute allowedRoles={['partner']}>
            <AIBotsMarketplacePagePartner />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/academy"
        element={
          <ProtectedRoute allowedRoles={['merchant', 'partner']}>
            <AcademyMarketplace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/webinar-academy"
        element={
          <ProtectedRoute allowedRoles={['merchant', 'partner']}>
            <MerchantWebinarAcademy />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/autoscale"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AutoScaleMarketplace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/settings"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/support"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <SupportPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/payment-settings"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <PaymentSettingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/upgrade"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <UpgradePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/tier-upgrade/checkout"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <TierUpgradeCheckout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/tier-upgrade/success"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <TierUpgradeSuccess />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/addons"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AddonsMarketplace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/addons/checkout"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AddonCheckoutPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/addons/success"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <AddonSuccessPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/subscription/checkout"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <SubscriptionCheckoutPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/subscription/payment-complete"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <SubscriptionPaymentCompletePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/swipe-file/checkout"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <SwipeFileCheckoutPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/swipe-file/payment-complete"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <SwipeFilePaymentCompletePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/ugc-request"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <UGCRequestPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/ugc-orders"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <UGCOrdersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/communications"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <CommunicationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/communications/activate"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <CommunicationsActivationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/email/activate"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <EmailActivationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/vapi/configure"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <VapiConfigurationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/communications/checkout"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <CommunicationsCheckoutPageMerchant />
          </ProtectedRoute>
        }
      />

      <Route
        path="/partner/communications/checkout"
        element={
          <ProtectedRoute>
            <CommunicationsCheckoutPagePartner />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/business-coach"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <BusinessCoachPageMerchant />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/coaching/checkout"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <BusinessCoachCheckoutMerchant />
          </ProtectedRoute>
        }
      />

      <Route
        path="/partner/business-coach"
        element={
          <ProtectedRoute>
            <BusinessCoachPagePartner />
          </ProtectedRoute>
        }
      />

      <Route
        path="/partner/coaching/checkout"
        element={
          <ProtectedRoute>
            <BusinessCoachCheckoutPartner />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/done-for-you"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <DFYHub />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/done-for-you/bundle-:slug"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <BundleProductPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/done-for-you/:slug"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <DFYProductDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/done-for-you/:slug/onboarding"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <DFYOnboardingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant/done-for-you/orders/:orderId"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <DFYOrderStatusPage />
          </ProtectedRoute>
        }
      />

      <Route path="/creator/apply" element={<CreatorApplicationPage />} />

      <Route
        path="/creator/dashboard"
        element={
          <ProtectedRoute>
            <CreatorDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/creator/wallet"
        element={
          <ProtectedRoute>
            <CreatorWalletPage />
          </ProtectedRoute>
        }
      />

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin/dashboard" element={<AdminRoute><EnhancedAdminDashboard /></AdminRoute>} />
      <Route path="/admin/pulse" element={<AdminRoute><AdminPulseDashboard /></AdminRoute>} />
      <Route path="/admin/badges" element={<AdminRoute><AdminBadgesManager /></AdminRoute>} />
      <Route path="/admin/partner-badges" element={<AdminRoute><AdminPartnerBadgesPage /></AdminRoute>} />
      <Route path="/admin/system-events" element={<AdminRoute><AdminSystemEventsPage /></AdminRoute>} />
      <Route path="/admin/partner-applications" element={<AdminRoute><PartnerApplications /></AdminRoute>} />
      <Route path="/admin/partner-manager" element={<AdminRoute><AdminPartnerManager /></AdminRoute>} />
      <Route path="/admin/analytics" element={<AdminRoute><PartnerAnalytics /></AdminRoute>} />
      <Route path="/admin/territories" element={<AdminRoute><TerritoryManagement /></AdminRoute>} />
      <Route path="/admin/territories/create" element={<AdminRoute><TerritoryCreationPage /></AdminRoute>} />
      <Route path="/admin/territories/inactivity" element={<AdminRoute><InactivityScannerPage /></AdminRoute>} />
      <Route path="/admin/expansion-requests" element={<AdminRoute><ExpansionReviewPage /></AdminRoute>} />
      <Route path="/admin/merchant-applications" element={<AdminRoute><MerchantApplicationsAdmin /></AdminRoute>} />
      <Route path="/admin/ugc" element={<AdminRoute><UGCManagementPage /></AdminRoute>} />
      <Route path="/admin/affiliate-commissions" element={<AdminRoute><AdminAffiliateCommissions /></AdminRoute>} />
      <Route path="/admin/affiliate-products" element={<AdminRoute><AdminProductsRatesPage /></AdminRoute>} />
      <Route path="/admin/platform-vapi" element={<AdminRoute><PlatformVapiConfig /></AdminRoute>} />
      <Route path="/admin/jobs" element={<AdminRoute><AdminJobsPage /></AdminRoute>} />
      <Route path="/admin/jobs/:job_id" element={<AdminRoute><AdminJobDetailPage /></AdminRoute>} />
      <Route path="/admin/deliverables-review" element={<AdminRoute><AdminDeliverablesReview /></AdminRoute>} />
      <Route path="/admin/executive-dashboard" element={<AdminRoute><ExecutiveDashboardV2 /></AdminRoute>} />
      <Route path="/admin/budget-buster" element={<AdminRoute><BudgetBusterAnalytics /></AdminRoute>} />
      <Route path="/admin/crm" element={<AdminRoute><AdminCRMDashboard /></AdminRoute>} />
      <Route path="/admin/accounting" element={<AdminRoute><AccountingDashboard /></AdminRoute>} />
      <Route path="/admin/business-dashboard" element={<AdminRoute><BusinessDashboard /></AdminRoute>} />
      <Route path="/admin/commission-payouts" element={<AdminRoute><CommissionPayoutsPage /></AdminRoute>} />
      <Route path="/admin/1099-manager" element={<AdminRoute><Admin1099Manager /></AdminRoute>} />
      <Route path="/admin/dash/local-link" element={<AdminRoute><LocalLinkDashboard /></AdminRoute>} />
      <Route path="/admin/dash/external" element={<AdminRoute><ExternalBusinessesDashboard /></AdminRoute>} />
      <Route path="/admin/top-partners" element={<AdminRoute><TopPartnersPage /></AdminRoute>} />
      <Route path="/admin/taxes/quarterly" element={<AdminRoute><QuarterlyTaxEstimatesPage /></AdminRoute>} />
      <Route path="/admin/dfy/orders" element={<AdminRoute><AdminDFYOrdersPage /></AdminRoute>} />
      <Route path="/admin/dfy/orders/:orderId" element={<AdminRoute><AdminDFYOrderDetailPage /></AdminRoute>} />
      <Route path="/admin/commissions" element={<AdminRoute><AdminCommissionsPage /></AdminRoute>} />
      <Route path="/admin/academy/modules" element={<AdminRoute><AcademyModulesPage /></AdminRoute>} />
      <Route path="/admin/academy/lessons" element={<AdminRoute><AcademyLessonsPage /></AdminRoute>} />
      <Route path="/admin/academy/exam-questions" element={<AdminRoute><AcademyExamQuestionsPage /></AdminRoute>} />
      <Route path="/admin/academy/product-mapping" element={<AdminRoute><AcademyProductMapping /></AdminRoute>} />
      <Route path="/admin/courses" element={<AdminRoute><AdminCoursesList /></AdminRoute>} />
      <Route path="/admin/courses/:courseId" element={<AdminRoute><AdminCourseEditor /></AdminRoute>} />
      <Route path="/admin/creatives" element={<AdminRoute><CreativeManager /></AdminRoute>} />
      <Route path="/admin/stripe/sku-manager" element={<AdminRoute><StripeSKUManager /></AdminRoute>} />

      <Route path="/team/dashboard" element={<TeamDashboard />} />
      <Route path="/team/manager" element={<ManagerDashboard />} />
      <Route path="/team/companies" element={<CompaniesPage />} />
      <Route path="/team/contacts" element={<ContactsPage />} />
      <Route path="/team/tasks" element={<TasksPage />} />

      <Route path="/affiliate/dashboard" element={
        <ProtectedRoute>
          <MarketplaceAffiliateDashboard />
        </ProtectedRoute>
      } />

      <Route path="/affiliate/products" element={
        <ProtectedRoute>
          <MarketplaceAffiliateProducts />
        </ProtectedRoute>
      } />

      <Route path="/affiliate/earnings" element={
        <ProtectedRoute>
          <MarketplaceAffiliateEarnings />
        </ProtectedRoute>
      } />

      <Route path="/internal/login" element={<InternalTeamLogin />} />

      <Route
        path="/internal/dashboard"
        element={
          <InternalTeamRoute>
            <InternalDashboard />
          </InternalTeamRoute>
        }
      />

      <Route
        path="/internal/command-center"
        element={
          <InternalTeamRoute>
            <AdminCommandCenter />
          </InternalTeamRoute>
        }
      />

      <Route
        path="/internal/customers"
        element={
          <InternalTeamRoute>
            <InternalCustomersPage />
          </InternalTeamRoute>
        }
      />

      <Route
        path="/internal/sales"
        element={
          <InternalTeamRoute>
            <InternalSalesPage />
          </InternalTeamRoute>
        }
      />

      <Route
        path="/internal/invoices"
        element={
          <InternalTeamRoute>
            <InternalInvoicingPage />
          </InternalTeamRoute>
        }
      />

      <Route
        path="/internal/support"
        element={
          <InternalTeamRoute>
            <InternalSupportPage />
          </InternalTeamRoute>
        }
      />

      <Route
        path="/internal/accounting"
        element={
          <InternalTeamRoute>
            <InternalAccountingPage />
          </InternalTeamRoute>
        }
      />

      <Route
        path="/internal/ai-bots"
        element={
          <InternalTeamRoute>
            <AIBotsMarketplacePageInternal />
          </InternalTeamRoute>
        }
      />

      <Route
        path="/internal/businesses"
        element={
          <InternalTeamRoute>
            <InternalBusinessUnitsPage />
          </InternalTeamRoute>
        }
      />

      <Route
        path="/internal/api-integration"
        element={
          <InternalTeamRoute>
            <APIIntegrationPage />
          </InternalTeamRoute>
        }
      />

      <Route
        path="/internal/marketing"
        element={
          <InternalTeamRoute>
            <MarketingCampaignsPage />
          </InternalTeamRoute>
        }
      />

      <Route path="/partner/expansion" element={<ExpansionRequestPage />} />

      <Route path="/partners/apply" element={<PartnerApplication />} />

      <Route path="/earn" element={<EarnLanding />} />

      <Route path="/earn/wizard" element={
        <ProtectedRoute>
          <EarnWizard />
        </ProtectedRoute>
      } />

      <Route path="/partner/dashboard" element={
        <ProtectedRoute>
          <PartnerDashboard />
        </ProtectedRoute>
      } />

      <Route path="/partner/executive-solutions" element={
        <ProtectedRoute>
          <PartnerExecutiveSolutions />
        </ProtectedRoute>
      } />

      <Route path="/partner/progress" element={
        <ProtectedRoute>
          <PartnerProgressPage />
        </ProtectedRoute>
      } />

      <Route path="/partner/badges" element={
        <ProtectedRoute>
          <PartnerBadgesPage />
        </ProtectedRoute>
      } />

      <Route path="/partner/certifications" element={
        <ProtectedRoute>
          <PartnerCertificationsPage />
        </ProtectedRoute>
      } />

      <Route path="/partner/outreach-log" element={
        <ProtectedRoute>
          <PartnerOutreachLogPage />
        </ProtectedRoute>
      } />

      <Route path="/partner/command-center" element={
        <ProtectedRoute>
          <PartnerCommandCenter />
        </ProtectedRoute>
      } />

      <Route path="/partner/ai-prompts" element={
        <ProtectedRoute>
          <AIPromptsPage />
        </ProtectedRoute>
      } />

      <Route path="/partner/affiliates" element={
        <ProtectedRoute>
          <AffiliateDashboard />
        </ProtectedRoute>
      } />

      <Route path="/partner/contracts" element={
        <ProtectedRoute>
          <ContractsPage />
        </ProtectedRoute>
      } />

      <Route path="/partner/job-board" element={
        <ProtectedRoute>
          <PartnerJobBoardPage />
        </ProtectedRoute>
      } />

      <Route path="/partner/job-board/:job_id" element={
        <ProtectedRoute>
          <PartnerJobDetailPage />
        </ProtectedRoute>
      } />

      <Route path="/partner/jobs/:jobId/submit" element={
        <ProtectedRoute>
          <PartnerJobSubmitPage />
        </ProtectedRoute>
      } />

      <Route path="/partner/crm" element={
        <ProtectedRoute>
          <PartnerCRMDashboard />
        </ProtectedRoute>
      } />

      <Route path="/partner/crm/upgrade" element={
        <ProtectedRoute>
          <PartnerCRMUpgrade />
        </ProtectedRoute>
      } />

      <Route path="/partner/products" element={
        <ProtectedRoute>
          <PartnerCRMUpgrade />
        </ProtectedRoute>
      } />

      <Route path="/partner/crm/success" element={
        <ProtectedRoute>
          <PartnerCRMSuccess />
        </ProtectedRoute>
      } />

      <Route path="/partner/billing" element={
        <ProtectedRoute>
          <PartnerBillingPage />
        </ProtectedRoute>
      } />

      <Route path="/partner/playbooks" element={
        <ProtectedRoute>
          <PlaybooksPortal />
        </ProtectedRoute>
      } />

      <Route path="/partner/playbooks/:playbookSlug" element={
        <ProtectedRoute>
          <PlaybookDetail />
        </ProtectedRoute>
      } />

      <Route path="/partner/playbooks/:playbookSlug/execute" element={
        <ProtectedRoute>
          <PlaybookExecutor />
        </ProtectedRoute>
      } />

      <Route path="/partner/playbooks/:playbookSlug/lesson/:lessonId" element={
        <ProtectedRoute>
          <PlaybookLessonViewer />
        </ProtectedRoute>
      } />

      <Route path="/partner/profit-network" element={
        <ProtectedRoute>
          <ProfitNetworkPage />
        </ProtectedRoute>
      } />

      <Route path="/partner/profit-network/playbook/:businessId" element={
        <ProtectedRoute>
          <ProfitNetworkPlaybookViewer />
        </ProtectedRoute>
      } />

      <Route path="/partner/profit-network/sales" element={
        <ProtectedRoute>
          <ProfitNetworkSalesPage />
        </ProtectedRoute>
      } />

      <Route path="/partner/training" element={
        <ProtectedRoute>
          <PlaybooksPortal />
        </ProtectedRoute>
      } />

      <Route path="/partner/leaderboard" element={
        <ProtectedRoute>
          <PartnerLeaderboard />
        </ProtectedRoute>
      } />

      <Route path="/partner/7-day-challenge" element={
        <ProtectedRoute>
          <Partner7DayChallenge />
        </ProtectedRoute>
      } />

      <Route path="/partner/dfy-ad-vault" element={
        <ProtectedRoute>
          <IndustryAdVault />
        </ProtectedRoute>
      } />

      <Route path="/partner/onboarding" element={
        <ProtectedRoute>
          <PartnerOnboardingPage />
        </ProtectedRoute>
      } />

      <Route path="/partner/dfy/tools" element={
        <ProtectedRoute allowedRoles={['partner']}>
          <PartnerDFYToolsPage />
        </ProtectedRoute>
      } />

      <Route path="/partner/dfy/ad-vault/:productSlug" element={
        <ProtectedRoute allowedRoles={['partner']}>
          <PartnerDFYAdVaultPage />
        </ProtectedRoute>
      } />

      <Route path="/partner/winners" element={
        <ProtectedRoute allowedRoles={['partner']}>
          <WeeklyWinnersFeed />
        </ProtectedRoute>
      } />
      <Route path="/partner/campaigns" element={
        <ProtectedRoute allowedRoles={['partner']}>
          <PartnerCampaignsDashboard />
        </ProtectedRoute>
      } />
      <Route path="/partner/earnings" element={
        <ProtectedRoute allowedRoles={['partner']}>
          <PartnerEarningsPage />
        </ProtectedRoute>
      } />

      <Route path="/partner/autoscale/sales" element={
        <ProtectedRoute allowedRoles={['partner']}>
          <AutoScaleSalesPage />
        </ProtectedRoute>
      } />

      <Route path="/marketplace/products/online-sales-without-ads" element={<CourseSalesPage />} />
      <Route path="/marketplace/products/online-sales-without-ads/enroll" element={<CourseEnrollmentPage />} />

      <Route path="/marketplace/products/:courseSlug" element={<GenericCourseSalesPage />} />

      <Route path="/academy" element={<AcademyLanding />} />
      <Route path="/academy/:courseSlug" element={<AcademyCourseDetail />} />
      <Route path="/academy/courses/blog-growth-system" element={<BlogGrowthSystemSalesPage />} />
      <Route path="/merchant/courses/blog-growth-system" element={<BlogGrowthSystemSalesPage />} />
      <Route path="/merchant/courses/blog-growth-system/dashboard" element={
        <ProtectedRoute allowedRoles={['merchant']}>
          <BlogGrowthCourseDashboard />
        </ProtectedRoute>
      } />
      <Route path="/merchant/course-checkout" element={
        <ProtectedRoute allowedRoles={['merchant']}>
          <BlogCourseCheckout />
        </ProtectedRoute>
      } />

      <Route
        path="/learn"
        element={
          <ProtectedRoute>
            <MyCourses />
          </ProtectedRoute>
        }
      />

      <Route
        path="/learn/online-sales-without-ads"
        element={
          <ProtectedRoute>
            <CourseDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/learn/online-sales-without-ads/lesson/:lessonId"
        element={
          <ProtectedRoute>
            <LessonViewer />
          </ProtectedRoute>
        }
      />

      <Route path="/academy/courses/partner-accelerator" element={<PartnerAcceleratorSalesPage />} />

      <Route
        path="/academy/courses/partner-accelerator/learn"
        element={
          <ProtectedRoute>
            <PartnerAcceleratorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/academy/courses/partner-accelerator/lesson/:lessonId"
        element={
          <ProtectedRoute>
            <LessonViewer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/learn/:courseSlug"
        element={
          <ProtectedRoute>
            <GenericCourseDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/learn/:courseSlug/lesson/:lessonId"
        element={
          <ProtectedRoute>
            <LessonViewer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/course/:courseSlug"
        element={
          <ProtectedRoute>
            <GenericCourseDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/course/module/:moduleId"
        element={
          <ProtectedRoute>
            <ModuleDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/course/lesson/:lessonId"
        element={
          <ProtectedRoute>
            <LessonViewer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/learn/:courseSlug/exam"
        element={
          <ProtectedRoute>
            <CourseExamPage />
          </ProtectedRoute>
        }
      />

      <Route path="/certificate/:code" element={<CertificatePage />} />

      <Route
        path="/affiliate"
        element={
          <ProtectedRoute>
            <AffiliatePortal />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <DevModeRoleSwitcher />
        <AuthProvider>
          <AttachReferralOnLogin />
          <AdminAuthProvider>
            <InternalTeamAuthProvider>
              <AppRoutes />
            </InternalTeamAuthProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
