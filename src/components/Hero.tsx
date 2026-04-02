import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, ShieldCheck, Cpu } from 'lucide-react';
import { db, doc, getDoc } from '@/firebase';

export default function Hero() {
  const [title, setTitle] = React.useState('Bigdata, AI 기반 금융공학 Consulting & Solution Leader');

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'site', 'settings'));
        if (docSnap.exists() && docSnap.data().heroTitle) {
          setTitle(docSnap.data().heroTitle);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-navy-900 uppercase bg-navy-900/5 rounded-full">
              Financial Engineering Excellence
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold text-navy-900 tracking-tight leading-tight mb-8 whitespace-pre-line">
              {title}
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              FuriE는 복잡한 시장 데이터를 수학적 모델로 해석하여 <br className="hidden md:block" />
              위험률차손익 종합관리 시스템에 대한 핵심역량을 보유하고 있으며 전략 & 시스템 구축 컨설팅과 보험손익 관련 다양한 시스템 구축 경험을 보유하고 있습니다..
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact" className="px-8 py-4 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-all flex items-center justify-center group">
                컨설팅 문의하기
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/product" 
                onClick={() => window.scrollTo(0, 0)}
                className="px-8 py-4 bg-white text-navy-900 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center"
              >
                서비스 더보기
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: TrendingUp, title: "위험률차 종합관리 시스템구축", desc: "국내손해보험 장기보험 경험통계(위험률)시스템 구축 경험 보유" },
            { icon: ShieldCheck, title: "전략&시스템구축 컨설팅", desc: "경험위험률 적정성 검증, 프로세스 및 거버넌스 컨설팅" },
            { icon: Cpu, title: "기타 인프라 구축", desc: "EUS 보험계약 자동심사 시스템" }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
              className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-navy-900/5 rounded-xl flex items-center justify-center mb-6">
                <item.icon className="h-6 w-6 text-navy-900" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-navy-900/5 to-transparent opacity-50 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-1/3 h-1/2 bg-gradient-to-tr from-navy-900/5 to-transparent opacity-50 blur-3xl"></div>
    </section>
  );
}
