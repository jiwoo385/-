import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Admin from '@/pages/Admin';
import About from '@/pages/About';
import Product from '@/pages/Product';
import Clients from '@/pages/Clients';
import News from '@/pages/News';
import Contact from '@/pages/Contact';
import WhyFuriE from '@/pages/WhyFuriE';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import EmailPolicy from '@/pages/EmailPolicy';
import ScrollToTop from '@/components/ScrollToTop';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Main Site Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/product" element={<Product />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/why-furie" element={<WhyFuriE />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/email-policy" element={<EmailPolicy />} />
          <Route path="*" element={<Home />} />
        </Route>
        
        {/* Admin Route without Layout */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}
