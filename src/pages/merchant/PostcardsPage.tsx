import { useNavigate } from 'react-router-dom';
import { Mail, MapPin, Star, TrendingUp } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../components/ui/BackButton';

export default function PostcardsPage() {
  const navigate = useNavigate();

  const placements = [
    {
      type: 'Value Placement',
      price: 299,
      features: ['Standard spot', '5,000 homes', 'Your deal featured', 'QR code tracking', 'Performance analytics'],
      color: 'blue'
    },
    {
      type: 'Standard Placement',
      price: 499,
      features: ['Better visibility', '5,000 homes', 'Larger ad space', 'Priority placement', 'QR code tracking'],
      color: 'purple',
      popular: true
    },
    {
      type: 'Premium Placement',
      price: 799,
      features: ['Front page feature', '5,000 homes', 'Maximum visibility', 'First position', 'Dedicated analytics'],
      color: 'orange'
    },
    {
      type: 'Solo',
      price: 2500,
      features: ['Exclusive mailing', '5,000 homes', 'Full postcard design', 'No competition', 'Premium tracking', 'Highest impact'],
      color: 'emerald',
      exclusive: true
    }
  ];

  return (
    <BusinessHubLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Postcard Advertising</h1>
          <p className="text-slate-600 mt-2">
            Get your business in front of 5,000 local households every month
          </p>
        </div>

        <Card variant="bordered" className="bg-gradient-to-br from-[#2BB673]/5 to-[#25a062]/5">
          <CardBody>
            <div className="flex items-center justify-between">
              <div className="flex items-start flex-1">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-[#2BB673]/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#2BB673]" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Next Mailing: February 15th
                  </h3>
                  <p className="text-slate-600 mb-2">
                    Book your spot by February 8th to be included in the next postcard mailing
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      5,000 homes
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      4 spots remaining
                    </div>
                  </div>
                </div>
              </div>
              <Button className="bg-[#2BB673] hover:bg-[#25a062]">
                Book Spot Now
              </Button>
            </div>
          </CardBody>
        </Card>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Choose Your Placement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {placements.map((placement) => (
              <Card
                key={placement.type}
                variant="bordered"
                className={`${placement.popular ? 'ring-2 ring-[#2BB673] relative' : ''} ${placement.exclusive ? 'ring-2 ring-amber-500 relative' : ''}`}
              >
                {placement.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#2BB673] text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                {placement.exclusive && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Exclusive
                    </span>
                  </div>
                )}
                <CardHeader>
                  <div className={`w-12 h-12 bg-${placement.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                    <Star className={`w-6 h-6 text-${placement.color}-600`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{placement.type}</h3>
                  <p className="text-3xl font-bold text-[#2BB673] mt-2">${placement.price.toLocaleString()}</p>
                  <p className="text-sm text-slate-500 mt-1">Per mailing</p>
                </CardHeader>
                <CardBody>
                  <ul className="space-y-2 mb-4">
                    {placement.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-slate-600">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    fullWidth
                    variant={placement.popular || placement.exclusive ? 'default' : 'outline'}
                    onClick={() => navigate('/merchant/postcards/checkout', {
                      state: {
                        placement: placement.type,
                        price: placement.price,
                        features: placement.features
                      }
                    })}
                  >
                    Select Placement
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Example Postcard Gallery */}
        <Card variant="bordered">
          <CardHeader>
            <h2 className="text-xl font-bold text-slate-900">See What Your Postcard Could Look Like</h2>
            <p className="text-sm text-slate-600 mt-1">
              Real examples from actual mailings - featuring multiple local businesses
            </p>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="relative group">
                  <img
                    src="/catherine's_spring_card_townsend_&_ashby.png"
                    alt="Example postcard featuring local businesses"
                    className="w-full rounded-lg shadow-lg border-2 border-slate-200 hover:shadow-xl transition-shadow"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded-lg"></div>
                </div>
                <p className="text-sm text-slate-600 text-center">
                  <strong>Front Side:</strong> Multiple business ads with QR codes and contact info
                </p>
              </div>
              <div className="space-y-3">
                <div className="relative group">
                  <img
                    src="/catherine's_spring_card_townsend_&_ashby_(2).png"
                    alt="Example postcard back side with more business ads"
                    className="w-full rounded-lg shadow-lg border-2 border-slate-200 hover:shadow-xl transition-shadow"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded-lg"></div>
                </div>
                <p className="text-sm text-slate-600 text-center">
                  <strong>Back Side:</strong> Additional business features with compelling offers
                </p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">Your Business Could Be Here!</h4>
              <p className="text-sm text-slate-600">
                These postcards reach 5,000 local households every mailing. Choose your placement size and
                visibility level based on your budget and marketing goals. We handle the design, printing,
                and mailing - you just provide your offer and watch the customers come in!
              </p>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="bordered">
            <CardHeader>
              <h2 className="text-xl font-bold text-slate-900">How Postcard Marketing Works</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {[
                  {
                    step: '1',
                    title: 'Choose Your Spot',
                    desc: 'Select value, standard, or premium placement'
                  },
                  {
                    step: '2',
                    title: 'Submit Your Deal',
                    desc: 'We design your ad featuring your marketplace deal'
                  },
                  {
                    step: '3',
                    title: 'We Print & Mail',
                    desc: 'Postcards go to 5,000 local households'
                  },
                  {
                    step: '4',
                    title: 'Track Results',
                    desc: 'See QR scans, website visits, and purchases'
                  }
                ].map((item) => (
                  <div key={item.step} className="flex items-start">
                    <div className="w-8 h-8 bg-[#2BB673] text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <div className="space-y-6">
            <Card variant="bordered" className="bg-blue-50">
              <CardBody>
                <h3 className="font-bold text-slate-900 mb-3">Why Postcard Marketing?</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• 98% of mail gets opened and read</li>
                  <li>• Reach customers not on social media</li>
                  <li>• Physical mail has longer shelf life</li>
                  <li>• Perfect for local targeting</li>
                  <li>• Drive immediate action with QR codes</li>
                  <li>• Build brand awareness in your area</li>
                </ul>
              </CardBody>
            </Card>

            <Card variant="bordered" className="bg-purple-50">
              <CardBody>
                <h3 className="font-bold text-slate-900 mb-3">Performance Tracking</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Every postcard includes a unique QR code so you can track:
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• How many people scanned the code</li>
                  <li>• Visits to your marketplace page</li>
                  <li>• Deal purchases from postcard</li>
                  <li>• ROI and cost per customer</li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>

        <Card variant="bordered" className="bg-gradient-to-br from-orange-50 to-amber-50">
          <CardBody>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Combine Postcard + Digital for Maximum Impact
                </h3>
                <p className="text-slate-600 mb-3">
                  When people see your postcard, follow up with SMS and email campaigns to drive conversions.
                  Add postcard recipients to your loyalty program automatically.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/merchant/loyalty')}
                  >
                    View Drive Repeat Business
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/merchant/swipe-file')}
                  >
                    Get Campaign Templates
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </BusinessHubLayout>
  );
}
