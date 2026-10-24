import { FiTruck, FiShield, FiHeadphones, FiRefreshCw } from 'react-icons/fi';

export default function TrustBadges() {
  const badges = [
    {
      icon: <FiTruck className="text-2xl text-primary-600" />,
      title: 'Fast Island & City Delivery',
      desc: 'Dhaka delivery in 24h, nationwide 2-4 days',
    },
    {
      icon: <FiShield className="text-2xl text-emerald-600" />,
      title: '100% Authentic Products',
      desc: 'Handmade by verified local artisans',
    },
    {
      icon: <FiRefreshCw className="text-2xl text-gold-600" />,
      title: '7-Day Easy Returns',
      desc: 'Hassle-free replacement guarantee',
    },
    {
      icon: <FiHeadphones className="text-2xl text-blue-600" />,
      title: 'WhatsApp & Phone Support',
      desc: 'Friendly customer assistance 7 days a week',
    },
  ];

  return (
    <section className="py-8 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {badges.map((b, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-2.5 rounded-lg bg-gray-50 shrink-0">
                {b.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 leading-snug">{b.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
