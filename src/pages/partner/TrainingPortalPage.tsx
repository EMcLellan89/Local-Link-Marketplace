import { useState, useEffect } from "react";
import { BookOpen, CheckCircle, Copy, Download, Play, ExternalLink } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import BackButton from '../../components/ui/BackButton';

interface TrainingModule {
  slug: string;
  title: string;
  duration: string;
  description: string;
  completed: boolean;
}

interface ProductCategory {
  name: string;
  products: Array<{
    sku: string;
    name: string;
    pitch: string;
    objections: string[];
    demoUrl?: string;
  }>;
}

export default function TrainingPortalPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [affiliate, setAffiliate] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const modules: TrainingModule[] = [
    {
      slug: "quick-start",
      title: "Partner Quick Start",
      duration: "15 min",
      description: "Learn what you can sell, how you get paid, and FTC disclosure basics",
      completed: false,
    },
    {
      slug: "product-cheat-sheets",
      title: "Product Cheat Sheets",
      duration: "20 min",
      description: "Deep dive into CRMs, Marketplace, Courses, and Services",
      completed: false,
    },
    {
      slug: "pitch-objections",
      title: "Pitch & Objections",
      duration: "15 min",
      description: "Handle common objections and master your pitch",
      completed: false,
    },
    {
      slug: "demos-walkthrough",
      title: "Product Demos",
      duration: "30 min",
      description: "Watch 2-5 minute walkthrough videos for each product",
      completed: false,
    },
  ];

  const productCategories: ProductCategory[] = [
    {
      name: "CRMs",
      products: [
        {
          sku: "crm_tradehive",
          name: "TradeHive CRM",
          pitch: "The only CRM built specifically for trades. Stop losing follow-ups and start closing more jobs.",
          objections: [
            "I already use Jobber → TradeHive integrates with your existing tools and adds AI automation",
            "Not right now → That's fine! Can I send you a 2-minute demo for when you're ready?",
          ],
        },
        {
          sku: "crm_adsuite",
          name: "AdSuite CRM",
          pitch: "Built for marketing agencies. Manage clients, campaigns, and reporting in one place.",
          objections: [
            "I use HighLevel → AdSuite is designed specifically for agencies with built-in ROI tracking",
            "Too expensive → You'll save 10+ hours/week. That's worth way more than the monthly cost.",
          ],
        },
      ],
    },
    {
      name: "Marketplace",
      products: [
        {
          sku: "marketplace_pro",
          name: "Marketplace Pro",
          pitch: "Get more repeat customers automatically. Create deals, track loyalty, send postcards.",
          objections: [
            "My customers already come back → Great! This makes it automatic so you can focus on growth",
            "I don't need marketing → This isn't marketing, it's retention. Different game.",
          ],
        },
      ],
    },
    {
      name: "Courses",
      products: [
        {
          sku: "course_lca",
          name: "Local Customer Academy",
          pitch: "Learn how to fill your calendar with high-quality local leads. 20% commission.",
          objections: [
            "I don't have time → That's exactly why you need this. It teaches systems that save time",
            "I tried courses before → This one includes live support and templates you can use today",
          ],
        },
      ],
    },
    {
      name: "Services",
      products: [
        {
          sku: "service_setup",
          name: "CRM Setup & Migration",
          pitch: "We set it up, move your contacts, and train your team. Done in 48 hours.",
          objections: [
            "I can do it myself → You could, but do you have 10-15 hours this week? We handle it all",
            "Too expensive → Consider it an investment. You'll be up and running without the headache",
          ],
        },
      ],
    },
  ];

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);

    const { data: affiliateData } = await supabase
      .from("marketplace_affiliates")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (affiliateData) {
      setAffiliate(affiliateData);

      const { data: progressData } = await supabase
        .from("marketplace_affiliate_training_progress")
        .select("*")
        .eq("marketplace_affiliate_id", affiliateData.id);

      setProgress(progressData || []);
    }

    setLoading(false);
  };

  const markComplete = async (moduleSlug: string) => {
    if (!affiliate) return;

    await supabase
      .from("marketplace_affiliate_training_progress")
      .upsert({
        marketplace_affiliate_id: affiliate.id,
        module_slug: moduleSlug,
        completed_at: new Date().toISOString(),
      });

    loadData();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const completedCount = progress.filter((p) => p.completed_at).length;
  const progressPercent = (completedCount / modules.length) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading training portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner Training Portal</h1>
          <p className="text-gray-600">
            Master the products, perfect your pitch, and start earning commissions
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Progress</h2>
            <span className="text-sm font-medium text-blue-600">
              {completedCount} / {modules.length} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-900">Training Modules</h2>

          {modules.map((module) => {
            const isCompleted = progress.some(
              (p) => p.module_slug === module.slug && p.completed_at
            );

            return (
              <div
                key={module.slug}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <BookOpen className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {module.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                      <span className="text-xs text-gray-500">{module.duration}</span>
                    </div>
                  </div>
                  {!isCompleted && (
                    <button
                      onClick={() => markComplete(module.slug)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900">Product Cheat Sheets</h2>

          {productCategories.map((category) => (
            <div key={category.name} className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{category.name}</h3>

              <div className="space-y-6">
                {category.products.map((product) => {
                  const referralLink = `${window.location.origin}/join?ref=${
                    affiliate?.affiliate_code || "YOUR_CODE"
                  }&product=${product.sku}`;

                  return (
                    <div key={product.sku} className="border-t pt-6 first:border-t-0 first:pt-0">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        {product.name}
                      </h4>

                      <div className="space-y-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <p className="text-sm font-medium text-blue-900 mb-2">Pitch:</p>
                          <p className="text-sm text-blue-800">{product.pitch}</p>
                          <button
                            onClick={() => copyToClipboard(product.pitch, `pitch-${product.sku}`)}
                            className="mt-2 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                          >
                            <Copy className="w-4 h-4" />
                            {copiedItem === `pitch-${product.sku}` ? "Copied!" : "Copy Pitch"}
                          </button>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-900 mb-2">
                            Handling Objections:
                          </p>
                          <ul className="space-y-2">
                            {product.objections.map((objection, idx) => (
                              <li key={idx} className="text-sm text-gray-700">
                                • {objection}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => copyToClipboard(referralLink, `link-${product.sku}`)}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium inline-flex items-center justify-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            {copiedItem === `link-${product.sku}` ? "Copied!" : "Copy Link"}
                          </button>

                          {product.demoUrl && (
                            <a
                              href={product.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium inline-flex items-center gap-2"
                            >
                              <Play className="w-4 h-4" />
                              Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2 flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            FTC Disclosure Reminder
          </h3>
          <p className="text-sm text-yellow-800 mb-3">
            When sharing partner links, please disclose that you may earn a commission. Here's a
            simple way to do it:
          </p>
          <div className="bg-white rounded-lg p-3 mb-3">
            <p className="text-sm text-gray-700 italic">
              "I'm a partner with Local-Link and may earn a commission if you sign up. That said, I
              only recommend tools I truly believe will help your business."
            </p>
          </div>
          <button
            onClick={() =>
              copyToClipboard(
                "I'm a partner with Local-Link and may earn a commission if you sign up. That said, I only recommend tools I truly believe will help your business.",
                "disclosure"
              )
            }
            className="text-sm text-yellow-700 hover:text-yellow-800 font-medium inline-flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            {copiedItem === "disclosure" ? "Copied!" : "Copy Disclosure"}
          </button>
        </div>
      </div>
    </div>
  );
}
