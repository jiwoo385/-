import React from 'react';
import { motion } from 'motion/react';
import { History, Award, Target, ChevronRight, Home as HomeIcon, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, doc, getDoc } from '@/firebase';

export default function About() {
  const [aboutData, setAboutData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAbout = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'site', 'about'));
        if (docSnap.exists()) {
          setAboutData(docSnap.data());
        } else {
          // Fallback data
          setAboutData({
            title: "About FuriE",
            description: "자체 솔루션을 보유한 FuriE은 다수 프로젝트 성공 경험에서 축적된 시스템 구축 Know-How를 바탕으로 전문적이고 유연한 컨설팅 서비스를 제공드립니다.",
            imageUrl: "",
            timeline: [
              { year: '2026', title: '글로벌 금융공학 리딩 컴퍼니 도약', desc: '해외 시장 진출 및 글로벌 파트너십 체결' },
              { year: '2024', title: '차세대 리스크 관리 엔진 V3 출시', desc: 'AI 기반 정밀 분석 알고리즘 탑재' },
              { year: '2022', title: '금융감독원 IFRS 프로젝트 수행', desc: '공공기관 및 대형 금융사 컨설팅 수주' },
              { year: '2020', title: 'FuriE 설립', desc: '금융공학 전문가 그룹으로 시작' },
            ]
          });
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
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
      {/* Breadcrumb Bar */}
      <div className="pt-20">
        <div className="bg-[#1a1a1a] text-white py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center space-x-2 text-sm">
            <Link to="/" className="hover:text-gray-300 flex items-center">
              <HomeIcon className="h-3.5 w-3.5 mr-1" />
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-500" />
            <span className="font-bold">About Us</span>
          </div>
        </div>
      </div>

      <main className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="py-16 border-b border-gray-100 mb-12">
            <h1 className="text-4xl font-medium text-[#333] tracking-tight">About Us</h1>
          </div>

          <div className="text-center mb-20">
            <h1 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-6 whitespace-pre-line">{aboutData?.title}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed whitespace-pre-line">
              {aboutData?.description}
            </p>
            {aboutData?.imageUrl && (
              <div className="mt-16 rounded-3xl overflow-hidden shadow-xl border border-gray-100 max-w-5xl mx-auto">
                <img 
                  src={aboutData.imageUrl} 
                  alt="About FuriE" 
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>

          {/* Vision/Mission */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
            {[
              { icon: Target, title: "Mission", desc: "복잡한 금융 시장을 명확한 모델로 해석하여 최적의 의사결정을 지원합니다." },
              { icon: Award, title: "Vision", desc: "글로벌 표준을 선도하는 금융공학 솔루션 파트너가 되겠습니다." },
              { icon: History, title: "Values", desc: "정밀함, 신뢰, 혁신을 바탕으로 고객의 성장을 최우선으로 합니다." }
            ].map((item, idx) => (
              <div key={idx} className="text-center p-8 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-16 h-16 bg-navy-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-px bg-gray-200 hidden md:block"></div>
            <div className="space-y-16">
              {aboutData?.timeline?.map((item: any, idx: number) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`flex flex-col md:flex-row items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="flex-1 w-full md:w-1/2 px-8">
                    <div className={`p-8 rounded-2xl bg-white border border-gray-100 shadow-sm ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <span className="text-3xl font-bold text-navy-700 mb-2 block">{item.year}</span>
                      <h4 className="text-xl font-bold text-navy-900 mb-3 whitespace-pre-line">{item.title}</h4>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">{item.desc}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-navy-900 rounded-full relative z-10 my-4 md:my-0"></div>
                  <div className="flex-1 hidden md:block"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
