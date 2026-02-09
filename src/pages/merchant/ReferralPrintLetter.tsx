import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import QRCode from 'react-qr-code';

export default function ReferralPrintLetter() {
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

  const MiniCard = () => (
    <div className="mini">
      <div className="mini-title">{headline}</div>
      <div className="mini-reward">{reward}</div>
      <div className="mini-row">
        <div className="mini-qr">
          <QRCode value={shareUrl || 'https://example.com'} size={120} />
        </div>
        <div className="mini-text">
          <div className="mini-scan">Scan to claim your perk</div>
          <div className="mini-url">{shareUrl}</div>
        </div>
      </div>
      <div className="mini-foot">Local-Link powered</div>
    </div>
  );

  return (
    <>
      <style>{`
        @page {
          size: 8.5in 11in;
          margin: 0.35in;
        }
        html, body {
          padding: 0;
          margin: 0;
        }
        .print-root {
          font-family: ui-sans-serif, system-ui, sans-serif;
        }
        .header {
          border: 2px solid #000;
          border-radius: 18px;
          padding: 16px;
        }
        .h1 {
          font-size: 26px;
          font-weight: 800;
        }
        .sub {
          margin-top: 6px;
          font-size: 14px;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 14px;
        }
        .mini {
          border: 2px solid #000;
          border-radius: 16px;
          padding: 12px;
          height: 3.6in;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .mini-title {
          font-size: 18px;
          font-weight: 800;
        }
        .mini-reward {
          margin-top: 6px;
          font-size: 12px;
        }
        .mini-row {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-top: 10px;
        }
        .mini-qr {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 14px;
          padding: 8px;
        }
        .mini-text {
          flex: 1;
        }
        .mini-scan {
          font-size: 12px;
          font-weight: 700;
        }
        .mini-url {
          font-size: 9px;
          word-break: break-all;
          margin-top: 6px;
        }
        .mini-foot {
          font-size: 10px;
          opacity: 0.8;
        }
        .cut {
          margin-top: 10px;
          font-size: 10px;
          opacity: 0.75;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      <div className="print-root">
        <div className="header">
          <div className="h1">{headline}</div>
          <div className="sub">{reward}</div>
          <div className="cut">
            Cut along borders to make mini-cards. Print tip: disable headers/footers in print dialog.
          </div>
        </div>

        <div className="grid">
          <MiniCard />
          <MiniCard />
          <MiniCard />
          <MiniCard />
        </div>
      </div>
    </>
  );
}
