import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Home as HomeIcon, FileDown } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { db, collection, getDocs, doc, getDoc } from '@/firebase';

export default function Clients() {
  const [references, setReferences] = React.useState<any[]>([]);
  const [clients, setClients] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [siteSettings, setSiteSettings] = React.useState<any>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'client' ? 'client' : 'reference';
  const [activeTab, setActiveTab] = React.useState<'reference' | 'client'>(initialTab);

  React.useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl === 'client' || tabFromUrl === 'reference') {
      setActiveTab(tabFromUrl as any);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'reference' | 'client', clientId?: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    window.scrollTo(0, 0);
    if (clientId) {
      // Optional: scroll to the specific client logo if needed
      setTimeout(() => {
        const element = document.getElementById(`client-${clientId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch site settings
        const settingsSnap = await getDoc(doc(db, 'site', 'settings'));
        if (settingsSnap.exists()) {
          setSiteSettings(settingsSnap.data());
        }

        const refsSnapshot = await getDocs(collection(db, 'references'));
        const refsData = refsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const clientsSnapshot = await getDocs(collection(db, 'clients'));
        const clientsData = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

        const catSnap = await getDoc(doc(db, 'site', 'categories'));
        const catData = catSnap.exists() ? catSnap.data().list : ["은행 및 증권사", "보험 및 캐피탈", "금융 유관기관"];

        // Sort references by period (most recent first)
        const sortedReferences = [...refsData].sort((a: any, b: any) => {
          const getSortDate = (period: string) => {
            if (!period) return "0000.00";
            const parts = period.split('~');
            const dateStr = parts[parts.length - 1].trim();
            return dateStr;
          };
          return getSortDate(b.period).localeCompare(getSortDate(a.period));
        });

        const existingCategories = Array.from(new Set(clientsData.map((c: any) => c.category).filter(Boolean)));
        const combinedCategories = Array.from(new Set([...catData, ...existingCategories]));

        // Merge logic for clients to include logos from references
        const mergedClientsMap = new Map();
        clientsData.forEach(c => mergedClientsMap.set(c.name, { 
          ...c,
          logo: c.partnerLogo || c.logo 
        }));
        
        refsData.forEach((r: any) => {
          if (r.client && !r.hideClientName) {
            const existing = mergedClientsMap.get(r.client);
            if (existing) {
              if (r.clientLogo && !existing.logo) {
                existing.logo = r.clientLogo;
              }
            } else {
              mergedClientsMap.set(r.client, {
                id: `ref-${r.client}`,
                name: r.client,
                logo: r.clientLogo || null,
                category: "", // Uncategorized
                hideName: false
              });
            }
          }
        });

        setReferences(sortedReferences);
        setClients(Array.from(mergedClientsMap.values()));
        setCategories(combinedCategories);
      } catch (error) {
        console.error("Error fetching site data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="font-sans">
      {/* Sub-menu Bar */}
      <div className="pt-20 bg-[#f5f5f5] border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-start md:justify-center overflow-x-auto scrollbar-hide">
            {[
              { label: 'Business Area', to: '/product' },
              { label: 'Why FuriE', to: '/why-furie' },
              { label: 'Reference', to: '/clients?tab=reference', id: 'reference' },
              { label: 'Client', to: '/clients?tab=client', id: 'client' },
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                onClick={() => {
                  if (item.id) {
                    setActiveTab(item.id as any);
                    window.scrollTo(0, 0);
                  }
                }}
                className={`px-6 md:px-8 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                  (item.id ? activeTab === item.id : false)
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
            <span className="font-bold">{activeTab === 'reference' ? 'Reference' : 'Client'}</span>
          </div>
        </div>
      </div>

      <main className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="py-16 border-b border-gray-100 mb-12">
            <h1 className="text-4xl font-medium text-[#333] tracking-tight">
              {activeTab === 'reference' ? 'Reference' : 'Client'}
            </h1>
          </div>

          {activeTab === 'reference' ? (
            /* Section: Capital Management */
            <div className="mb-20">
              <h2 className="text-2xl font-bold text-[#444] mb-8">Capital Management(IFRS, 리스크관리)</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-t-2 border-gray-200">
                  <thead>
                    <tr className="text-[#555] text-sm font-bold border-b border-gray-100">
                      <th className="py-5 px-4 text-left font-bold w-1/4">고객사</th>
                      <th className="py-5 px-4 text-left font-bold w-2/5">프로젝트 명</th>
                      <th className="py-5 px-4 text-center font-bold">Business</th>
                      <th className="py-5 px-4 text-center font-bold">IT</th>
                      <th className="py-5 px-4 text-left font-bold">수행기간</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-[#666]">
                    {references.map((ref, idx) => {
                      const clientData = clients.find(c => c.name === ref.client);
                      return (
                        <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="py-5 px-4">
                            {ref.hideClientName ? (
                              <span className="text-gray-400 italic">비공개 고객사</span>
                            ) : (
                              <button 
                                onClick={() => handleTabChange('client', clientData?.id)}
                                className="flex items-center space-x-3 hover:text-[#4b2c71] transition-colors group text-left"
                              >
                              <span className="font-bold border-b border-transparent group-hover:border-[#4b2c71]">{ref.client}</span>
                              </button>
                            )}
                          </td>
                          <td className="py-5 px-4">{ref.project}</td>
                          <td className="py-5 px-4 text-center">
                            {ref.business && <span className="text-[#555] text-lg">●</span>}
                          </td>
                          <td className="py-5 px-4 text-center">
                            {ref.it && <span className="text-[#555] text-lg">●</span>}
                          </td>
                          <td className="py-5 px-4 font-light">{ref.period}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Section: Client Logos */
            <div className="mt-8">
              <div className="space-y-16">
                {/* Display clients by defined categories */}
                {categories
                  .filter(cat => cat !== '기타 (레퍼런스)')
                  .map(category => {
                  const categoryClients = clients.filter(c => c.category === category);
                  if (categoryClients.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <h3 className="text-lg font-bold text-navy-900 mb-6 flex items-center">
                        <span className="w-1.5 h-6 bg-navy-900 mr-3 rounded-full"></span>
                        {category}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {categoryClients.map(client => (
                          <div 
                            key={client.id} 
                            id={`client-${client.id}`}
                            className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all group"
                          >
                            <div className="h-16 w-full flex items-center justify-center mb-4">
                              {client.logo ? (
                                <img 
                                  src={client.logo} 
                                  alt={client.hideName ? '비공개 고객사' : client.name} 
                                  style={{ maxHeight: `${(siteSettings?.partnerLogoSize || 40) * 1.5}px` }}
                                  className="max-w-full object-contain" 
                                  referrerPolicy="no-referrer" 
                                />
                              ) : (
                                !client.hideName && (
                                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                                    <span className="text-navy-900 font-bold text-xl">
                                      {client.name[0]}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                            {!client.hideName && (
                              <span className="text-sm font-bold text-gray-600 group-hover:text-navy-900 transition-colors">
                                {client.name}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Uncategorized clients section removed as per user request to hide "기타" sections */}
              </div>
            </div>
          )}

          <div className="mt-20 pt-10 border-t border-gray-100">
            <p className="text-gray-400 text-sm">
              * FuriE는 최신 금융 규제와 시장 환경에 최적화된 컨설팅 서비스를 제공합니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
