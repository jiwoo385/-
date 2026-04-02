import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Shield, Zap, TrendingUp, ChevronRight, Home as HomeIcon, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, doc, getDoc } from '@/firebase';

export default function WhyFuriE() {
  const [whyFuriEData, setWhyFuriEData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const iconMap: { [key: string]: any } = {
    Shield, Zap, CheckCircle, TrendingUp
  };

  React.useEffect(() => {
    const fetchWhyFuriE = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'site', 'whyfurie'));
        if (docSnap.exists()) {
          setWhyFuriEData(docSnap.data());
        } else {
          // Fallback data
          setWhyFuriEData({
            title: "Why FuriE?",
            description: "FuriE가 제공하는 금융공학 컨설팅은 단순한 기술 지원이 아닙니다. 비즈니스의 본질을 꿰뚫는 분석과 혁신적인 솔루션의 결합입니다.",
            reasons: [
              { icon: 'Shield', title: "검증된 전문성", desc: "은행 및 보험사의 IFRS/리스크 프로젝트를 성공적으로 수행한 독보적인 트랙 레코드를 보유하고 있습니다." },
              { icon: 'Zap', title: "고성능 엔진 기술", desc: "자체 개발한 QCM 엔진은 대규모 데이터를 실시간으로 처리하며, 업계 최고 수준의 계산 속도와 정확도를 자랑합니다." },
              { icon: 'CheckCircle', title: "맞춤형 솔루션", desc: "범용 솔루션이 아닌, 각 금융기관의 특수한 비즈니스 로직과 규제 환경에 최적화된 맞춤형 컨설팅을 제공합니다." },
              { icon: 'TrendingUp', title: "미래 지향적 통찰", desc: "단순한 시스템 구축을 넘어, 급변하는 글로벌 금융 트렌드와 규제 변화를 선제적으로 분석하여 대응 전략을 제시합니다." }
            ],
            stats: [
              { label: "규제 대응 성공률", value: "100%" },
              { label: "기존 엔진 대비 성능 향상", value: "10x" }
            ]
          });
        }
      } catch (error) {
        console.error("Error fetching whyfurie data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWhyFuriE();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-navy-900" />
      </div>
    );
  }

  return (
    <div className="font-sans">
      {/* Sub-menu Bar */}
      <div className="pt-20 bg-[#f5f5f5] border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-start md:justify-center overflow-x-auto scrollbar-hide">
            {[
              { label: 'Business Area', to: '/product' },
              { label: 'Why FuriE', to: '/why-furie', active: true },
              { label: 'Reference', to: '/clients?tab=reference' },
              { label: 'Client', to: '/clients?tab=client' },
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                className={`px-6 md:px-8 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                  item.active 
                    ? 'bg-[#4b2c71] text-white' 
                    : 'text-[#666] hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div>
        <div className="bg-[#1a1a1a] text-white py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center space-x-2 text-sm">
            <Link to="/" className="hover:text-gray-300 flex items-center">
              <HomeIcon className="h-3.5 w-3.5 mr-1" />
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-500" />
            <span className="text-gray-400">Business</span>
            <ChevronRight className="h-3 w-3 text-gray-500" />
            <span className="font-bold">Why FuriE</span>
          </div>
        </div>
      </div>

      <main className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="py-16 border-b border-gray-100 mb-12">
            <h1 className="text-4xl font-medium text-[#333] tracking-tight">Why FuriE</h1>
          </div>

          <div className="text-center mb-20">
            <h1 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-6 whitespace-pre-line">{whyFuriEData?.title}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed whitespace-pre-line">
              {whyFuriEData?.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            {whyFuriEData?.reasons?.map((reason: any, idx: number) => {
              const Icon = iconMap[reason.icon] || CheckCircle;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-10 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl hover:border-navy-900/10 transition-all group"
                >
                  <div className="w-14 h-14 bg-navy-900 text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy-900 mb-4 whitespace-pre-line">{reason.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                    {reason.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Stats Section */}
          <div className="bg-navy-900 rounded-[3rem] p-12 lg:p-20 text-white text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {whyFuriEData?.stats?.map((stat: any, idx: number) => (
                <div key={idx}>
                  <div className="text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-navy-200 uppercase tracking-widest text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
