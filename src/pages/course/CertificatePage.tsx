import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Award, CheckCircle, Download, Share2 } from 'lucide-react';
import { SEO } from '../../components/SEO';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

interface CertificateData {
  code: string;
  issued_at: string;
  recipient_name: string;
  course_title: string;
  course_subtitle: string;
}

export default function CertificatePage() {
  const { code } = useParams<{ code: string }>();
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (code) {
      verifyCertificate();
    }
  }, [code]);

  async function verifyCertificate() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-certificate?code=${code}`
      );

      const result = await response.json();

      if (result.valid && result.certificate) {
        setCertificate(result.certificate);
      } else {
        setError('Certificate not found or invalid');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'My Course Certificate',
        text: `I completed ${certificate?.course_title}!`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Certificate link copied to clipboard!');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <>
        <SEO title="Certificate Not Found" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Certificate Not Found
            </h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </>
    );
  }

  const issueDate = new Date(certificate.issued_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <SEO
        title={`Certificate - ${certificate.course_title}`}
        description={`Certificate of completion for ${certificate.recipient_name}`}
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between print:hidden">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              <span className="font-medium">Verified Certificate</span>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleShare} variant="outline">
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
              <Button onClick={handlePrint}>
                <Download className="h-5 w-5 mr-2" />
                Download
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none">
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 p-12 text-white">
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  <pattern
                    id="certificate-pattern"
                    x="0"
                    y="0"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="20" cy="20" r="2" fill="white" />
                  </pattern>
                  <rect width="200" height="200" fill="url(#certificate-pattern)" />
                </svg>
              </div>

              <div className="relative text-center">
                <Award className="h-20 w-20 mx-auto mb-6" />
                <h1 className="text-5xl font-bold mb-2">Certificate</h1>
                <p className="text-xl text-blue-100">of Completion</p>
              </div>
            </div>

            <div className="p-12 text-center">
              <p className="text-lg text-gray-600 mb-4">This certifies that</p>

              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                {certificate.recipient_name}
              </h2>

              <p className="text-lg text-gray-600 mb-4">has successfully completed</p>

              <h3 className="text-3xl font-bold text-blue-600 mb-2">
                {certificate.course_title}
              </h3>

              <p className="text-xl text-gray-600 mb-12">
                {certificate.course_subtitle}
              </p>

              <div className="flex items-center justify-center gap-12 mb-12">
                <div className="text-center">
                  <div className="w-48 border-t-2 border-gray-300 mb-2"></div>
                  <p className="text-sm text-gray-600">Date of Completion</p>
                  <p className="font-medium text-gray-900">{issueDate}</p>
                </div>

                <div className="text-center">
                  <div className="w-48 border-t-2 border-gray-300 mb-2"></div>
                  <p className="text-sm text-gray-600">Certificate ID</p>
                  <p className="font-mono text-sm text-gray-900">{certificate.code}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h4 className="text-lg font-semibold text-gray-900">
                    Verified Certificate
                  </h4>
                </div>
                <p className="text-sm text-gray-600">
                  This certificate can be verified at:{' '}
                  <span className="font-mono text-blue-600">
                    {window.location.href}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 px-12 py-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                  <p className="font-medium text-gray-900 mb-1">Local-Link Marketplace</p>
                  <p>Online Sales Without Ads™ Program</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 mb-1">Verified on Blockchain</p>
                  <p>Tamper-proof certification</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600 print:hidden">
            <p>
              This is an official certificate issued by Local-Link Marketplace.
            </p>
            <p>
              To verify authenticity, visit this page or contact support with certificate ID:{' '}
              <span className="font-mono">{certificate.code}</span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </>
  );
}