import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import QRCode from 'react-qr-code';

export default function ReferralPrint5x7() {
  const [searchParams] = useSearchParams();
  const shareUrl = searchParams.get('share_url') || '';
  const headline = searchParams.get('headline') || 'Refer & Earn';
  const reward = searchParams.get('reward') || '';

  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @page {
          size: 5in 7in;
          margin: 0;
        }
        html, body {
          padding: 0;
          margin: 0;
          width: 5in;
          height: 7in;
        }
        .print-root {
          width: 5in;
          height: 7in;
        }
        .card {
          width: 5in;
          height: 7in;
          padding: 0.4in;
          box-sizing: border-box;
          font-family: ui-sans-serif, system-ui, sans-serif;
        }
        .box {
          border: 2px solid #000;
          border-radius: 18px;
          height: 100%;
          padding: 18px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .title {
          font-size: 28px;
          font-weight: 700;
        }
        .reward {
          margin-top: 8px;
          font-size: 14px;
        }
        .mid {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-top: 18px;
        }
        .scan {
          font-size: 14px;
          font-weight: 600;
        }
        .url {
          font-size: 10px;
          word-break: break-all;
          margin-top: 6px;
        }
        .footer {
          font-size: 10px;
          opacity: 0.8;
        }
        .qr {
          background: #fff;
          padding: 10px;
          border-radius: 16px;
          border: 1px solid #ddd;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      <div className="print-root">
        <div className="card">
          <div className="box">
            <div>
              <div className="title">{headline}</div>
              <div className="reward">{reward}</div>

              <div className="mid">
                <div className="qr">
                  <QRCode value={shareUrl || 'https://example.com'} size={170} />
                </div>
                <div>
                  <div className="scan">Scan to claim your perk</div>
                  <div className="url">{shareUrl}</div>
                </div>
              </div>
            </div>

            <div className="footer">
              Local-Link powered referral program • Print tip: disable headers/footers in print dialog
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
