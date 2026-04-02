import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from 'lucide-react';
import { db, collection, addDoc, serverTimestamp, doc, getDoc } from '@/firebase';

export default function Contact() {
  const [formData, setFormData] = React.useState({
    name: '',
    contact: '',
    email: '',
    title: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [contactInfo, setContactInfo] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'site', 'contact'));
        if (docSnap.exists()) {
          setContactInfo(docSnap.data());
        } else {
          setContactInfo({
            address: "서울특별시 종로구 새문안로92 701호 (광화문 오피시아 빌딩)",
            phone: "02-123-4567",
            email: "contact@furie.com",
            hours: "월 - 금: 09:00 - 18:00",
            mapInfo: "광화문역 2번 출구 도보 5분"
          });
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };
    fetchContactInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        status: 'new',
        createdAt: serverTimestamp(),
        date: new Date().toISOString()
      });

      setIsSubmitted(true);
      setFormData({ name: '', contact: '', email: '', title: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Error saving inquiry:", error);
      alert("문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h1 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-6">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              FuriE의 전문가들이 귀사의 금융 혁신을 위해 대기하고 있습니다. <br />
              궁금하신 점은 언제든 문의해 주세요.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100">
                  <MapPin className="h-8 w-8 text-navy-900 mb-6" />
                  <h3 className="text-lg font-bold text-navy-900 mb-2">주소</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {contactInfo?.address}
                  </p>
                </div>
                <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100">
                  <Phone className="h-8 w-8 text-navy-900 mb-6" />
                  <h3 className="text-lg font-bold text-navy-900 mb-2">전화</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {contactInfo?.phone} <br />
                    평일 09:00 - 18:00
                  </p>
                </div>
                <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100">
                  <Mail className="h-8 w-8 text-navy-900 mb-6" />
                  <h3 className="text-lg font-bold text-navy-900 mb-2">이메일</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {contactInfo?.email} <br />
                    24시간 접수 가능
                  </p>
                </div>
                <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100">
                  <Clock className="h-8 w-8 text-navy-900 mb-6" />
                  <h3 className="text-lg font-bold text-navy-900 mb-2">운영시간</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {contactInfo?.hours} <br />
                    토, 일, 공휴일 휴무
                  </p>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="aspect-video bg-gray-100 rounded-[2rem] overflow-hidden relative border border-gray-200">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p className="font-medium">지도 API 연결 예정</p>
                  </div>
                </div>
                {/* Simulated Map UI */}
                <div className="absolute bottom-6 left-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100 max-w-xs">
                  <p className="font-bold text-navy-900 text-sm mb-1">FuriE 본사</p>
                  <p className="text-xs text-gray-500">{contactInfo?.mapInfo}</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-10 lg:p-12 rounded-[3rem] border border-gray-100 shadow-xl">
              <h3 className="text-2xl font-bold text-navy-900 mb-8">온라인 문의</h3>
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 p-12 rounded-3xl text-center"
                >
                  <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="h-8 w-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-green-900 mb-4">문의가 성공적으로 접수되었습니다.</h4>
                  <p className="text-green-700">담당자가 확인 후 빠른 시일 내에 연락드리겠습니다.</p>
                </motion.div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-navy-900 mb-2">성함</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all" 
                        placeholder="홍길동" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-navy-900 mb-2">연락처</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all" 
                        placeholder="010-0000-0000" 
                        value={formData.contact}
                        onChange={(e) => setFormData({...formData, contact: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-navy-900 mb-2">이메일</label>
                    <input 
                      required
                      type="email" 
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all" 
                      placeholder="example@company.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-navy-900 mb-2">문의 제목</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all" 
                      placeholder="문의 제목을 입력해 주세요." 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-navy-900 mb-2">문의 내용</label>
                    <textarea 
                      required
                      rows={5} 
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all" 
                      placeholder="문의하실 내용을 입력해 주세요."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>
                  <button 
                    disabled={isSubmitting}
                    type="submit" 
                    className="w-full py-5 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-navy-900/20 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>문의 보내기</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
