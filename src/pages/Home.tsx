import React from 'react';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Experts from '@/components/Experts';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, CheckCircle, TrendingUp, MessageSquare } from 'lucide-react';
import { db, collection, getDocs, limit, query, doc, getDoc, setDoc } from '@/firebase';

export default function Home() {
  const [clients, setClients] = React.useState<any[]>([]);
  const [whyFuriEData, setWhyFuriEData] = React.useState<any>(null);
  const [siteSettings, setSiteSettings] = React.useState<any>(null);

  const iconMap: { [key: string]: any } = {
    Shield, Zap, CheckCircle, TrendingUp
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch site settings
        const settingsSnap = await getDoc(doc(db, 'site', 'settings'));
        if (settingsSnap.exists()) {
          setSiteSettings(settingsSnap.data());
        }

        // Fetch clients
        const clientsSnapshot = await getDocs(collection(db, 'clients'));
        const clientsData = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

        // Fetch references to get logos uploaded there
        const refsSnapshot = await getDocs(collection(db, 'references'));
        const refsData = refsSnapshot.docs.map(doc => doc.data() as any);

        // Merge logic to get unique client logos
        const clientLogosMap = new Map();

        // Add from clients collection
        clientsData.forEach(c => {
          if (c.showInPartners !== false) {
            clientLogosMap.set(c.name, {
              name: c.name,
              logo: c.partnerLogo || c.logo,
              hideName: c.hideName
            });
          }
        });

        // Add/Update from references collection
        refsData.forEach(r => {
          if (r.client && !r.hideClientName) {
            const existing = clientLogosMap.get(r.client);
            if (existing) {
              if (r.clientLogo && !existing.logo) {
                existing.logo = r.clientLogo;
              }
            } else {
              // Check if this client was explicitly hidden from partners in clients collection
              const clientInCollection = clientsData.find(c => c.name === r.client);
              if (!clientInCollection || clientInCollection.showInPartners !== false) {
                clientLogosMap.set(r.client, {
                  name: r.client,
                  logo: r.clientLogo || null,
                  hideName: false
                });
              }
            }
          }
        });

        const finalClients = Array.from(clientLogosMap.values());
        setClients(finalClients);

        // Fetch Why FuriE
        const whySnap = await getDoc(doc(db, 'site', 'whyfurie'));
        if (whySnap.exists()) {
          setWhyFuriEData(whySnap.data());
        } else {
          setWhyFuriEData({
            title: "왜 FuriE의 컨설팅을 받아야 하는가?",
            description: "자체 솔루션을 보유한 FuriE은 다수 프로젝트 성공 경험에서 축적된 시스템 구축 Know-How를 바탕으로 전문적이고 유연한 컨설팅 서비스를 제공드립니다.",
            reasons: [
              { icon: 'Shield', title: "금융기관 리스크관리, IFRS 등 다수 컨설팅 및 시스템 구축 경험 보유" },
              { icon: 'Zap', title: "계리, 리스크 및 회계 전문지식을 보유한 전문인력 구성" },
              { icon: 'CheckCircle', title: "고객사 환경 이해를 바탕으로 고객 맞춤 컨설팅 서비스 제공 및 시스템 구축" },
             { icon: 'Zap', title: "지속적인 R&D를 통해 금융시장 환경변화에 유연한 컨설팅 역량 및 솔루션 보유" }
            ],
            stats: [{ value: "QCM", label: "All in one 패키지" }]
          });
        }

        // Increment visitor count
        const statsRef = doc(db, 'site', 'stats');
        const statsSnap = await getDoc(statsRef);
        if (statsSnap.exists()) {
          const currentCount = statsSnap.data().visitors || 0;
          await setDoc(statsRef, { visitors: currentCount + 1 }, { merge: true });
        } else {
          await setDoc(statsRef, { visitors: 1 });
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <main>
      <Hero />
      
      {/* Why FuriE Section (Preview) */}
        <section className="py-24 bg-navy-900 text-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-8 tracking-tight whitespace-pre-line">
                  {whyFuriEData?.title || "왜 FuriE의 컨설팅을 \n받아야 하는가?"}
                </h2>
                <p className="text-navy-200 text-lg mb-12 leading-relaxed whitespace-pre-line">
                  {whyFuriEData?.description}
                </p>
                <div className="space-y-6">
                  {whyFuriEData?.reasons?.slice(0, 3).map((item: any, idx: number) => {
                    const Icon = iconMap[item.icon] || CheckCircle;
                    return (
                      <div key={idx} className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-medium">{item.title}</span>
                      </div>
                    );
                  })}
                </div>
                <Link 
                  to="/why-furie" 
                  onClick={() => window.scrollTo(0, 0)}
                  className="inline-flex items-center mt-12 text-white font-bold group"
                >
                  자세히 알아보기
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
              <div className="relative">
                <Link to="/contact" className="block group" onClick={() => window.scrollTo(0, 0)}>
                  <div className="aspect-square bg-white/5 rounded-[4rem] border border-white/10 p-12 flex flex-col items-center justify-center hover:bg-white/10 transition-all cursor-pointer">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                        <MessageSquare className="h-10 w-10 text-white" />
                      </div>
                      <div className="text-3xl font-bold mb-3">온라인 문의</div>
                      <p className="text-navy-300 uppercase tracking-widest text-xs font-bold">Consulting Inquiry</p>
                      <div className="mt-8 flex items-center justify-center text-sm font-bold text-white/40 group-hover:text-white transition-colors">
                        <span>문의하기</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-navy-400/10 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-navy-800/50 -skew-x-12 translate-x-1/4"></div>
        </section>

        <Services />

        {/* Clients Section (Preview) */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-navy-900 mb-16">함께하는 파트너사</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 transition-all duration-500">
              {clients.map((client, idx) => (
                <div key={idx} className="flex items-center justify-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm min-h-[80px]">
                  {client.logo ? (
                    <img 
                      src={client.logo} 
                      alt={client.hideName ? '비공개 고객사' : client.name} 
                      style={{ maxHeight: `${siteSettings?.partnerLogoSize || 40}px` }}
                      className="object-contain" 
                      referrerPolicy="no-referrer" 
                    />
                  ) : (
                    !client.hideName && (
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                        <span className="text-navy-900 font-bold text-lg">
                          {client.name[0]}
                        </span>
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
            <Link to="/clients" className="inline-flex items-center mt-16 text-navy-900 font-bold hover:underline">
              전체 고객사 및 수행 업무 보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>

        <Experts />
      </main>
  );
}
