import React, { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Copy, Download, Share2, QrCode } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface ShareKitData {
  link: string;
  qr_url: string;
  message: string;
  referral_name: string;
  referral_id: string;
}

export default function PartnerShareKitPage() {
  const [data, setData] = useState<ShareKitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    loadShareKit();
  }, []);

  const loadShareKit = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-share-kit`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const result = await response.json();
      if (result.ok) {
        setData(result);
      }
    } catch (error) {
      console.error("Failed to load share kit:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Card className="p-6 text-center">
          <p className="text-gray-600">No share kit available. Please contact support.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Share Kit</h1>
        <p className="text-gray-600">
          Share your link to help businesses get started. Your Referral Name and ID# are automatically included.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Share Link */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Your Share Link</h2>
          </div>
          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              value={data.link}
              readOnly
              className="flex-1 min-w-[400px] px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
            <Button
              onClick={() => copyToClipboard(data.link, "link")}
              variant="outline"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied === "link" ? "Copied!" : "Copy Link"}
            </Button>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Auto-filled:</strong> Referral Name: {data.referral_name} • ID#: {data.referral_id}
            </p>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* QR Code */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <QrCode className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">QR Code</h2>
            </div>
            <div className="flex flex-col items-center">
              <img
                src={data.qr_url}
                alt="QR Code"
                className="w-64 h-64 border-2 border-gray-200 rounded-lg mb-4"
              />
              <div className="flex gap-2 flex-wrap justify-center">
                <Button
                  onClick={() => copyToClipboard(data.qr_url, "qr")}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied === "qr" ? "Copied!" : "Copy QR URL"}
                </Button>
                <Button
                  onClick={() => window.open(data.qr_url, "_blank")}
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </Card>

          {/* Copy/Paste Message */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Copy className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Share Message</h2>
            </div>
            <textarea
              value={data.message}
              readOnly
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono resize-none"
            />
            <div className="mt-4 flex gap-2 flex-wrap">
              <Button
                onClick={() => copyToClipboard(data.message, "message")}
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied === "message" ? "Copied!" : "Copy Message"}
              </Button>
              <Button
                onClick={() => copyToClipboard(
                  `Referral Name: ${data.referral_name}\nReferral ID#: ${data.referral_id}`,
                  "fields"
                )}
                variant="outline"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied === "fields" ? "Copied!" : "Copy Fields Only"}
              </Button>
            </div>
          </Card>
        </div>

        {/* Tips */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Sharing Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Share your link via email, text, or social media</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Print the QR code on business cards or flyers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Use the pre-written message to save time</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Track your referrals in the Partner Dashboard</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
