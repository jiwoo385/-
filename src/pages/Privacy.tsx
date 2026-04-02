import React from 'react';
import { db, doc, onSnapshot } from '@/firebase';
import ReactMarkdown from 'react-markdown';

export default function Privacy() {
  const [privacy, setPrivacy] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site', 'settings'), (docSnap) => {
      if (docSnap.exists()) {
        setPrivacy(docSnap.data().privacy || '# 개인정보 처리방침\n\n내용이 등록되지 않았습니다.');
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="prose prose-navy max-w-none markdown-body">
            <ReactMarkdown>{privacy}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
