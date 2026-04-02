import React from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function Experts() {
  const [experts, setExperts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsub = onSnapshot(collection(db, 'experts'), (snapshot) => {
      const expertsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExperts(expertsData);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return null;
  if (experts.length === 0) return null;

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">최고의 전문가 그룹</h2>
            <p className="text-gray-600">
              FuriE는 글로벌 금융 시장에서 수십 년간 활약해 온 퀀트 전문가와 리스크 관리 전문가들로 구성되어 있습니다.
            </p>
          </div>
          <button className="mt-8 md:mt-0 px-6 py-3 border border-navy-900 text-navy-900 rounded-xl font-bold hover:bg-navy-900 hover:text-white transition-all">
            전문가 전체보기
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {experts.map((expert, idx) => (
            <div key={expert.id || idx} className="group">
              <div className="aspect-square bg-gray-100 rounded-3xl mb-6 overflow-hidden relative">
                <img 
                  src={expert.image || `https://picsum.photos/seed/expert${idx}/600/600`} 
                  alt={expert.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-1">{expert.name}</h3>
              <p className="text-navy-700 font-medium mb-3">{expert.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{expert.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
