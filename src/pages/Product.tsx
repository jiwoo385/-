import React from 'react';
import { motion } from 'motion/react';
import { Cpu, FileDown, Layers, Activity, ShieldCheck, Zap, ChevronRight, Home as HomeIcon, TrendingUp, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, doc, getDoc } from '@/firebase';

const IconMap: Record<string, any> = {
  Zap,
  ShieldCheck,
  Layers,
  Activity,
  Cpu,
  FileDown,
  TrendingUp,
  Lock
};

export default function Product() {
  const [productContent, setProductContent] = React.useState({
    title: 'FuriE Qualified Capital Management',
    subtitle: 'High-Performance Financial Engineering Engine',
    description: "QCM은 오랜 기간 프로젝트로 旣 검증된 제품이며 IFRS 17·9, 신지급여력 제도 및 경영 패러다임 변화에 유연한 대응이 가능한 국내 최고의 솔루션입니다.",
    logo: '',
    logoSize: 100,
    offsetX: 0,
    offsetY: 0,
    brochureUrl: '',
    specs: [
      { label: '목적별 동적 분석 가능한 One Platform', value: 'CUDA 기반 병렬 처리' },
      { label: 'Java 기반의 계층적 아키텍처로 회사별 유연한 커스터마이징 가능', value: 'JSON, XML, CSV, SQL' },
      { label: '인프라 비용 최소화 관점으로 I/O Data 인터페이스를 고려하여 설계된 엔진 구조', value: 'On-Premise / Cloud (AWS, Azure)' },
      { label: '', value: '' },
    ],
    features: [
      { icon: 'Zap', title: "초고속 병렬 연산", desc: "GPU 가속 기술을 활용하여 수백만 건의 시나리오를 수 초 내에 처리합니다." },
      { icon: 'ShieldCheck', title: "정밀한 리스크 측정", desc: "VaR, ES 등 고도화된 리스크 지표를 소수점 단위의 오차 없이 산출합니다." },
      { icon: 'Layers', title: "유연한 확장성", desc: "기존 레거시 시스템과의 완벽한 통합 및 클라우드 환경 최적화를 지원합니다." },
      { icon: 'Activity', title: "실시간 모니터링", desc: "시장 데이터 변화에 따른 포트폴리오 영향을 실시간으로 분석합니다." },
      { icon: 'Cpu', title: "AI 알고리즘 탑재", desc: "머신러닝 기반의 이상 징후 탐지 및 최적화 엔진이 내장되어 있습니다." },
      { icon: 'FileDown', title: "자동화된 리포팅", desc: "분석 결과를 규제 당국 보고 양식에 맞춰 자동으로 생성합니다." }
    ]
  });

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'site', 'product'));
        if (docSnap.exists()) {
          setProductContent(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchProduct();
  }, []);

  const getFileExtension = (url: string) => {
    if (!url) return '.pdf';
    if (url.startsWith('data:')) {
      try {
        const mime = url.split(';')[0].split(':')[1];
        if (mime === 'application/pdf') return '.pdf';
        if (mime.includes('presentationml')) return '.pptx';
        if (mime.includes('powerpoint')) return '.ppt';
        if (mime.includes('wordprocessingml')) return '.docx';
        if (mime.includes('msword')) return '.doc';
      } catch (e) {
        return '.pdf';
      }
    }
    // For regular URLs, try to get extension from path before query params
    try {
      const path = url.split('?')[0];
      const part = path.split('.').pop()?.toLowerCase();
      if (part && ['pdf', 'doc', 'docx', 'ppt', 'pptx'].includes(part)) {
        return `.${part}`;
      }
    } catch (e) {
      return '.pdf';
    }
    return '.pdf';
  };

  return (
    <div className="font-sans">
      {/* Sub-menu Bar */}
      <div className="pt-20 bg-[#f5f5f5] border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-start md:justify-center overflow-x-auto scrollbar-hide">
            {[
              { label: 'Business Area', to: '/product', active: true },
              { label: 'Why FuriE', to: '/why-furie' },
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
            <span className="font-bold">Business Area</span>
          </div>
        </div>
      </div>

      <main className="pb-24">
        {/* Page Title */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 border-b border-gray-100 mb-12">
            <h1 className="text-4xl font-medium text-[#333] tracking-tight">Business Area</h1>
          </div>
        </div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-navy-900 uppercase bg-navy-900/5 rounded-full">
                Core Technology
              </span>
              <h1 
                style={{ fontSize: `${(productContent as any).titleSize || 72}px` }}
                className="font-bold text-navy-900 tracking-tight leading-tight mb-4 whitespace-pre-line"
              >
                {productContent.title}
              </h1>
              {(productContent as any).subtitle && (
                <p className="text-2xl text-navy-700 font-medium mb-8 whitespace-pre-line">
                  {(productContent as any).subtitle}
                </p>
              )}
              <p className="text-xl text-gray-600 mb-10 leading-relaxed whitespace-pre-line">
                {productContent.description}
              </p>
              <div className="flex flex-wrap gap-4">
                {productContent.brochureUrl ? (
                  <a 
                    href={productContent.brochureUrl} 
                    target={productContent.brochureUrl.startsWith('data:') ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-all flex items-center group btn"
                  >
                    <FileDown className="mr-2 h-5 w-5" />
                    상품 소개서 열기
                  </a>
                ) : (
                  <button 
                    onClick={() => alert('등록된 상품소개서가 없습니다. 관리자 페이지에서 업로드해 주세요.')}
                    className="px-8 py-4 bg-gray-200 text-gray-500 rounded-xl font-bold cursor-not-allowed flex items-center"
                  >
                    <FileDown className="mr-2 h-5 w-5" />
                    상품 소개서 준비 중
                  </button>
                )}
                <button className="px-8 py-4 bg-white text-navy-900 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all">
                  기술 사양 확인
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative flex items-center justify-center"
            >
              <div 
                style={{ 
                  transform: `translate(${productContent.offsetX || 0}px, ${productContent.offsetY || 0}px)`,
                }}
                className="relative transition-all duration-300 flex items-center justify-center"
              >
                {productContent.logo ? (
                  <img 
                    key={productContent.logo}
                    src={productContent.logo} 
                    alt="Engine Logo" 
                    style={{ width: `${productContent.logoSize || 100}%`, height: 'auto' }}
                    className="max-w-full object-contain relative z-10" 
                  />
                ) : (
                  <div className="w-64 h-64 bg-navy-900/5 rounded-[4rem] flex items-center justify-center overflow-hidden relative">
                    <Cpu className="w-1/2 h-1/2 text-navy-900 opacity-10 absolute" />
                    <div className="relative z-10 text-center p-12">
                      <div className="text-6xl font-bold text-navy-900 mb-4">10x</div>
                      <p className="text-navy-700 text-lg">기존 엔진 대비 연산 속도 향상</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-gray-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-6">엔진 핵심 기능</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                QCM은 오랜 기간 프로젝트로 旣 검증된 제품이며 IFRS 17·9, 신지급여력 제도 및 경영 패러다임 변화에 유연한 대응이 가능한 국내 최고의 솔루션입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {productContent.features.map((feature, idx) => {
                const Icon = IconMap[feature.icon] || Zap;
                return (
                  <div key={idx} className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-navy-900/5 rounded-xl flex items-center justify-center mb-6">
                      <Icon className="h-6 w-6 text-navy-900" />
                    </div>
                    <h3 className="text-xl font-bold text-navy-900 mb-4 whitespace-pre-line">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Technical Specs */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy-900 rounded-[3rem] overflow-hidden">
            <div className="p-12 lg:p-20 text-white">
              <h2 className="text-3xl font-bold mb-8">기술 사양 및 요구사항</h2>
              <div className="space-y-6">
                {productContent.specs.map((spec, idx) => (
                  <div key={idx} className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-navy-300">{spec.label}</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
