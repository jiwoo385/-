import React from 'react';
import { Link } from 'react-router-dom';
import { db, doc, getDoc } from '@/firebase';

export default function Footer() {
  const [settings, setSettings] = React.useState({ 
    siteName: 'FuriE', 
    siteLogo: '',
    logoHeight: 32,
    contactEmail: 'contact@furie.com',
    contactPhone: '02-123-4567'
  });

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'site', 'settings'));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSettings({
            siteName: data.siteName || 'FuriE',
            siteLogo: data.siteLogo || '',
            logoHeight: data.logoHeight || 32,
            contactEmail: data.contactEmail || 'contact@furie.com',
            contactPhone: data.contactPhone || '02-123-4567'
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-navy-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
              {settings.siteLogo ? (
                <img 
                  src={settings.siteLogo} 
                  alt={settings.siteName} 
                  style={{ height: `${settings.logoHeight}px`, width: 'auto' }}
                  className="mb-6 brightness-0 invert" 
                  referrerPolicy="no-referrer" 
                />
              ) : (
                <h2 className="text-3xl font-black italic tracking-tighter mb-6">{settings.siteName}</h2>
              )}
            </Link>
            <p className="text-gray-400 max-w-md leading-relaxed">
              {settings.siteName}는 다수 프로젝트 성공 경험에서 축적된 시스템 구축 Know-How를 바탕으로 전문적이고 유연한 컨설팅 서비스를 제공드립니다.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6">바로가기</h3>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/about" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors">회사 소개</Link></li>
              <li><Link to="/product" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors">서비스 안내</Link></li>
              <li><Link to="/clients" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors">수행 실적</Link></li>
              <li><Link to="/news" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors">뉴스/리포트</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6">고객지원</h3>
            <ul className="space-y-4 text-gray-400">
              <li>서울특별시 종로구 새문안로92 701호 (광화문 오피시아 빌딩)</li>
              <li>{settings.contactEmail}</li>
              <li>{settings.contactPhone}</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2026 {settings.siteName.toLowerCase()}.com {settings.siteName} Financial Engineering Consulting. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link>
            <Link to="/terms" className="hover:text-white transition-colors">이용약관</Link>
            <Link to="/email-policy" className="hover:text-white transition-colors">이메일무단수집거부</Link>
            <Link to="/admin" className="hover:text-white transition-colors">admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
