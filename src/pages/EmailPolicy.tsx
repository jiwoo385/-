import React from 'react';
import { ChevronRight, Home as HomeIcon, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, doc, getDoc } from '@/firebase';
import Markdown from 'react-markdown';

export default function EmailPolicy() {
  const [policy, setPolicy] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'site', 'settings'));
        if (docSnap.exists()) {
          setPolicy(docSnap.data().emailPolicy || '# 이메일무단수집거부\n\n본 웹사이트에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용하여 무단으로 수집되는 것을 거부하며, 이를 위반 시 정보통신망법에 의해 형사 처벌됨을 유념하시기 바랍니다.');
        }
      } catch (error) {
        console.error("Error fetching policy:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, []);

  return (
    <div className="font-sans">
      <div className="pt-20">
        <div className="bg-[#1a1a1a] text-white py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center space-x-2 text-sm">
            <Link to="/" className="hover:text-gray-300 flex items-center">
              <HomeIcon className="h-3.5 w-3.5 mr-1" />
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-500" />
            <span className="font-bold">이메일무단수집거부</span>
          </div>
        </div>
      </div>

      <main className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 border-b border-gray-100 mb-12 flex items-center space-x-4">
            <div className="w-12 h-12 bg-navy-900/5 rounded-2xl flex items-center justify-center">
              <Mail className="h-6 w-6 text-navy-900" />
            </div>
            <h1 className="text-4xl font-medium text-[#333] tracking-tight">이메일무단수집거부</h1>
          </div>

          <div className="prose prose-navy max-w-none">
            <div className="markdown-body">
              <Markdown>{policy}</Markdown>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
