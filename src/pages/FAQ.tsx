import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';
import BackButton from '../components/ui/BackButton';
import { SEO } from '../components/SEO';

export default function FAQ() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const customerFaqs = [
    {
      question: 'Do I need to print anything?',
      answer: 'No! All deals are completely digital. After purchase, you\'ll receive a QR code via email and in your account. Just show it on your phone when you redeem.'
    },
    {
      question: 'How do I redeem a deal?',
      answer: 'Simply show your QR code to the business when you visit. They\'ll scan it with their phone or device, and your deal will be applied instantly. It\'s that easy!'
    },
    {
      question: 'What if a business doesn\'t honor a deal?',
      answer: 'Contact us immediately through our support page. We take this seriously and will work with both you and the business to resolve the issue. We stand behind every deal on our platform.'
    },
    {
      question: 'Do deals expire?',
      answer: 'Yes, each deal has an expiration date clearly listed on the deal page. Make sure to redeem your deal before it expires. You can always check expiration dates in your account under "My Deals".'
    },
    {
      question: 'Can I share my deal with someone else?',
      answer: 'Deals are non-transferable and tied to your account. However, you can purchase multiple deals if you\'d like to treat friends or family.'
    },
    {
      question: 'How do loyalty points work?',
      answer: 'You earn points with every purchase and redemption. Points can be used for exclusive VIP deals and special offers. The more you use Local Link, the more you save!'
    }
  ];

  const businessFaqs = [
    {
      question: 'How much does it cost to join?',
      answer: 'We offer three tiers: Founders ($249/month - limited time), Standard ($299/month), and Premium ($349/month). All plans include postcard placement, Marketplace listing, and promotional support. No setup fees or long-term contracts.'
    },
    {
      question: 'How are commissions calculated?',
      answer: 'We take 20-35% commission on each deal sold, meaning you keep 65-80% of every sale. This is much fairer than traditional deal platforms that take 50-70%. You set your commission rate when creating your deal.'
    },
    {
      question: 'When do I get paid?',
      answer: 'Payouts are processed weekly via Stripe. You\'ll receive your earnings from redeemed deals every Thursday, minus the agreed commission. Fast and reliable.'
    },
    {
      question: 'Can I limit the number of deals sold?',
      answer: 'Absolutely! When creating a deal, you can set a maximum quantity. Once that number is reached, the deal automatically closes. This gives you full control over your inventory and capacity.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes. All subscriptions are month-to-month with no long-term commitment. If you cancel, your service continues through the current billing cycle. No penalties or prorated refunds.'
    },
    {
      question: 'What data do I get from customers?',
      answer: 'You receive the customer\'s email and phone number when they redeem a deal. This allows you to build your own customer list for future marketing and relationship building.'
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <SEO
        title="FAQ - Questions About Deals, Redemption & Business Services"
        description="Get answers to common questions about using LocalLink deals, QR code redemption, business services, commissions, and more. Support for customers and merchants."
        keywords="local deals faq, how to redeem deals, business commission questions, qr code help, deal expiration"
        canonical="https://locallink.com/faq"
      />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => navigate('/')} className="flex items-center space-x-2">
              <span className="text-xl font-bold text-slate-900">LocalLink</span>
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                Sign In
              </button>
              <Button onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-slate-600">
              Find answers to common questions about Local Link Marketplace
            </p>
          </div>

          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">For Shoppers</h2>
              <div className="space-y-4">
                {customerFaqs.map((faq, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardBody
                      className="p-0"
                      onClick={() => toggleFaq(index)}
                    >
                      <button className="w-full px-6 py-4 flex justify-between items-center text-left">
                        <span className="font-semibold text-slate-900">{faq.question}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-600 transition-transform ${
                            openIndex === index ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>
                      {openIndex === index && (
                        <div className="px-6 pb-4 text-slate-600">
                          {faq.answer}
                        </div>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">For Merchants</h2>
              <div className="space-y-4">
                {businessFaqs.map((faq, index) => {
                  const faqIndex = customerFaqs.length + index;
                  return (
                    <Card key={faqIndex} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardBody
                        className="p-0"
                        onClick={() => toggleFaq(faqIndex)}
                      >
                        <button className="w-full px-6 py-4 flex justify-between items-center text-left">
                          <span className="font-semibold text-slate-900">{faq.question}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-slate-600 transition-transform ${
                              openIndex === faqIndex ? 'transform rotate-180' : ''
                            }`}
                          />
                        </button>
                        {openIndex === faqIndex && (
                          <div className="px-6 pb-4 text-slate-600">
                            {faq.answer}
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          <Card className="mt-16 bg-gradient-to-br from-[#2BB673] to-[#25a062]">
            <CardBody className="text-center py-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Still Have Questions?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                We're here to help. Reach out to our team and we'll get back to you quickly.
              </p>
              <Button
                size="lg"
                onClick={() => navigate('/')}
                className="bg-white text-[#2BB673] hover:bg-slate-50"
              >
                Contact Support
              </Button>
            </CardBody>
          </Card>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 LocalLink Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>
    </>
  );
}
