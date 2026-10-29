import { StrictMode, useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import { MobileCallBar, Navbar } from './components/Nav';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Technology } from './components/Technology';
import { Faq, Gallery, Reviews, ServiceArea, WhyUs } from './components/Sections';
import { Contact } from './components/Contact';
import { Footer, LegalDialog, type LegalDoc } from './components/Footer';
import './index.css';

function App() {
  const [legal, setLegal] = useState<LegalDoc>(null);
  const close = useCallback(() => setLegal(null), []);
  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main id="main">
        <Hero />
        <Services />
        <Technology />
        <WhyUs />
        <Gallery />
        <ServiceArea />
        <Reviews />
        <Faq />
        <Contact onOpenPrivacy={() => setLegal('privacy')} />
      </main>
      <Footer onOpenLegal={setLegal} />
      <MobileCallBar />
      <LegalDialog doc={legal} onClose={close} />
    </MotionConfig>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
