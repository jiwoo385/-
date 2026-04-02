import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ChevronRight, Search, FileText, Loader2 } from 'lucide-react';
import { db, collection, getDocs, orderBy, query } from '@/firebase';

export default function News() {
  const [newsList, setNewsList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState("전체");
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = query(collection(db, 'news'), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (data.length > 0) {
          setNewsList(data);
        } else {
          // Fallback data
          setNewsList([
            { id: '1', category: "공지사항", title: "2026년 상반기 금융공학 인턴십 모집 공고", date: "2026-03-22", important: true },
            { id: '2', category: "뉴스", title: "FuriE, QCM 엔진 특허 취득", date: "2026-03-18", important: false },
            { id: '3', category: "리포트", title: "2026년 글로벌 금융 시장 변동성 분석 및 전망", date: "2026-03-15", important: false },
          ]);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const filteredNews = newsList.filter(news => {
    const matchesCategory = activeCategory === "전체" || news.category === activeCategory;
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-navy-900" />
      </div>
    );
  }

  return (
    <div>
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h1 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-6">Notice & News</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              FuriE의 최신 소식과 전문 리포트를 확인하세요.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
              {["전체", "공지사항", "뉴스", "리포트"].map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                    cat === activeCategory ? "bg-navy-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-80">
              <input 
                type="text" 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy-900 outline-none" 
                placeholder="검색어를 입력하세요." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* News List */}
          <div className="space-y-4">
            {filteredNews.length > 0 ? filteredNews.map((news) => (
              <motion.div
                key={news.id}
                whileHover={{ x: 10 }}
                className="group p-6 md:p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-6">
                  <div className={`hidden md:flex w-14 h-14 rounded-xl items-center justify-center ${
                    news.important ? 'bg-red-50 text-red-600' : 'bg-navy-900/5 text-navy-900'
                  }`}>
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        news.important ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {news.category}
                      </span>
                      <span className="text-sm text-gray-400 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {news.date}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-navy-900 group-hover:text-navy-700 transition-colors">
                      {news.title}
                    </h3>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-gray-300 group-hover:text-navy-900 transition-colors" />
              </motion.div>
            )) : (
              <div className="py-20 text-center text-gray-400">
                검색 결과가 없습니다.
              </div>
            )}
          </div>

          {/* Pagination (Static for now) */}
          <div className="mt-16 flex justify-center space-x-2">
            {[1].map((p) => (
              <button key={p} className={`w-10 h-10 rounded-lg font-bold transition-all ${
                p === 1 ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
