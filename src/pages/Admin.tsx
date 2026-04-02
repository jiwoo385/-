import React from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Settings, LogOut, Plus, Trash2, Edit2, Save, 
  Upload, File, Image as ImageIcon, CheckCircle, Info, Package, Users as UsersIcon, MapPin, FileDown, Building2, Cpu, X, Home as HomeIcon, Menu,
  LogIn, RefreshCw, RotateCcw, Shield, FolderOpen
} from 'lucide-react';
import { 
  db, auth, googleProvider, signInWithPopup, signOut, 
  doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, onSnapshot, query, orderBy, 
  handleFirestoreError, OperationType,
  storage, ref, uploadBytes, getDownloadURL, deleteObject, listAll, list, uploadBytesResumable
} from '@/firebase';
import { useFirebase } from '@/components/FirebaseProvider';

export default function Admin() {
  const navigate = useNavigate();
  const { user, loading, isAdmin } = useFirebase();
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [fileFilter, setFileFilter] = React.useState('all');
  const [files, setFiles] = React.useState<any[]>([]);
  const [visitorCount, setVisitorCount] = React.useState(0);
  const [isSavingAll, setIsSavingAll] = React.useState(false);

  const filteredFiles = files.filter(file => {
    if (fileFilter === 'all') return true;
    return file.category.toLowerCase() === fileFilter.toLowerCase();
  });

  const [clients, setClients] = React.useState<any[]>([]);
  const [references, setReferences] = React.useState<any[]>([]);

  const mergedClients = React.useMemo(() => {
    const clientMap = new Map();

    // 1. Add from clients collection
    clients.forEach(c => {
      clientMap.set(c.name, {
        ...c,
        isFromClients: true
      });
    });

    // 2. Add from references collection
    references.forEach(r => {
      if (r.client && !clientMap.has(r.client)) {
        clientMap.set(r.client, {
          id: `ref-${r.client}`,
          name: r.client,
          category: '기타 (레퍼런스)',
          logo: r.clientLogo || '',
          partnerLogo: '',
          hideName: false,
          showInPartners: true,
          isFromClients: false
        });
      }
    });

    return Array.from(clientMap.values());
  }, [clients, references]);
  const [inquiries, setInquiries] = React.useState<any[]>([]);
  const [productContent, setProductContent] = React.useState({
    title: 'FuriE Quantum Engine',
    subtitle: 'High-Performance Financial Engineering Engine',
    description: "자체 솔루션을 보유한 FuriE은 다수 프로젝트 성공 경험에서 축적된 시스템 구축 Know-How를 바탕으로 전문적이고 유연한 컨설팅 서비스를 제공드립니다.",
    logo: '',
    logoSize: 100,
    titleSize: 72,
    offsetX: 0,
    offsetY: 0,
    brochureUrl: '',
    specs: [
      { label: '연산 아키텍처', value: 'CUDA 기반 병렬 처리' },
      { label: '지원 데이터 포맷', value: 'JSON, XML, CSV, SQL' },
      { label: '배포 환경', value: 'On-Premise / Cloud (AWS, Azure)' },
      { label: '보안 인증', value: '금융 보안 표준 준수' },
    ],
    features: [
      { icon: 'Zap', title: "Assumption", desc: "GPU 가속 기술을 활용하여 수백만 건의 시나리오를 수 초 내에 처리합니다." },
      { icon: 'ShieldCheck', title: "Real Cash Flow", desc: "VaR, ES 등 고도화된 리스크 지표를 소수점 단위의 오차 없이 산출합니다." },
      { icon: 'Layers', title: "Pricing", desc: "기존 레거시 시스템과의 완벽한 통합 및 클라우드 환경 최적화를 지원합니다." },
      { icon: 'Activity', title: "IFRS17&IFRS9", desc: "시장 데이터 변화에 따른 포트폴리오 영향을 실시간으로 분석합니다." },
      { icon: 'Cpu', title: "KICS&Insurance Risk", desc: "머신러닝 기반의 이상 징후 탐지 및 최적화 엔진이 내장되어 있습니다." },
      { icon: 'FileDown', title: "ALM", desc: "분석 결과를 규제 당국 보고 양식에 맞춰 자동으로 생성합니다." }
    ]
  });

  const [aboutData, setAboutData] = React.useState({
    title: 'About FuriE',
    description: '수학적 정밀함과 금융의 깊은 통찰력을 결합하여 새로운 가치를 창출하는 금융공학 전문 그룹입니다.',
    imageUrl: '',
    timeline: [
      { year: '2026', title: '글로벌 금융공학 리딩 컴퍼니 도약', desc: '해외 시장 진출 및 글로벌 파트너십 체결' },
      { year: '2024', title: '차세대 리스크 관리 엔진 V3 출시', desc: 'AI 기반 정밀 분석 알고리즘 탑재' },
      { year: '2022', title: '금융감독원 IFRS 프로젝트 수행', desc: '공공기관 및 대형 금융사 컨설팅 수주' },
      { year: '2020', title: 'FuriE 설립', desc: '금융공학 전문가 그룹으로 시작' },
    ]
  });

  const [newsData, setNewsData] = React.useState<any[]>([]);
  const [contactData, setContactData] = React.useState({
    address: '서울특별시 종로구 새문안로92 701호 (광화문 오피시아 빌딩)',
    phone: '02-123-4567',
    email: 'contact@furie.com',
    hours: '평일 09:00 - 18:00 (토, 일, 공휴일 휴무)',
    mapInfo: '광화문역'
  });

  const [whyFuriEData, setWhyFuriEData] = React.useState({
    title: 'Why FuriE?',
    description: '자체 솔루션을 보유한 FuriE는 다수 프로젝트 성공 경험에서 축적된 시스템 구축 Know-How를 바탕으로 전문적이고 유연한 컨설팅 서비스를 제공드립니다.',
    reasons: [
      { title: "1. All-In-One Platform QCM™", desc: "QCM™은 표준화된 리스크 통합데이터마트(QDM)를 기반으로 사용자 분석 목적에 맞게 Financial Component를 조립하여 사용하는 All-in-One 패키지로 전사적으로 일관된 View를 제공" },
      { title: "고성능 엔진 기술", desc: "자체 개발한 금융공학 엔진은 대규모 데이터를 실시간으로 처리하며, 업계 최고 수준의 계산 속도와 정확도를 자랑합니다." },
      { title: "맞춤형 솔루션", desc: "범용 솔루션이 아닌, 각 금융기관의 특수한 비즈니스 로직과 규제 환경에 최적화된 맞춤형 컨설팅을 제공합니다." },
      { title: "미래 지향적 통찰", desc: "단순한 시스템 구축을 넘어, 급변하는 글로벌 금융 트렌드와 규제 변화를 선제적으로 분석하여 대응 전략을 제시합니다." }
    ],
    stats: [
      { label: '규제 대응 성공률', value: '100%' },
      { label: '기존 엔진 대비 성능 향상', value: '10x' }
    ]
  });

  const [newClient, setNewClient] = React.useState({ 
    name: '', 
    category: '은행 및 증권사', 
    logo: '', 
    partnerLogo: '',
    hideName: false,
    showInPartners: true
  });
  const [editingClientId, setEditingClientId] = React.useState<string | null>(null);
  const [clientCategories, setClientCategories] = React.useState<string[]>(['은행 및 증권사', '보험 및 캐피탈', '금융 유관기관']);
  const [newCategory, setNewCategory] = React.useState('');
  
  const [newReference, setNewReference] = React.useState({ 
    client: '', 
    project: '', 
    business: true, 
    it: false, 
    period: '', 
    fileUrl: '', 
    hideClientName: false,
    clientLogo: '' 
  });
  const [editingReferenceId, setEditingReferenceId] = React.useState<string | null>(null);

  const [experts, setExperts] = React.useState<any[]>([]);
  const [newExpert, setNewExpert] = React.useState({ name: '', role: '', bio: '', image: '' });
  const [editingExpertId, setEditingExpertId] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Real-time listeners for data
    const unsubInquiries = onSnapshot(query(collection(db, 'inquiries'), orderBy('createdAt', 'desc')), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInquiries(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'inquiries'));

    const unsubClients = onSnapshot(collection(db, 'clients'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClients(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'clients'));

    const unsubReferences = onSnapshot(collection(db, 'references'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sorted = [...data].sort((a: any, b: any) => {
        const getSortDate = (period: string) => {
          if (!period) return "0000.00";
          const parts = period.split('~');
          const dateStr = parts[parts.length - 1].trim();
          return dateStr;
        };
        return getSortDate(b.period).localeCompare(getSortDate(a.period));
      });
      setReferences(sorted);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'references'));

    const unsubNews = onSnapshot(collection(db, 'news'), (snapshot) => {
      setNewsData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'news'));

    const unsubFiles = onSnapshot(query(collection(db, 'files'), orderBy('createdAt', 'desc')), (snapshot) => {
      setFiles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'files'));

    const unsubExperts = onSnapshot(collection(db, 'experts'), (snapshot) => {
      setExperts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'experts'));

    // Real-time listeners for site content
    const unsubProduct = onSnapshot(doc(db, 'site', 'product'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Only update if not currently focused on an input to prevent cursor jumping
        if (!document.activeElement?.closest('[data-section="product"]')) {
          setProductContent(prev => ({ ...prev, ...data }));
        }
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'site/product'));

    const unsubSettings = onSnapshot(doc(db, 'site', 'settings'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!document.activeElement?.closest('[data-section="settings"]')) {
          setSiteSettings(prev => ({ ...prev, ...data }));
        }
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'site/settings'));

    const unsubAbout = onSnapshot(doc(db, 'site', 'about'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!document.activeElement?.closest('[data-section="about"]')) {
          setAboutData(prev => ({ ...prev, ...data }));
        }
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'site/about'));

    const unsubContact = onSnapshot(doc(db, 'site', 'contact'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!document.activeElement?.closest('[data-section="contact"]')) {
          setContactData(prev => ({ ...prev, ...data }));
        }
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'site/contact'));

    const unsubWhy = onSnapshot(doc(db, 'site', 'whyfurie'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!document.activeElement?.closest('[data-section="whyfurie"]')) {
          setWhyFuriEData(prev => ({ ...prev, ...data }));
        }
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'site/whyfurie'));

    const unsubStats = onSnapshot(doc(db, 'site', 'stats'), (docSnap) => {
      if (docSnap.exists()) {
        setVisitorCount(docSnap.data().visitors || 0);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'site/stats'));

    return () => {
      unsubInquiries();
      unsubClients();
      unsubReferences();
      unsubNews();
      unsubFiles();
      unsubExperts();
      unsubProduct();
      unsubSettings();
      unsubAbout();
      unsubContact();
      unsubWhy();
      unsubStats();
    };
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const saveToFirebase = async (collectionName: string, docId: string | null, data: any) => {
    if (!isAdmin) {
      alert('관리자 권한이 없습니다.');
      return false;
    }
    try {
      if (docId) {
        await setDoc(doc(db, collectionName, docId), data, { merge: true });
      } else {
        const newDocRef = doc(collection(db, collectionName));
        await setDoc(newDocRef, { ...data, id: newDocRef.id });
      }
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${docId || 'new'}`);
      return false;
    }
  };

  const deleteFromFirebase = async (collectionName: string, docId: string) => {
    if (!isAdmin) {
      alert('관리자 권한이 없습니다.');
      return false;
    }
    try {
      await deleteDoc(doc(db, collectionName, docId));
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${docId}`);
      return false;
    }
  };

  const handleAddReference = async () => {
    try {
      if (!newReference.client || !newReference.project) return;
      
      const success = await saveToFirebase('references', editingReferenceId?.toString() || null, newReference);
      if (success) {
        // Sync logo for all references with the same client name
        if (newReference.clientLogo) {
          const sameClientRefs = references.filter(r => r.client === newReference.client && r.id !== editingReferenceId);
          for (const refItem of sameClientRefs) {
            if (refItem.clientLogo !== newReference.clientLogo) {
              await saveToFirebase('references', refItem.id, { ...refItem, clientLogo: newReference.clientLogo });
            }
          }

          // Sync logo to clients collection if exists
          const matchingClient = clients.find(c => c.name === newReference.client);
          if (matchingClient && matchingClient.logo !== newReference.clientLogo) {
            await saveToFirebase('clients', matchingClient.id, { ...matchingClient, logo: newReference.clientLogo });
          }
        }

        setEditingReferenceId(null);
        setNewReference({ client: '', project: '', business: true, it: false, period: '', fileUrl: '', hideClientName: false, clientLogo: '' });
        alert('레퍼런스가 저장되었습니다.');
      }
    } catch (error: any) {
      console.error("Save failed:", error);
      alert(`저장 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    }
  };

  const handleStartEditReference = (ref: any) => {
    setNewReference({ ...ref });
    setEditingReferenceId(ref.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteReference = async (id: string) => {
    try {
      await deleteFromFirebase('references', id);
    } catch (error: any) {
      console.error("Delete failed:", error);
      alert(`삭제 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    }
  };

  const handleAddCategory = async () => {
    try {
      if (!newCategory || clientCategories.includes(newCategory)) return;
      const updated = [...clientCategories, newCategory];
      const success = await saveToFirebase('site', 'categories', { list: updated });
      if (success) {
        setClientCategories(updated);
        setNewCategory('');
        alert('카테고리가 추가되었습니다.');
      }
    } catch (error: any) {
      console.error("Save failed:", error);
      alert(`저장 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    }
  };

  const handleDeleteCategory = async (cat: string) => {
    try {
      if (clientCategories.length <= 1) return;
      const updated = clientCategories.filter(c => c !== cat);
      const success = await saveToFirebase('site', 'categories', { list: updated });
      if (success) {
        setClientCategories(updated);
        alert('카테고리가 삭제되었습니다.');
      }
    } catch (error: any) {
      console.error("Delete failed:", error);
      alert(`삭제 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    }
  };

  const handleAddFeature = () => {
    const newFeature = { icon: 'Zap', title: '새 기능', desc: '기능 설명을 입력하세요.' };
    setProductContent(prev => ({
      ...prev,
      features: [...prev.features, newFeature]
    }));
  };

  const handleDeleteFeature = (idx: number) => {
    const newFeatures = productContent.features.filter((_, i) => i !== idx);
    setProductContent(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const handleAddClient = async () => {
    try {
      if (!newClient.name) return;
      
      const success = await saveToFirebase('clients', editingClientId?.toString() || null, newClient);
      if (success) {
        setEditingClientId(null);
        setNewClient({ 
          name: '', 
          category: '은행 및 증권사', 
          logo: '', 
          partnerLogo: '',
          hideName: false,
          showInPartners: true
        });
        alert('고객사가 저장되었습니다.');
      }
    } catch (error: any) {
      console.error("Save failed:", error);
      alert(`저장 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    }
  };

  const handleStartEdit = (client: any) => {
    setNewClient({ 
      name: client.name, 
      category: client.category, 
      logo: client.logo || '',
      partnerLogo: client.partnerLogo || '',
      hideName: client.hideName || false,
      showInPartners: client.showInPartners !== undefined ? client.showInPartners : true
    });
    setEditingClientId(client.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingClientId(null);
    setNewClient({ 
      name: '', 
      category: '은행 및 증권사', 
      logo: '', 
      partnerLogo: '',
      hideName: false,
      showInPartners: true
    });
  };

  const handleDeleteClient = async (id: string) => {
    try {
      if (window.confirm('정말 삭제하시겠습니까?')) {
        await deleteFromFirebase('clients', id);
        alert('삭제되었습니다.');
      }
    } catch (error: any) {
      console.error("Delete failed:", error);
      alert(`삭제 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    }
  };

  const [newAdminEmail, setNewAdminEmail] = React.useState('');
  const [siteSettings, setSiteSettings] = React.useState({
    siteName: 'FuriE',
    siteLogo: '',
    primaryColor: '#001F3F',
    heroTitle: '금융의 미래를 설계하는 정밀한 분석',
    contactEmail: 'contact@furie.com',
    contactPhone: '02-123-4567',
    logoHeight: 32,
    logoWidth: 0,
    logoMaxWidth: 300,
    logoMarginTop: 0,
    logoMarginLeft: 0,
    partnerLogoSize: 40,
    terms: '',
    privacy: '',
    emailPolicy: '',
    authorizedEmails: [] as string[],
  });

  const handleSaveAll = async () => {
    setIsSavingAll(true);
    try {
      // Basic size checks for large objects
      const settingsSize = JSON.stringify(siteSettings).length;
      const productSize = JSON.stringify(productContent).length;
      
      if (settingsSize > 800000 || productSize > 800000) {
        alert('일부 설정 정보의 크기가 너무 큽니다. 로고 등은 업로드 기능을 이용해 주세요.');
        setIsSavingAll(false);
        return;
      }

      const results = await Promise.all([
        saveToFirebase('site', 'settings', siteSettings),
        saveToFirebase('site', 'product', productContent),
        saveToFirebase('site', 'about', aboutData),
        saveToFirebase('site', 'contact', contactData),
        saveToFirebase('site', 'whyfurie', whyFuriEData)
      ]);

      if (results.every(r => r)) {
        alert('모든 설정이 성공적으로 저장되었습니다!');
      } else {
        alert('일부 설정 저장 중 오류가 발생했습니다. 개별 저장 버튼을 확인해 주세요.');
      }
    } catch (error: any) {
      console.error("Save all failed:", error);
      alert(`저장 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    } finally {
      setIsSavingAll(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      // Basic size check
      const size = JSON.stringify(siteSettings).length;
      if (size > 800000) {
        alert('설정 정보의 크기가 너무 큽니다. 로고 등은 업로드 기능을 이용해 주세요.');
        return;
      }

      if (await saveToFirebase('site', 'settings', siteSettings)) {
        alert('설정이 성공적으로 저장되었습니다!');
      }
    } catch (error: any) {
      console.error("Save failed:", error);
      alert(`저장 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    }
  };

  const handleSaveProduct = async () => {
    try {
      // Basic size check for base64 strings that might still be in state
      const size = JSON.stringify(productContent).length;
      if (size > 800000) { // ~800KB limit to be safe
        alert('상품 정보의 크기가 너무 큽니다. 대용량 파일은 "파일 업로드" 버튼을 통해 업로드해 주세요.');
        return;
      }

      if (await saveToFirebase('site', 'product', productContent)) {
        alert('상품 정보가 성공적으로 저장되었습니다.');
      }
    } catch (error: any) {
      console.error("Save failed:", error);
      alert(`저장 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    }
  };

  const handleSaveAbout = async () => {
    try {
      if (await saveToFirebase('site', 'about', aboutData)) {
        alert('About Us 정보가 저장되었습니다.');
      }
    } catch (error: any) {
      console.error("Save failed:", error);
      alert(`저장 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    }
  };

  const handleSaveContact = async () => {
    try {
      if (await saveToFirebase('site', 'contact', contactData)) {
        alert('Contact Us 정보가 저장되었습니다.');
      }
    } catch (error: any) {
      console.error("Save failed:", error);
      alert(`저장 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    }
  };

  const handleSaveWhyFuriE = async () => {
    try {
      if (await saveToFirebase('site', 'whyfurie', whyFuriEData)) {
        alert('Why FuriE 정보가 저장되었습니다.');
      }
    } catch (error: any) {
      console.error("Save failed:", error);
      alert(`저장 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    }
  };

  const handleSaveExpert = async () => {
    try {
      if (!newExpert.name || !newExpert.role) {
        alert('이름과 직함을 입력해 주세요.');
        return;
      }
      const success = await saveToFirebase('experts', editingExpertId, newExpert);
      if (success) {
        setNewExpert({ name: '', role: '', bio: '', image: '' });
        setEditingExpertId(null);
        alert('전문가 정보가 저장되었습니다.');
      }
    } catch (error: any) {
      console.error("Save failed:", error);
      alert(`저장 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    }
  };

  const handleDeleteExpert = async (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteFromFirebase('experts', id);
        alert('삭제되었습니다.');
      } catch (error: any) {
        console.error("Delete failed:", error);
        alert(`삭제 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
      }
    }
  };

  const handleAddNews = async () => {
    try {
      const title = prompt('뉴스 제목을 입력하세요:');
      if (!title) return;
      const category = prompt('카테고리를 입력하세요 (공지사항/뉴스/리포트):', '공지사항');
      if (!category) return;
      const important = confirm('중요 공지사항입니까?');
      
      await saveToFirebase('news', null, { 
        title, 
        category, 
        important, 
        date: new Date().toISOString().split('T')[0] 
      });
      alert('뉴스가 추가되었습니다.');
    } catch (error: any) {
      console.error("Save failed:", error);
      alert(`저장 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      if (confirm('정말 삭제하시겠습니까?')) {
        await deleteFromFirebase('news', id);
        alert('삭제되었습니다.');
      }
    } catch (error: any) {
      console.error("Delete failed:", error);
      alert(`삭제 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    }
  };

  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'general' | 'reference' | 'product_logo' | 'client_logo' | 'partner_logo' | 'site_logo' | 'product_brochure' | 'expert_image' | 'about_image' | 'reference_logo' = 'general') => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (increased to 20MB for Storage)
      if (file.size > 20 * 1024 * 1024) {
        alert('파일 크기가 너무 큽니다. 20MB 이하의 파일을 업로드해 주세요.');
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);
      try {
        const fileRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);

        await new Promise((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(Math.round(progress));
              console.log(`Upload progress: ${progress}%`);
            }, 
            (error) => {
              console.error("Upload task error:", error);
              reject(error);
            }, 
            () => {
              console.log("Upload task completed successfully");
              resolve(null);
            }
          );
        });

        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        
        // Always save to 'files' collection for recovery and management
        const fileData = {
          name: file.name,
          type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
          size: (file.size / (1024 * 1024)).toFixed(1) + 'MB',
          category: file.type.startsWith('image/') ? 'Images' : 'Documents',
          path: downloadURL,
          storagePath: fileRef.fullPath,
          createdAt: new Date().toISOString()
        };
        await saveToFirebase('files', null, fileData);

        if (target === 'product_logo') {
          setProductContent(prev => ({ ...prev, logo: downloadURL }));
        } else if (target === 'client_logo') {
          setNewClient(prev => ({ ...prev, logo: downloadURL }));
        } else if (target === 'partner_logo') {
          setNewClient(prev => ({ ...prev, partnerLogo: downloadURL }));
        } else if (target === 'site_logo') {
          setSiteSettings(prev => ({ ...prev, siteLogo: downloadURL }));
        } else if (target === 'reference') {
          setNewReference(prev => ({ ...prev, fileUrl: downloadURL }));
        } else if (target === 'product_brochure') {
          setProductContent(prev => ({ ...prev, brochureUrl: downloadURL }));
          alert('상품 소개서 파일이 업로드되었습니다. 하단의 "엔진 정보 저장하기" 버튼을 눌러야 최종 반영됩니다.');
        } else if (target === 'expert_image') {
          setNewExpert(prev => ({ ...prev, image: downloadURL }));
        } else if (target === 'about_image') {
          setAboutData(prev => ({ ...prev, imageUrl: downloadURL }));
        } else if (target === 'reference_logo') {
          setNewReference(prev => ({ ...prev, clientLogo: downloadURL }));
        }
      } catch (error: any) {
        console.error("Upload failed:", error);
        let errorMessage = '파일 업로드에 실패했습니다.';
        if (error.code === 'storage/unauthorized') {
          errorMessage += '\n권한이 없습니다. Storage 보안 규칙을 확인해 주세요.';
        } else if (error.code === 'storage/retry-limit-exceeded') {
          errorMessage += '\n네트워크 연결 시간이 초과되었습니다.';
        } else if (error.code === 'storage/canceled') {
          errorMessage += '\n업로드가 취소되었습니다.';
        } else {
          errorMessage += `\n오류: ${error.message || '알 수 없는 오류'}`;
        }
        alert(errorMessage);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const [showFileSelector, setShowFileSelector] = React.useState<{ target: string, type: 'Images' | 'Documents' | 'all' } | null>(null);

  const handleSelectFile = (file: any) => {
    if (!showFileSelector) return;
    
    const { target } = showFileSelector;
    if (target === 'product_logo') {
      setProductContent(prev => ({ ...prev, logo: file.path }));
    } else if (target === 'product_brochure') {
      setProductContent(prev => ({ ...prev, brochureUrl: file.path }));
    } else if (target === 'client_logo') {
      setNewClient(prev => ({ ...prev, logo: file.path }));
    } else if (target === 'partner_logo') {
      setNewClient(prev => ({ ...prev, partnerLogo: file.path }));
    } else if (target === 'site_logo') {
      setSiteSettings(prev => ({ ...prev, siteLogo: file.path }));
    } else if (target === 'expert_image') {
      setNewExpert(prev => ({ ...prev, image: file.path }));
    } else if (target === 'reference') {
      setNewReference(prev => ({ ...prev, fileUrl: file.path }));
    } else if (target === 'reference_logo') {
      setNewReference(prev => ({ ...prev, clientLogo: file.path }));
    } else if (target === 'about_image') {
      setAboutData(prev => ({ ...prev, imageUrl: file.path }));
    }
    
    setShowFileSelector(null);
  };

  const [isScanning, setIsScanning] = React.useState(false);

  const handleScanStorage = async () => {
    setIsScanning(true);
    try {
      // Try 'uploads' folder first, then root if that fails (some users might have files in root)
      let result;
      try {
        const uploadsRef = ref(storage, 'uploads');
        // Try listAll first, if it fails with timeout, try list with limit
        try {
          result = await listAll(uploadsRef);
        } catch (innerError: any) {
          if (innerError.code === 'storage/retry-limit-exceeded') {
            console.warn("listAll timed out, trying list with limit...");
            result = await list(uploadsRef, { maxResults: 100 });
          } else {
            throw innerError;
          }
        }
      } catch (e: any) {
        console.warn("Failed to scan 'uploads' folder, trying root...", e);
        const rootRef = ref(storage, '/');
        try {
          result = await listAll(rootRef);
        } catch (innerRootError: any) {
          if (innerRootError.code === 'storage/retry-limit-exceeded') {
            result = await list(rootRef, { maxResults: 100 });
          } else {
            throw innerRootError;
          }
        }
      }
      
      let addedCount = 0;
      for (const item of result.items) {
        // Check if file already exists in 'files' collection
        const alreadyExists = files.some(f => f.storagePath === item.fullPath);
        if (!alreadyExists) {
          const downloadURL = await getDownloadURL(item);
          const fileData = {
            name: item.name,
            type: item.name.split('.').pop()?.toUpperCase() || 'FILE',
            size: 'Unknown',
            category: item.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'Images' : 'Documents',
            path: downloadURL,
            storagePath: item.fullPath,
            createdAt: new Date().toISOString()
          };
          await saveToFirebase('files', null, fileData);
          addedCount++;
        }
      }
      alert(`${addedCount}개의 누락된 파일을 파일함에 추가했습니다.`);
    } catch (error: any) {
      console.error("Scan failed:", error);
      if (error.code === 'storage/retry-limit-exceeded') {
        alert("저장소 연결 시간이 초과되었습니다. \n\n1. Firebase Console에서 Storage가 활성화되어 있는지 확인해주세요.\n2. Storage 보안 규칙이 'read'를 허용하고 있는지 확인해주세요.\n3. 네트워크 상태를 확인하고 잠시 후 다시 시도해주세요.");
      } else if (error.code === 'storage/unauthorized') {
        alert("저장소 접근 권한이 없습니다. Firebase Console에서 Storage 보안 규칙을 확인해주세요.");
      } else {
        alert(`저장소 스캔 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleRestoreProductDefaults = () => {
    if (confirm('모든 상품 정보를 기본값으로 초기화하시겠습니까? 현재 입력된 내용은 저장하지 않으면 사라집니다.')) {
      setProductContent({
        title: 'FuriE Qualified Capital Management',
        subtitle: 'QCM',
        description: "QCM은 오랜 기간 프로젝트로 旣 검증된 제품이며 IFRS 17·9, 신지급여력 제도 및 경영 패러다임 변화에 유연한 대응이 가능한 국내 최고의 솔루션입니다.",
        logo: '',
        logoSize: 100,
        titleSize: 72,
        offsetX: 0,
        offsetY: 0,
        brochureUrl: '/docs/brochure.pdf',
        specs: [
          { label: '연산 아키텍처', value: 'CUDA 기반 병렬 처리' },
          { label: '지원 데이터 포맷', value: 'JSON, XML, CSV, SQL' },
          { label: '배포 환경', value: 'On-Premise / Cloud (AWS, Azure)' },
          { label: '보안 인증', value: '금융 보안 표준 준수' },
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
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">관리자 페이지를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100"
        >
          <div className="w-16 h-16 bg-navy-900/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LayoutDashboard className="h-8 w-8 text-navy-900" />
          </div>
          <h1 className="text-2xl font-bold text-navy-900 mb-2">관리자 로그인</h1>
          <p className="text-gray-500 mb-8">
            {user ? '관리자 권한이 없는 계정입니다. 관리자 계정으로 다시 로그인해 주세요.' : 'FuriE 관리자 페이지에 접근하려면 로그인이 필요합니다.'}
          </p>
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-navy-900 text-white rounded-2xl font-bold hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/20"
          >
            <LogIn className="h-5 w-5" />
            <span>Google 계정으로 로그인</span>
          </button>
          <Link to="/" className="inline-block mt-6 text-sm font-bold text-gray-400 hover:text-navy-900 transition-colors">
            홈페이지로 돌아가기
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-navy-900 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <h1 className="text-xl font-bold tracking-tight">{siteSettings.siteName} <span className="text-xs opacity-50">Admin</span></h1>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 w-64 bg-navy-900 text-white flex flex-col h-screen transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-8 hidden md:block">
          <h1 className="text-2xl font-bold tracking-tight">{siteSettings.siteName} <span className="text-xs opacity-50">Admin</span></h1>
        </div>
        
        <div className="px-4 pb-4">
          <Link 
            to="/" 
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-white/60 hover:text-white hover:bg-white/5 border border-white/10"
          >
            <HomeIcon className="h-5 w-5" />
            <span className="font-bold text-sm">홈페이지로 이동</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: '대시보드' },
            { id: 'inquiries', icon: FileText, label: '컨설팅 문의 내역' },
            { id: 'references', icon: FileDown, label: 'Reference 관리' },
            { id: 'about', icon: Info, label: 'About Us 관리' },
            { id: 'product', icon: Package, label: 'Product/엔진 관리' },
            { id: 'clients', icon: UsersIcon, label: 'Client 관리' },
            { id: 'experts', icon: UsersIcon, label: 'Experts 관리' },
            { id: 'news', icon: FileText, label: 'Notice & News' },
            { id: 'contact', icon: MapPin, label: 'Contact Us 관리' },
            { id: 'files', icon: Upload, label: '파일 통합 관리' },
            { id: 'admins', icon: UsersIcon, label: 'Admin 관리' },
            { id: 'legal', icon: Shield, label: '약관 및 정책' },
            { id: 'settings', icon: Settings, label: '사이트 설정' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-white/10 text-white shadow-inner' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-white/60 hover:text-white transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-12 overflow-y-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-bold text-navy-900">
              {activeTab === 'dashboard' && '관리자 대시보드'}
              {activeTab === 'inquiries' && '컨설팅 문의 내역'}
              {activeTab === 'references' && 'Reference (수행실적) 관리'}
              {activeTab === 'about' && 'About Us (연혁/역사) 관리'}
              {activeTab === 'product' && 'Product (엔진/상품) 관리'}
              {activeTab === 'clients' && 'Client (고객사) 관리'}
              {activeTab === 'news' && 'Notice & News 관리'}
              {activeTab === 'contact' && 'Contact Us (위치/정보) 관리'}
              {activeTab === 'files' && '파일 통합 관리'}
              {activeTab === 'legal' && '약관 및 정책 관리'}
              {activeTab === 'settings' && '사이트 설정'}
            </h2>
            <p className="text-gray-500 mt-2">
              {activeTab === 'dashboard' && '사이트 현황을 한눈에 확인하세요.'}
              {activeTab === 'inquiries' && '고객들이 남긴 컨설팅 문의를 날짜순으로 확인합니다.'}
              {activeTab === 'files' && 'PDF, 이미지 등 모든 업로드 파일을 관리합니다.'}
              {activeTab !== 'dashboard' && activeTab !== 'files' && activeTab !== 'inquiries' && '해당 섹션의 텍스트와 파일을 수정할 수 있습니다.'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <Link 
              to="/" 
              className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-navy-900 hover:bg-gray-50 transition-all shadow-sm"
            >
              <HomeIcon className="h-4 w-4" />
              <span>사이트 보기</span>
            </Link>
            <label className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-navy-900 hover:bg-navy-800 cursor-pointer'} text-white rounded-lg transition-all text-sm font-bold`}>
              {isUploading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Plus className="h-4 w-4" />
              )}
              <span>{isUploading ? `업로드 중 (${uploadProgress}%)` : '파일 업로드'}</span>
              <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
            </label>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-navy-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">실시간 관리 시스템 활성화됨</h3>
                <p className="text-white/70 text-sm max-w-2xl leading-relaxed">
                  현재 보시는 관리자 페이지는 Firebase 실시간 데이터베이스와 연결되어 있습니다. 
                  여기서 수정하는 모든 내용은 홈페이지에 즉시 반영되며, 다른 관리자들도 실시간으로 동일한 화면을 보게 됩니다.
                  <br /><br />
                  <span className="text-amber-400 font-bold">* 주의:</span> AI Studio의 'Remix' 버튼은 코드를 복제하는 기능입니다. 
                  단순히 사이트 내용을 수정하시려면 Remix를 누르지 마시고 이 관리자 페이지(/admin)를 이용해 주세요.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: '누적 방문자', value: visitorCount.toLocaleString(), change: 'LIVE' },
              { label: '신규 문의', value: inquiries.length, change: 'NEW' },
              { label: '등록된 고객사', value: clients.length, change: 'TOTAL' },
              { label: '업로드 파일', value: files.length, change: 'STORAGE' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-3xl font-bold text-navy-900">{stat.value}</h3>
                  <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

        {activeTab === 'references' && (
          <div className="space-y-8" data-section="references">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-navy-900">
                  {editingReferenceId ? 'Reference 수정' : '새 Reference 추가'}
                </h3>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={async () => {
                      if(confirm('기본 레퍼런스 데이터를 복구하시겠습니까? (기존 데이터는 유지됩니다)')) {
                        const defaultReferences = [
                          { client: 'DB손해', project: 'IFRS17 회계감사 후속 조치 및 고도화', business: true, it: true, period: '2023.10 ~ 2024.02', fileUrl: '', hideClientName: false },
                          { client: '새마을금고중앙회', project: '신지급여력제도(K-ICS) 시산 및 영향도 평가', business: true, it: false, period: '2023.09 ~ 2023.12', fileUrl: '', hideClientName: false },
                          { client: '신한EZ손해', project: '차세대 시스템 구축(일반보험 업무요건 정의)', business: true, it: false, period: '2023.06 ~ 2024.02', fileUrl: '', hideClientName: false },
                          { client: '코리안리', project: 'K-ICS 자산 표준모형 구축', business: true, it: true, period: '2023.04 ~ 2023.12', fileUrl: '', hideClientName: false },
                          { client: 'DB손해', project: 'IFRS17 결산 시스템 고도화', business: true, it: true, period: '2023.02 ~ 2023.06', fileUrl: '', hideClientName: false },
                          { client: 'NH농협손해', project: '신지급여력제도(K-ICS) 시스템 고도화', business: true, it: true, period: '2023.02 ~ 2023.07', fileUrl: '', hideClientName: false },
                          { client: '삼성화재', project: 'IFRS17 리스크 관리 시스템 구축', business: true, it: true, period: '2022.11 ~ 2023.05', fileUrl: '', hideClientName: false },
                          { client: '현대해상', project: 'K-ICS 영향 분석 및 대응 전략 수립', business: true, it: false, period: '2022.08 ~ 2023.01', fileUrl: '', hideClientName: false },
                          { client: '메리츠화재', project: '차세대 보험 계리 시스템 고도화', business: true, it: true, period: '2022.05 ~ 2022.12', fileUrl: '', hideClientName: false },
                        ];
                        for (const refData of defaultReferences) {
                          const exists = references.find(r => r.project === refData.project && r.client === refData.client);
                          if (!exists) {
                            await saveToFirebase('references', null, { ...refData, createdAt: new Date().toISOString() });
                          }
                        }
                        alert('기본 데이터가 복구되었습니다.');
                      }
                    }}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    기본값 복구
                  </button>
                  <button 
                    onClick={async () => {
                      if(confirm('모든 Reference를 삭제하시겠습니까?')) {
                        for (const ref of references) {
                          await deleteFromFirebase('references', ref.id);
                        }
                      }
                    }}
                    className="text-xs font-bold text-gray-400 hover:text-navy-900 transition-colors"
                  >
                    전체 삭제
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">고객사</label>
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="예: DB손해" 
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none"
                      value={newReference.client}
                      onChange={(e) => {
                        const clientName = e.target.value;
                        const existingClient = mergedClients.find(c => c.name === clientName);
                        setNewReference({
                          ...newReference, 
                          client: clientName,
                          clientLogo: existingClient?.logo || newReference.clientLogo
                        });
                      }}
                    />
                    <div className="flex items-center space-x-2">
                      {newReference.clientLogo && (
                        <div className="h-10 w-10 rounded-lg border border-gray-200 overflow-hidden bg-white flex items-center justify-center p-1">
                          <img src={newReference.clientLogo} alt="Logo" className="max-h-full max-w-full object-contain" />
                        </div>
                      )}
                      <label className={`px-3 py-3 ${isUploading ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 cursor-pointer'} text-gray-600 rounded-xl font-bold transition-all flex items-center`}>
                        {isUploading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-navy-900"></div>
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'reference_logo')}
                          disabled={isUploading}
                        />
                      </label>
                      <button 
                        onClick={() => setShowFileSelector({ target: 'reference_logo', type: 'Images' })}
                        className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all"
                        title="파일함에서 선택"
                      >
                        <FolderOpen className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">프로젝트 명</label>
                  <input 
                    type="text" 
                    placeholder="예: IFRS17 회계감사 후속 조치" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none"
                    value={newReference.project}
                    onChange={(e) => setNewReference({...newReference, project: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">수행 기간</label>
                  <input 
                    type="text" 
                    placeholder="예: 2023.10 ~ 2024.02" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none"
                    value={newReference.period}
                    onChange={(e) => setNewReference({...newReference, period: e.target.value})}
                  />
                </div>
                <div className="flex items-center space-x-6 pt-6">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-gray-300 text-navy-900 focus:ring-navy-900"
                      checked={newReference.business}
                      onChange={(e) => setNewReference({...newReference, business: e.target.checked})}
                    />
                    <span className="text-sm font-bold text-gray-600 group-hover:text-navy-900 transition-colors">Business 컨설팅</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-gray-300 text-navy-900 focus:ring-navy-900"
                      checked={newReference.it}
                      onChange={(e) => setNewReference({...newReference, it: e.target.checked})}
                    />
                    <span className="text-sm font-bold text-gray-600 group-hover:text-navy-900 transition-colors">IT 컨설팅</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-gray-300 text-navy-900 focus:ring-navy-900"
                      checked={newReference.hideClientName}
                      onChange={(e) => setNewReference({...newReference, hideClientName: e.target.checked})}
                    />
                    <span className="text-sm font-bold text-gray-600 group-hover:text-navy-900 transition-colors">고객사명 숨김</span>
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">관련 파일 (PDF/이미지)</label>
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="https://... (선택사항)" 
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none"
                      value={newReference.fileUrl}
                      onChange={(e) => setNewReference({...newReference, fileUrl: e.target.value})}
                    />
                    <label className={`px-4 py-3 ${isUploading ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 cursor-pointer'} text-gray-600 rounded-xl font-bold transition-all flex items-center space-x-2`}>
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-navy-900 mr-2"></div>
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      <span className="text-sm">{isUploading ? `업로드 중 (${uploadProgress}%)` : '업로드'}</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,image/*"
                        onChange={(e) => handleFileUpload(e, 'reference')}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                {editingReferenceId && (
                  <button 
                    onClick={() => { setEditingReferenceId(null); setNewReference({ client: '', project: '', business: true, it: false, period: '', fileUrl: '', hideClientName: false, clientLogo: '' }); }}
                    className="px-8 py-3.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                  >
                    취소
                  </button>
                )}
                <button 
                  onClick={handleAddReference}
                  className="px-12 py-3.5 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-all shadow-lg flex items-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>{editingReferenceId ? '수정 완료' : 'Reference 추가'}</span>
                </button>
                {editingReferenceId && (
                  <button 
                    onClick={() => {
                      handleDeleteReference(editingReferenceId);
                      setEditingReferenceId(null);
                      setNewReference({ client: '', project: '', business: true, it: false, period: '', fileUrl: '', hideClientName: false, clientLogo: '' });
                    }}
                    className="px-8 py-3.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center space-x-2"
                  >
                    <Trash2 className="h-5 w-5" />
                    <span>삭제하기</span>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-8 py-4">고객사</th>
                    <th className="px-8 py-4">프로젝트 명</th>
                    <th className="px-8 py-4 text-center">Biz</th>
                    <th className="px-8 py-4 text-center">IT</th>
                    <th className="px-8 py-4">기간</th>
                    <th className="px-8 py-4 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {references.length > 0 ? references.map((ref) => {
                    const clientData = clients.find(c => c.name === ref.client);
                    return (
                      <tr key={ref.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-8 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex flex-col">
                              <span className="font-bold text-navy-900 text-sm">{ref.client}</span>
                              {ref.hideClientName && (
                                <span className="text-[9px] px-1.5 py-0.5 bg-red-50 text-red-500 rounded-full font-bold w-fit">숨김</span>
                              )}
                            </div>
                          </div>
                        </td>
                      <td className="px-8 py-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <span>{ref.project}</span>
                          {ref.fileUrl && <FileDown className="h-3 w-3 text-blue-500" />}
                        </div>
                      </td>
                      <td className="px-8 py-4 text-center">
                        {ref.business ? <CheckCircle className="h-4 w-4 text-green-500 mx-auto" /> : <span className="text-gray-200">-</span>}
                      </td>
                      <td className="px-8 py-4 text-center">
                        {ref.it ? <CheckCircle className="h-4 w-4 text-green-500 mx-auto" /> : <span className="text-gray-200">-</span>}
                      </td>
                      <td className="px-8 py-4 text-xs text-gray-400 font-mono">{ref.period}</td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => handleStartEditReference(ref)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteReference(ref.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-gray-400">
                        등록된 Reference가 없습니다. 새로운 실적을 추가해 주세요.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">날짜</th>
                  <th className="px-6 py-4">문의 제목</th>
                  <th className="px-6 py-4">작성자</th>
                  <th className="px-6 py-4">연락처/이메일</th>
                  <th className="px-6 py-4 text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inquiries.length > 0 ? inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(inquiry.date).toLocaleDateString()} {new Date(inquiry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-navy-900">{inquiry.title}</div>
                      <div className="text-xs text-gray-400 mt-1 line-clamp-1">{inquiry.message}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-navy-700">{inquiry.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>{inquiry.contact}</div>
                      <div className="text-xs opacity-60">{inquiry.email}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => alert(`문의 상세 내용:\n\n제목: ${inquiry.title}\n작성자: ${inquiry.name}\n연락처: ${inquiry.contact}\n이메일: ${inquiry.email}\n\n내용:\n${inquiry.message}`)}
                        className="p-2 text-navy-900 hover:bg-navy-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={async () => {
                          if(confirm('정말 삭제하시겠습니까?')) {
                            await deleteFromFirebase('inquiries', inquiry.id);
                          }
                        }}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      접수된 문의 내역이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="space-y-8">
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start space-x-4">
              <Info className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-blue-900 mb-1">파일 업로드 및 관리 안내</h4>
                <p className="text-blue-700 text-sm leading-relaxed">
                  실제 파일을 업로드하려면 왼쪽 사이드바의 <strong>파일 탐색기(File Explorer)</strong>를 사용하세요. <br />
                  <span className="block mt-2">
                    • <strong>이미지:</strong> <code>public/images/</code> 폴더에 업로드 (예: <code>/images/logo.png</code>)<br />
                    • <strong>문서:</strong> <code>public/docs/</code> 폴더에 업로드 (예: <code>/docs/brochure.pdf</code>)
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                {[
                  { id: 'all', label: '전체' },
                  { id: 'images', label: '이미지' },
                  { id: 'documents', label: '문서' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFileFilter(tab.id)}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                      fileFilter === tab.id ? 'bg-navy-900 text-white shadow-md' : 'text-gray-500 hover:text-navy-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleScanStorage}
                  disabled={isScanning}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-all flex items-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>{isScanning ? '저장소 스캔 중...' : '누락된 파일 찾기 (복구)'}</span>
                </button>
                <p className="text-sm text-gray-500 font-medium">총 {filteredFiles.length}개의 파일</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFiles.map((file) => (
                <div key={file.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group relative">
                  <div className="aspect-video bg-gray-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden border border-gray-100">
                    {file.category === 'Images' ? (
                      <ImageIcon className="h-10 w-10 text-blue-200 group-hover:scale-110 transition-transform" />
                    ) : (
                      <File className="h-10 w-10 text-red-200 group-hover:scale-110 transition-transform" />
                    )}
                  </div>
                  <div className="mb-4">
                    <h5 className="font-bold text-navy-900 text-sm truncate" title={file.name}>{file.name}</h5>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{file.type} • {file.size}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-bold">{file.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-4 border-t border-gray-50">
                    <a 
                      href={file.path} 
                      download 
                      className="flex-1 py-2 bg-gray-50 text-navy-900 rounded-lg text-xs font-bold hover:bg-navy-900 hover:text-white transition-all text-center flex items-center justify-center space-x-1"
                    >
                      <FileDown className="h-3 w-3" />
                      <span>다운로드</span>
                    </a>
                    <button 
                      onClick={async () => {
                        if (confirm('정말 이 파일을 삭제하시겠습니까?')) {
                          if (file.storagePath) {
                            try {
                              const fileRef = ref(storage, file.storagePath);
                              await deleteObject(fileRef);
                            } catch (error) {
                              console.error("Storage delete failed:", error);
                            }
                          }
                          await deleteFromFirebase('files', file.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {filteredFiles.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                  <Upload className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium">해당 카테고리에 파일이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-50 gap-4">
                <div>
                  <h3 className="text-xl font-bold text-navy-900">고객사 로고 표시 설정</h3>
                  <p className="text-sm text-gray-400 mt-1">홈페이지와 고객사 페이지에 표시되는 로고의 크기를 일괄 조절합니다.</p>
                </div>
                <div className="w-full md:w-64 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <label className="block text-xs font-bold text-navy-900 mb-3 uppercase tracking-wider">전체 로고 크기 (px)</label>
                  <div className="flex items-center space-x-3">
                    <input 
                      type="range" 
                      min="20" 
                      max="200"
                      value={siteSettings.partnerLogoSize || 40}
                      onChange={(e) => setSiteSettings({...siteSettings, partnerLogoSize: parseInt(e.target.value) || 0})}
                      className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-navy-900"
                    />
                    <span className="text-sm font-bold text-navy-900 w-12 text-right">{siteSettings.partnerLogoSize || 40}px</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-navy-900">
                  {editingClientId ? '고객사 정보 수정' : '새 고객사 추가'}
                </h3>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={async () => {
                      if(confirm('기본 고객사 데이터를 복구하시겠습니까? (기존 데이터는 유지됩니다)')) {
                        const defaultClients = [
                          { name: '신협중앙회', category: '금융 유관기관', logo: '', hideName: false },
                          { name: '흥국생명', category: '보험 및 캐피탈', logo: '', hideName: false },
                          { name: 'DB손해보험', category: '보험 및 캐피탈', logo: '', hideName: false },
                          { name: 'NH농협손해', category: '보험 및 캐피탈', logo: '', hideName: false },
                          { name: '삼성화재', category: '보험 및 캐피탈', logo: '', hideName: false },
                          { name: '현대해상', category: '보험 및 캐피탈', logo: '', hideName: false },
                          { name: '메리츠화재', category: '보험 및 캐피탈', logo: '', hideName: false },
                          { name: 'KB손해', category: '보험 및 캐피탈', logo: '', hideName: false },
                          { name: '한화생명', category: '보험 및 캐피탈', logo: '', hideName: false },
                          { name: '교보생명', category: '보험 및 캐피탈', logo: '', hideName: false },
                          { name: '신한은행', category: '은행 및 증권사', logo: '', hideName: false },
                          { name: '우리은행', category: '은행 및 증권사', logo: '', hideName: false },
                          { name: '한국은행', category: '금융 유관기관', logo: '', hideName: false },
                          { name: '금융감독원', category: '금융 유관기관', logo: '', hideName: false },
                          { name: '하나손보', category: '보험 및 캐피탈', logo: '', hideName: false },
                          { name: 'KB캐피탈', category: '보험 및 캐피탈', logo: '', hideName: false },
                          { name: '대신증권', category: '은행 및 증권사', logo: '', hideName: false },
                          { name: '코리안리', category: '보험 및 캐피탈', logo: '', hideName: false },
                          { name: '새마을금고중앙회', category: '금융 유관기관', logo: '', hideName: false },
                          { name: '신한EZ손해', category: '보험 및 캐피탈', logo: '', hideName: false }
                        ];
                        for (const clientData of defaultClients) {
                          // Check if already exists to avoid duplicates
                          const exists = clients.find(c => c.name === clientData.name);
                          if (!exists) {
                            await saveToFirebase('clients', null, { ...clientData, createdAt: new Date().toISOString() });
                          }
                        }
                        alert('기본 데이터가 복구되었습니다.');
                      }
                    }}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    기본값 복구
                  </button>
                  <button 
                    onClick={async () => {
                      if(confirm('모든 고객사 데이터를 삭제하시겠습니까?')) {
                        for (const client of clients) {
                          await deleteFromFirebase('clients', client.id);
                        }
                      }
                    }}
                    className="text-xs font-bold text-gray-400 hover:text-navy-900 transition-colors"
                  >
                    전체 삭제
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">고객사 명칭</label>
                  <input 
                    type="text" 
                    placeholder="예: 국민은행" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none"
                    value={newClient.name}
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">카테고리</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none"
                    value={newClient.category}
                    onChange={(e) => setNewClient({...newClient, category: e.target.value})}
                  >
                    {clientCategories.map(cat => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center pt-6 space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-gray-300 text-navy-900 focus:ring-navy-900"
                      checked={newClient.hideName}
                      onChange={(e) => setNewClient({...newClient, hideName: e.target.checked})}
                    />
                    <span className="text-sm font-bold text-gray-600 group-hover:text-navy-900 transition-colors">명칭 숨김처리</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-gray-300 text-navy-900 focus:ring-navy-900"
                      checked={newClient.showInPartners}
                      onChange={(e) => setNewClient({...newClient, showInPartners: e.target.checked})}
                    />
                    <span className="text-sm font-bold text-gray-600 group-hover:text-navy-900 transition-colors">파트너사 섹션 노출</span>
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">고객사 로고 (기본)</label>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden">
                      {newClient.logo ? (
                        <img src={newClient.logo} alt="Client Logo" className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
                      ) : (
                        <Building2 className="h-6 w-6 text-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 flex space-x-2">
                      <button 
                        onClick={() => setShowFileSelector({ target: 'client_logo', type: 'Images' })}
                        className="flex-1 px-3 py-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl text-[10px] font-bold transition-all border border-gray-100"
                      >
                        파일함
                      </button>
                      <label className={`flex-[2] px-4 py-3 ${isUploading ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 cursor-pointer'} text-gray-600 rounded-xl text-xs font-bold transition-all text-center`}>
                        {isUploading ? `업로드 중` : '로고 업로드'}
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'client_logo')} disabled={isUploading} />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">파트너사 로고 (컬러)</label>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden">
                      {newClient.partnerLogo ? (
                        <img src={newClient.partnerLogo} alt="Partner Logo" className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
                      ) : (
                        <Building2 className="h-6 w-6 text-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 flex space-x-2">
                      <button 
                        onClick={() => setShowFileSelector({ target: 'partner_logo', type: 'Images' })}
                        className="flex-1 px-3 py-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl text-[10px] font-bold transition-all border border-gray-100"
                      >
                        파일함
                      </button>
                      <label className={`flex-[2] px-4 py-3 ${isUploading ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 cursor-pointer'} text-gray-600 rounded-xl text-xs font-bold transition-all text-center`}>
                        {isUploading ? `업로드 중` : '컬러 로고 업로드'}
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'partner_logo')} disabled={isUploading} />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex items-end space-x-2">
                  <button 
                    onClick={handleAddClient}
                    className={`flex-1 ${editingClientId ? 'bg-blue-600' : 'bg-navy-900'} text-white px-6 py-3.5 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg`}
                  >
                    {editingClientId ? '수정 완료' : '고객사 추가'}
                  </button>
                  {editingClientId && (
                    <button 
                      onClick={handleCancelEdit}
                      className="px-6 py-3.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                      취소
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h4 className="text-sm font-bold text-navy-900 mb-4">카테고리 편집</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {clientCategories.map(cat => (
                    <div key={cat} className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg">
                      <span className="text-sm font-medium mr-2">{cat}</span>
                      <button onClick={() => handleDeleteCategory(cat)} className="text-gray-400 hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="새 카테고리 이름" 
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <button 
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-200"
                  >
                    추가
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-8 py-4">로고 (기본/컬러)</th>
                    <th className="px-8 py-4">고객사 명칭</th>
                    <th className="px-8 py-4">카테고리</th>
                    <th className="px-8 py-4 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mergedClients.length > 0 ? mergedClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-4">
                        <div className="flex space-x-2">
                          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 group-hover:border-navy-100 transition-colors" title="기본 로고">
                            {client.logo ? (
                              <img src={client.logo} alt={client.name} className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
                            ) : (
                              <Building2 className="h-6 w-6 text-gray-300" />
                            )}
                          </div>
                          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 group-hover:border-navy-100 transition-colors" title="컬러 로고">
                            {client.partnerLogo ? (
                              <img src={client.partnerLogo} alt={client.name} className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
                            ) : (
                              <Building2 className="h-6 w-6 text-gray-300" />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="font-bold text-navy-900">{client.name}</div>
                          {client.hideName && (
                            <span className="text-[10px] px-2 py-0.5 bg-red-50 text-red-500 rounded-full font-bold">숨김</span>
                          )}
                          {!client.isFromClients && (
                            <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-500 rounded-full font-bold">레퍼런스 전용</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className="text-xs font-bold px-3 py-1 bg-gray-100 text-gray-500 rounded-full">{client.category}</span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => handleStartEdit(client)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title={client.isFromClients ? "수정" : "등록 및 수정"}
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          {client.isFromClients && (
                            <button 
                              onClick={() => handleDeleteClient(client.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="삭제"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-gray-400">
                        등록된 고객사가 없습니다. 새로운 고객사를 추가해 주세요.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'product' && (
          <div className="space-y-8" data-section="product">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-navy-900">Product (엔진) 정보 관리</h3>
                <button 
                  onClick={handleRestoreProductDefaults}
                  className="px-4 py-2 text-gray-400 hover:text-navy-900 text-sm font-bold transition-all flex items-center space-x-1"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>기본값으로 복구</span>
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">엔진 명칭</label>
                  <textarea 
                    rows={2} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none"
                    value={productContent.title}
                    onChange={(e) => setProductContent({...productContent, title: e.target.value})}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">엔진 부제목 (Subtitle)</label>
                  <textarea 
                    rows={2} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none"
                    value={(productContent as any).subtitle || ''}
                    onChange={(e) => setProductContent({...productContent, subtitle: e.target.value} as any)}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">엔진 상세 설명</label>
                  <textarea 
                    rows={4} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none"
                    value={productContent.description}
                    onChange={(e) => setProductContent({...productContent, description: e.target.value})}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">엔진 로고 이미지</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-64 h-64 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden">
                      {productContent.logo ? (
                        <img src={productContent.logo} alt="Engine Logo" className="w-full h-full object-contain p-6" referrerPolicy="no-referrer" />
                      ) : (
                        <Cpu className="h-16 w-16 text-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex space-x-2">
                        <input 
                          type="text" 
                          placeholder="이미지 URL 또는 업로드" 
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm"
                          value={productContent.logo}
                          onChange={(e) => setProductContent({...productContent, logo: e.target.value})}
                        />
                        <button 
                          onClick={() => setShowFileSelector({ target: 'product_logo', type: 'Images' })}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-bold transition-all"
                        >
                          파일함에서 선택
                        </button>
                      </div>
                          <div className="flex items-center space-x-4">
                            <label className="text-xs font-bold text-gray-400 uppercase whitespace-nowrap">로고 크기 (%)</label>
                            <input 
                              type="range" 
                              min="10" 
                              max="400" 
                              value={productContent.logoSize || 100}
                              onChange={(e) => setProductContent({...productContent, logoSize: parseInt(e.target.value)})}
                              className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-navy-900"
                            />
                            <span className="text-xs font-bold text-navy-900 w-8">{productContent.logoSize || 100}%</span>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <label className="text-xs font-bold text-gray-400 uppercase whitespace-nowrap">엔진명 크기 (px)</label>
                            <input 
                              type="range" 
                              min="20" 
                              max="150" 
                              value={(productContent as any).titleSize || 72}
                              onChange={(e) => setProductContent({...productContent, titleSize: parseInt(e.target.value)} as any)}
                              className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-navy-900"
                            />
                            <span className="text-xs font-bold text-navy-900 w-8">{(productContent as any).titleSize || 72}px</span>
                          </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2">
                        <div className="flex items-center space-x-4">
                          <label className="text-xs font-bold text-gray-400 uppercase whitespace-nowrap">좌우 위치 (px)</label>
                          <input 
                            type="range" 
                            min="-500" 
                            max="500" 
                            value={productContent.offsetX || 0}
                            onChange={(e) => setProductContent({...productContent, offsetX: parseInt(e.target.value)})}
                            className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-navy-900"
                          />
                          <span className="text-xs font-bold text-navy-900 w-12">{productContent.offsetX || 0}px</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <label className="text-xs font-bold text-gray-400 uppercase whitespace-nowrap">상하 위치 (px)</label>
                          <input 
                            type="range" 
                            min="-500" 
                            max="500" 
                            value={productContent.offsetY || 0}
                            onChange={(e) => setProductContent({...productContent, offsetY: parseInt(e.target.value)})}
                            className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-navy-900"
                          />
                          <span className="text-xs font-bold text-navy-900 w-12">{productContent.offsetY || 0}px</span>
                        </div>
                      </div>
                      <label className={`inline-block px-4 py-2 ${isUploading ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 cursor-pointer'} text-gray-600 rounded-lg text-xs font-bold transition-all`}>
                        {isUploading ? `업로드 중 (${uploadProgress}%)` : '이미지 업로드'}
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'product_logo')} disabled={isUploading} />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">상품소개서 (PDF/문서)</label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        placeholder="문서 URL 또는 업로드" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none text-sm"
                        value={productContent.brochureUrl || ''}
                        onChange={(e) => setProductContent({...productContent, brochureUrl: e.target.value})}
                      />
                    </div>
                    <button 
                      onClick={() => setShowFileSelector({ target: 'product_brochure', type: 'Documents' })}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-bold transition-all"
                    >
                      파일함에서 선택
                    </button>
                    <label className={`px-6 py-3 ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-navy-900 hover:bg-navy-800 cursor-pointer'} text-white rounded-xl text-sm font-bold transition-all shadow-sm`}>
                      {isUploading ? `업로드 중 (${uploadProgress}%)` : '파일 업로드'}
                      <input type="file" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={(e) => handleFileUpload(e, 'product_brochure')} disabled={isUploading} />
                    </label>
                  </div>
                  {productContent.brochureUrl && (
                    <p className="mt-2 text-xs text-gray-500 flex items-center">
                      <FileText className="h-3 w-3 mr-1" />
                      현재 파일: 
                      <a 
                        href={productContent.brochureUrl} 
                        target={productContent.brochureUrl.startsWith('data:') ? '_self' : '_blank'}
                        rel="noopener noreferrer"
                        className="ml-1 text-navy-900 hover:underline font-bold"
                      >
                        {productContent.brochureUrl.startsWith('data:') ? '업로드된 파일 (클릭하여 확인)' : '파일 링크'}
                      </a>
                    </p>
                  )}
                </div>

                <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  <h4 className="text-sm font-bold text-navy-900 mb-4 flex items-center">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    실시간 레이아웃 미리보기 (홈페이지 화면 재현)
                  </h4>
                  <div className="relative w-full min-h-[600px] bg-white rounded-xl border border-gray-200 overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
                    {/* Simulated Header */}
                    <div className="px-12 py-8 border-b border-gray-100 mb-8">
                      <h1 className="text-xl font-medium text-[#333] tracking-tight">Business Area</h1>
                    </div>

                    <div className="px-12 pb-12">
                      <div className="grid grid-cols-2 gap-16 items-center">
                        {/* Left: Text Content (Scaled) */}
                        <div className="scale-90 origin-left">
                          <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-semibold tracking-wider text-navy-900 uppercase bg-navy-900/5 rounded-full">
                            Core Technology
                          </span>
                          <h1 
                            style={{ fontSize: `${((productContent as any).titleSize || 72) * 0.6}px` }}
                            className="font-bold text-navy-900 tracking-tight leading-tight mb-4 whitespace-pre-line"
                          >
                            {productContent.title}
                          </h1>
                          {(productContent as any).subtitle && (
                            <p className="text-lg text-navy-700 font-medium mb-8 whitespace-pre-line">
                              {(productContent as any).subtitle}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 mb-10 leading-relaxed whitespace-pre-line line-clamp-5">
                            {productContent.description}
                          </p>
                          <div className="flex gap-4">
                            <div className="px-6 py-3 bg-navy-900 text-white rounded-xl text-[10px] font-bold shadow-sm">상품 소개서 열기</div>
                            <div className="px-6 py-3 bg-white text-navy-900 border border-gray-200 rounded-xl text-[10px] font-bold">기술 사양 확인</div>
                          </div>
                        </div>

                        {/* Right: Logo Only (Actual Controls Applied) */}
                        <div className="relative flex items-center justify-center">
                          <div 
                            style={{ 
                              transform: `translate(${productContent.offsetX || 0}px, ${productContent.offsetY || 0}px)`,
                            }}
                            className="relative transition-all duration-300 flex items-center justify-center w-full"
                          >
                            {productContent.logo ? (
                              <img 
                                key={productContent.logo}
                                src={productContent.logo} 
                                alt="Preview" 
                                style={{ 
                                  width: `${productContent.logoSize || 100}%`,
                                  height: 'auto'
                                }}
                                className="max-w-full object-contain relative z-10" 
                              />
                            ) : (
                              <div className="w-64 h-64 bg-navy-900/5 rounded-[4rem] flex items-center justify-center overflow-hidden relative">
                                <Cpu className="w-1/2 h-1/2 text-navy-900 opacity-10 absolute" />
                                <div className="relative z-10 text-center p-8">
                                  <div className="text-4xl font-bold text-navy-900 mb-2">10x</div>
                                  <p className="text-navy-700 text-xs">연산 속도 향상</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Label for context */}
                    <div className="absolute bottom-4 right-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Actual Page Layout Simulation
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-3">
                    * 실제 페이지에서는 위 설정값이 원본 크기로 적용됩니다. (미리보기는 조절 편의를 위해 축소되었습니다.)
                  </p>
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="font-bold text-navy-900 mb-4">기술 사양 (Specs)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {productContent.specs.map((spec, idx) => (
                      <div key={idx} className="flex space-x-2">
                        <div className="flex-1 flex space-x-2 relative group">
                          <input 
                            type="text" 
                            placeholder="항목 (예: 연산 아키텍처)" 
                            className="w-1/3 px-4 py-2 rounded-lg border border-gray-200 text-sm"
                            value={spec.label}
                            onChange={(e) => {
                              const newSpecs = [...productContent.specs];
                              newSpecs[idx].label = e.target.value;
                              setProductContent({...productContent, specs: newSpecs});
                            }}
                          />
                          <input 
                            type="text" 
                            placeholder="내용 (예: CUDA 기반)" 
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm"
                            value={spec.value}
                            onChange={(e) => {
                              const newSpecs = [...productContent.specs];
                              newSpecs[idx].value = e.target.value;
                              setProductContent({...productContent, specs: newSpecs});
                            }}
                          />
                          <button 
                            onClick={() => {
                              const newSpecs = productContent.specs.filter((_, i) => i !== idx);
                              setProductContent({...productContent, specs: newSpecs});
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 transition-all"
                            title="삭제"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-navy-900">엔진 핵심 기능 (Features)</h4>
                    <button 
                      onClick={handleAddFeature}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200"
                    >
                      <Plus className="h-3 w-3" />
                      <span>기능 추가</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {productContent.features.map((feature, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-2xl space-y-3 relative group">
                        <button 
                          onClick={() => handleDeleteFeature(idx)}
                          className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-gray-400">아이콘:</span>
                          <select 
                            className="text-xs border-none bg-transparent font-bold text-navy-900"
                            value={feature.icon}
                            onChange={(e) => {
                              const newFeatures = [...productContent.features];
                              newFeatures[idx].icon = e.target.value;
                              setProductContent({...productContent, features: newFeatures});
                            }}
                          >
                            <option value="Zap">Zap (번개)</option>
                            <option value="ShieldCheck">Shield (방패)</option>
                            <option value="Layers">Layers (레이어)</option>
                            <option value="Activity">Activity (활동)</option>
                            <option value="Cpu">Cpu (CPU)</option>
                            <option value="FileDown">File (파일)</option>
                            <option value="TrendingUp">Trend (상승)</option>
                            <option value="Lock">Lock (보안)</option>
                          </select>
                        </div>
                        <input 
                          type="text" 
                          placeholder="기능 제목" 
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold"
                          value={feature.title}
                          onChange={(e) => {
                            const newFeatures = [...productContent.features];
                            newFeatures[idx].title = e.target.value;
                            setProductContent({...productContent, features: newFeatures});
                          }}
                        />
                        <textarea 
                          placeholder="기능 설명" 
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs"
                          value={feature.desc}
                          onChange={(e) => {
                            const newFeatures = [...productContent.features];
                            newFeatures[idx].desc = e.target.value;
                            setProductContent({...productContent, features: newFeatures});
                          }}
                        ></textarea>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleSaveProduct}
                  className="w-full py-4 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-all flex items-center justify-center space-x-2 shadow-lg"
                >
                  <Save className="h-5 w-5" />
                  <span>엔진 정보 저장하기</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Specific Editors for each tab */}

        {activeTab === 'about' && (
          <div className="space-y-8" data-section="about">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-navy-900 mb-6">About Us (회사 소개) 관리</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">페이지 제목</label>
                  <textarea 
                    rows={2} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none"
                    value={aboutData.title}
                    onChange={(e) => setAboutData({...aboutData, title: e.target.value})}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">페이지 설명</label>
                  <textarea 
                    rows={3} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none"
                    value={aboutData.description}
                    onChange={(e) => setAboutData({...aboutData, description: e.target.value})}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">About Us 이미지</label>
                  <div className="flex space-x-4">
                    <input 
                      type="text" 
                      value={aboutData.imageUrl}
                      onChange={(e) => setAboutData({...aboutData, imageUrl: e.target.value})}
                      placeholder="URL 입력 또는 파일 업로드"
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all"
                    />
                    <button 
                      onClick={() => setShowFileSelector({ target: 'about_image', type: 'Images' })}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-bold transition-all"
                    >
                      파일함
                    </button>
                    <label className={`px-4 py-3 ${isUploading ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 cursor-pointer'} text-gray-600 rounded-xl text-sm font-bold transition-all btn`}>
                      {isUploading ? `업로드 중 (${uploadProgress}%)` : '파일 선택'}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'about_image')} disabled={isUploading} />
                    </label>
                    {aboutData.imageUrl && (
                      <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden">
                        <img src={aboutData.imageUrl} alt="About Preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-navy-900">연혁 (Timeline) 관리</h4>
                    <button 
                      onClick={() => setAboutData({...aboutData, timeline: [...aboutData.timeline, { year: '2026', title: '새 연혁', desc: '설명' }]})}
                      className="text-xs font-bold text-navy-900 flex items-center hover:underline"
                    >
                      <Plus className="h-3 w-3 mr-1" /> 연혁 추가
                    </button>
                  </div>
                  <div className="space-y-4">
                    {aboutData.timeline.map((item, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group">
                        <button 
                          onClick={() => setAboutData({...aboutData, timeline: aboutData.timeline.filter((_, i) => i !== idx)})}
                          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <input 
                            type="text" 
                            placeholder="연도" 
                            className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                            value={item.year}
                            onChange={(e) => {
                              const newTimeline = [...aboutData.timeline];
                              newTimeline[idx].year = e.target.value;
                              setAboutData({...aboutData, timeline: newTimeline});
                            }}
                          />
                          <textarea 
                            placeholder="제목" 
                            rows={1}
                            className="md:col-span-3 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                            value={item.title}
                            onChange={(e) => {
                              const newTimeline = [...aboutData.timeline];
                              newTimeline[idx].title = e.target.value;
                              setAboutData({...aboutData, timeline: newTimeline});
                            }}
                          ></textarea>
                          <textarea 
                            placeholder="설명" 
                            className="md:col-span-4 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                            value={item.desc}
                            onChange={(e) => {
                              const newTimeline = [...aboutData.timeline];
                              newTimeline[idx].desc = e.target.value;
                              setAboutData({...aboutData, timeline: newTimeline});
                            }}
                          ></textarea>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={handleSaveAbout}
                  className="w-full py-4 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/20 flex items-center justify-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>About Us 정보 저장하기</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'experts' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-navy-900 mb-6">{editingExpertId ? '전문가 수정' : '새 전문가 추가'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">이름</label>
                  <input 
                    type="text" 
                    value={newExpert.name}
                    onChange={(e) => setNewExpert({...newExpert, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all"
                    placeholder="예: 김철수 박사"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">직함</label>
                  <input 
                    type="text" 
                    value={newExpert.role}
                    onChange={(e) => setNewExpert({...newExpert, role: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all"
                    placeholder="예: 수석 퀀트 분석가"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-navy-900 mb-2">약력</label>
                  <textarea 
                    value={newExpert.bio}
                    onChange={(e) => setNewExpert({...newExpert, bio: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all h-24"
                    placeholder="전문가의 주요 경력 및 학력을 입력하세요."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-navy-900 mb-2">사진 URL</label>
                  <div className="flex space-x-4">
                    <input 
                      type="text" 
                      value={newExpert.image}
                      onChange={(e) => setNewExpert({...newExpert, image: e.target.value})}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all"
                      placeholder="이미지 URL 입력 또는 파일 업로드"
                    />
                    <button 
                      onClick={() => setShowFileSelector({ target: 'expert_image', type: 'Images' })}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-bold transition-all"
                    >
                      파일함
                    </button>
                    <label className={`px-4 py-3 ${isUploading ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 cursor-pointer'} text-gray-600 rounded-xl text-sm font-bold transition-all btn`}>
                      {isUploading ? `업로드 중 (${uploadProgress}%)` : '파일 선택'}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'expert_image')} disabled={isUploading} />
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={handleSaveExpert}
                  className="flex-1 py-4 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-all flex items-center justify-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>{editingExpertId ? '수정 내용 저장' : '전문가 추가하기'}</span>
                </button>
                {editingExpertId && (
                  <button 
                    onClick={() => {
                      setEditingExpertId(null);
                      setNewExpert({ name: '', role: '', bio: '', image: '' });
                    }}
                    className="px-8 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                  >
                    취소
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experts.map((expert) => (
                <div key={expert.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:border-navy-900 transition-all">
                  <div className="aspect-square bg-gray-50 rounded-xl mb-4 overflow-hidden relative border border-gray-100">
                    {expert.image ? (
                      <img src={expert.image} alt={expert.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <UsersIcon className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-navy-900">{expert.name}</h4>
                  <p className="text-sm text-navy-700 font-medium mb-2">{expert.role}</p>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4">{expert.bio}</p>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setEditingExpertId(expert.id);
                        setNewExpert({
                          name: expert.name,
                          role: expert.role,
                          bio: expert.bio || '',
                          image: expert.image || ''
                        });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold hover:bg-navy-900 hover:text-white transition-all flex items-center justify-center space-x-1"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>수정</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteExpert(expert.id)}
                      className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-navy-900">Notice & News 관리</h3>
                <button 
                  onClick={handleAddNews}
                  className="px-6 py-2 bg-navy-900 text-white rounded-xl text-sm font-bold hover:bg-navy-800 transition-all shadow-md flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>새 뉴스 추가</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-8 py-4">구분</th>
                      <th className="px-8 py-4">제목</th>
                      <th className="px-8 py-4">날짜</th>
                      <th className="px-8 py-4 text-right">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {newsData.length > 0 ? newsData.map((news) => (
                      <tr key={news.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-8 py-4">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                            news.important ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {news.category}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="font-bold text-navy-900">{news.title}</div>
                        </td>
                        <td className="px-8 py-4 text-sm text-gray-500">{news.date}</td>
                        <td className="px-8 py-4 text-right">
                          <button 
                            onClick={() => handleDeleteNews(news.id)}
                            className="p-2 text-gray-300 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center text-gray-400">
                          등록된 뉴스가 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-8" data-section="contact">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-navy-900 mb-6">Contact Us (연락처/위치) 관리</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-navy-900 mb-2">주소</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none"
                      value={contactData.address}
                      onChange={(e) => setContactData({...contactData, address: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-navy-900 mb-2">전화번호</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none"
                      value={contactData.phone}
                      onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-navy-900 mb-2">이메일</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none"
                      value={contactData.email}
                      onChange={(e) => setContactData({...contactData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-navy-900 mb-2">운영시간</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none"
                      value={contactData.hours}
                      onChange={(e) => setContactData({...contactData, hours: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">지도 안내 정보</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none"
                    value={contactData.mapInfo}
                    onChange={(e) => setContactData({...contactData, mapInfo: e.target.value})}
                  />
                </div>
                
                <button 
                  onClick={handleSaveContact}
                  className="w-full py-4 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/20 flex items-center justify-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>Contact 정보 저장하기</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'whyfurie' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-navy-900 mb-6">Why FuriE (강점/특징) 관리</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">페이지 제목</label>
                  <textarea 
                    rows={2} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none"
                    value={whyFuriEData.title}
                    onChange={(e) => setWhyFuriEData({...whyFuriEData, title: e.target.value})}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">페이지 설명</label>
                  <textarea 
                    rows={3} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none"
                    value={whyFuriEData.description}
                    onChange={(e) => setWhyFuriEData({...whyFuriEData, description: e.target.value})}
                  ></textarea>
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-navy-900 mb-4">주요 강점 (Reasons) 관리</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {whyFuriEData.reasons.map((reason, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="space-y-3">
                          <textarea 
                            placeholder="제목" 
                            rows={1}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold"
                            value={reason.title}
                            onChange={(e) => {
                              const newReasons = [...whyFuriEData.reasons];
                              newReasons[idx].title = e.target.value;
                              setWhyFuriEData({...whyFuriEData, reasons: newReasons});
                            }}
                          ></textarea>
                          <textarea 
                            placeholder="설명" 
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                            rows={3}
                            value={reason.desc}
                            onChange={(e) => {
                              const newReasons = [...whyFuriEData.reasons];
                              newReasons[idx].desc = e.target.value;
                              setWhyFuriEData({...whyFuriEData, reasons: newReasons});
                            }}
                          ></textarea>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-navy-900 mb-4">통계 수치 (Stats) 관리</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {whyFuriEData.stats.map((stat, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="space-y-3">
                          <input 
                            type="text" 
                            placeholder="라벨" 
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = [...whyFuriEData.stats];
                              newStats[idx].label = e.target.value;
                              setWhyFuriEData({...whyFuriEData, stats: newStats});
                            }}
                          />
                          <input 
                            type="text" 
                            placeholder="수치" 
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold"
                            value={stat.value}
                            onChange={(e) => {
                              const newStats = [...whyFuriEData.stats];
                              newStats[idx].value = e.target.value;
                              setWhyFuriEData({...whyFuriEData, stats: newStats});
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={handleSaveWhyFuriE}
                  className="w-full py-4 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/20 flex items-center justify-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>Why FuriE 정보 저장하기</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admins' && (
          <div className="max-w-4xl space-y-8" data-section="settings">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-navy-900">Admin 권한 관리</h3>
                  <p className="text-sm text-gray-500 mt-1">관리자 페이지에 접근할 수 있는 이메일 주소를 관리합니다.</p>
                </div>
                <div className="p-3 bg-navy-900/5 rounded-xl text-navy-900">
                  <UsersIcon className="h-6 w-6" />
                </div>
              </div>

              <div className="flex space-x-4 mb-8">
                <div className="flex-1">
                  <input 
                    type="email" 
                    placeholder="추가할 관리자 이메일 주소 입력"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all"
                  />
                </div>
                <button 
                  onClick={() => {
                    if (!newAdminEmail) return;
                    if (siteSettings.authorizedEmails?.includes(newAdminEmail)) {
                      alert('이미 등록된 이메일입니다.');
                      return;
                    }
                    const updatedEmails = [...(siteSettings.authorizedEmails || []), newAdminEmail];
                    setSiteSettings({ ...siteSettings, authorizedEmails: updatedEmails });
                    setNewAdminEmail('');
                  }}
                  className="px-8 py-3 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-all flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>추가</span>
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-navy-900 text-white rounded-full flex items-center justify-center font-bold">W</div>
                    <div>
                      <p className="text-sm font-bold text-navy-900">wooji385@gmail.com</p>
                      <p className="text-xs text-gray-400">시스템 소유자 (기본 관리자)</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-navy-900/10 text-navy-900 text-[10px] font-bold rounded-full uppercase tracking-widest">Owner</span>
                </div>

                {(siteSettings.authorizedEmails || []).map((email) => (
                  <div key={email} className="p-4 bg-white rounded-xl flex items-center justify-between border border-gray-100 hover:shadow-sm transition-all">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center font-bold">
                        {email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-navy-900">{email}</p>
                        <p className="text-xs text-gray-400">추가된 관리자</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        if (window.confirm('이 관리자의 권한을 삭제하시겠습니까?')) {
                          const updatedEmails = siteSettings.authorizedEmails.filter(e => e !== email);
                          setSiteSettings({ ...siteSettings, authorizedEmails: updatedEmails });
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}

                {(siteSettings.authorizedEmails || []).length === 0 && (
                  <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                    <p className="text-gray-400 text-sm">추가된 관리자가 없습니다.</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <button 
                  onClick={handleSaveSettings}
                  className="w-full py-4 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-all flex items-center justify-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>관리자 목록 저장하기</span>
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">
                  * 저장 버튼을 눌러야 변경사항이 최종 반영됩니다.
                </p>
              </div>
            </div>

            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-start space-x-4">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-900">관리자 추가 안내</h4>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  새로운 관리자를 추가하려면 해당 사용자의 구글 계정 이메일 주소를 입력해 주세요. 
                  추가된 사용자는 홈페이지에서 구글 로그인을 통해 관리자 페이지에 접근할 수 있게 됩니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'legal' && (
          <div className="space-y-8" data-section="legal">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-navy-900 mb-6 flex items-center space-x-2">
                <Shield className="h-6 w-6" />
                <span>이용약관 및 개인정보 처리방침</span>
              </h3>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">이용약관 (Markdown 지원)</label>
                  <textarea 
                    value={siteSettings.terms}
                    onChange={(e) => setSiteSettings({...siteSettings, terms: e.target.value})}
                    rows={15}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all font-mono text-sm"
                    placeholder="# 이용약관 내용을 입력하세요..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">개인정보 처리방침 (Markdown 지원)</label>
                  <textarea 
                    value={siteSettings.privacy}
                    onChange={(e) => setSiteSettings({...siteSettings, privacy: e.target.value})}
                    rows={15}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all font-mono text-sm"
                    placeholder="# 개인정보 처리방침 내용을 입력하세요..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">이메일무단수집거부 (Markdown 지원)</label>
                  <textarea 
                    value={siteSettings.emailPolicy}
                    onChange={(e) => setSiteSettings({...siteSettings, emailPolicy: e.target.value})}
                    rows={10}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all font-mono text-sm"
                    placeholder="# 이메일무단수집거부 내용을 입력하세요..."
                  />
                </div>

                <button 
                  onClick={handleSaveSettings}
                  className="w-full py-4 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-all flex items-center justify-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>약관 및 정책 저장하기</span>
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-900">작성 팁</h4>
                <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                  이 필드는 Markdown 형식을 지원합니다. <br />
                  # 제목, ## 소제목, - 리스트 등을 사용하여 내용을 구조화할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100" data-section="settings">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-navy-900 mb-2">메인 히어로 제목 (Hero Title)</label>
                <textarea 
                  rows={2}
                  value={siteSettings.heroTitle}
                  onChange={(e) => setSiteSettings({...siteSettings, heroTitle: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all"
                  placeholder="메인 화면에 표시될 제목을 입력하세요 (줄바꿈 가능)"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-navy-900 mb-2">사이트 이름</label>
                <input 
                  type="text" 
                  value={siteSettings.siteName}
                  onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-navy-900 mb-2">사이트 로고</label>
                <div className="flex space-x-4">
                  <input 
                    type="text" 
                    value={siteSettings.siteLogo}
                    onChange={(e) => setSiteSettings({...siteSettings, siteLogo: e.target.value})}
                    placeholder="URL 입력 또는 파일 업로드"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all"
                  />
                  <button 
                    onClick={() => setShowFileSelector({ target: 'site_logo', type: 'Images' })}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-bold transition-all"
                  >
                    파일함
                  </button>
                  <label className={`px-4 py-3 ${isUploading ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 cursor-pointer'} text-gray-600 rounded-xl text-sm font-bold transition-all btn`}>
                    {isUploading ? `업로드 중 (${uploadProgress}%)` : '파일 선택'}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'site_logo')} disabled={isUploading} />
                  </label>
                  {siteSettings.siteLogo && (
                    <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden">
                      <img src={siteSettings.siteLogo} alt="Logo Preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-navy-900 mb-2">포인트 컬러</label>
                <div className="flex items-center space-x-4">
                  <input 
                    type="color" 
                    value={siteSettings.primaryColor}
                    onChange={(e) => setSiteSettings({...siteSettings, primaryColor: e.target.value})}
                    className="w-12 h-12 rounded-lg border-0 p-0 cursor-pointer"
                  />
                  <span className="text-gray-500 font-mono">{siteSettings.primaryColor}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">대표 이메일</label>
                  <input 
                    type="email" 
                    value={siteSettings.contactEmail}
                    onChange={(e) => setSiteSettings({...siteSettings, contactEmail: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">대표 전화번호</label>
                  <input 
                    type="text" 
                    value={siteSettings.contactPhone}
                    onChange={(e) => setSiteSettings({...siteSettings, contactPhone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">로고 크기 조절</label>
                  <div className="flex items-center space-x-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">크기 (Height)</span>
                        <span className="text-sm font-black text-navy-900 bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100">{siteSettings.logoHeight || 32}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="200"
                        step="1"
                        value={siteSettings.logoHeight || 32}
                        onChange={(e) => setSiteSettings({...siteSettings, logoHeight: parseInt(e.target.value) || 0})}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-navy-900"
                      />
                      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>Small</span>
                        <span>Medium</span>
                        <span>Large</span>
                      </div>
                    </div>
                    
                    <div className="w-px h-16 bg-gray-200 hidden md:block"></div>
                    
                    <div className="flex-1 flex flex-col items-center justify-center min-h-[100px] bg-white rounded-xl border border-dashed border-gray-200 p-4 relative overflow-hidden">
                      <span className="absolute top-2 left-2 text-[10px] font-bold text-gray-300 uppercase">Preview</span>
                      {siteSettings.siteLogo ? (
                        <img 
                          src={siteSettings.siteLogo} 
                          alt="Logo Preview" 
                          style={{ height: `${siteSettings.logoHeight || 32}px`, width: 'auto' }}
                          className="object-contain transition-all duration-300"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-xs text-gray-400 italic">로고를 업로드해 주세요</span>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-gray-400">
                    * 로고의 높이를 기준으로 전체 크기가 비율에 맞춰 조절됩니다. 
                    기존의 복잡한 여백 및 너비 설정은 제거되었습니다.
                  </p>
                </div>
              </div>

              <button 
                onClick={handleSaveSettings}
                className="w-full py-4 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-all flex items-center justify-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>설정 저장하기</span>
              </button>
            </div>
          </div>
        )}
        {/* File Selector Modal */}
        {showFileSelector && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white w-full max-w-4xl max-h-[80vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                  <h3 className="text-xl font-bold text-navy-900">파일함에서 선택</h3>
                  <p className="text-xs text-gray-500 mt-1">이전에 업로드한 파일을 선택하여 적용할 수 있습니다.</p>
                </div>
                <button 
                  onClick={() => setShowFileSelector(null)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {files
                    .filter(f => showFileSelector.type === 'all' || f.category === showFileSelector.type)
                    .map(file => (
                      <div 
                        key={file.id} 
                        onClick={() => handleSelectFile(file)}
                        className="group cursor-pointer bg-gray-50 rounded-2xl border border-gray-100 p-4 hover:border-navy-900 hover:bg-navy-900/5 transition-all"
                      >
                        <div className="aspect-square bg-white rounded-xl mb-3 flex items-center justify-center overflow-hidden border border-gray-100 group-hover:shadow-inner">
                          {file.category === 'Images' ? (
                            <img src={file.path} alt={file.name} className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
                          ) : (
                            <FileText className="h-10 w-10 text-navy-200" />
                          )}
                        </div>
                        <p className="text-xs font-bold text-navy-900 truncate" title={file.name}>{file.name}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{file.size} • {new Date(file.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  {files.filter(f => showFileSelector.type === 'all' || f.category === showFileSelector.type).length === 0 && (
                    <div className="col-span-full py-20 text-center">
                      <p className="text-gray-400 font-medium">업로드된 파일이 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button 
                  onClick={() => setShowFileSelector(null)}
                  className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-all"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </div>
        )}
        {/* Floating Save All Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveAll}
            disabled={isSavingAll}
            className={`flex items-center space-x-3 px-8 py-4 rounded-full shadow-2xl transition-all border-4 border-white/20 backdrop-blur-sm ${
              isSavingAll 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-navy-900 hover:bg-navy-800 text-white'
            }`}
          >
            {isSavingAll ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            <span className="font-bold text-lg">전체 설정 저장</span>
          </motion.button>
        </div>
      </main>
    </div>
  );
}
