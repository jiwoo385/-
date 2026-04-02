import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Users, FileText, Globe } from 'lucide-react';

export default function Services() {
  const services = [
    { title: "Experience", desc: "금융기관 리스크관리, IFRS, 자산운용 등 다수 컨설팅 및 시스템 구축 경험 보유", icon: CheckCircle2 },
    { title: "Optimization", desc: "고객사 환경이해를 바탕으로 고객맞춤 컨설팅 서비스 제공 및 시스템 구축", icon: Users },
    { title: "Flexibility", desc: "지속적인 R&D를 통해 금융시장 환경변화에 유연한 컨설팅 역량 및 솔루션 보유", icon: FileText },
    { title: "Professionality", desc: "계리, 리스크 및 회계 전문지식을 보유한 전문인력 구성", icon: Globe }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">우리의 전문 서비스</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            자체 솔루션을 보유한 FuriE는 다수 프로젝트 성공 경험에서 축적된 시스템 구축 Know-How를 바탕으로 전문적이고 유연한 컨설팅 서비스를 제공드립니다.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm"
            >
              <service.icon className="h-8 w-8 text-navy-900 mb-6" />
              <h3 className="text-xl font-bold text-navy-900 mb-3 whitespace-pre-line">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
