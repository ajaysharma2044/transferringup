import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import ClientPortal from './components/portal/ClientPortal';
import ConsultationSuccess from './components/ConsultationSuccess';
import BlogList from './components/blog/BlogList';
import BlogPostPage from './components/blog/BlogPost';
import Header from './components/Header';
import MovingBanner from './components/MovingBanner';
import Hero from './components/Hero';
import YashHero from './components/YashHero';
import Services from './components/Services';
import About from './components/About';
import Team from './components/Team';
import Tutoring from './components/Tutoring';
import SchoolsShowcase from './components/SchoolsShowcase';
import SuccessStories from './components/SuccessStories';
import BuildPackage from './components/BuildPackage';
import ConsultationBooking from './components/ConsultationBooking';
import Contact from './components/Contact';
import Footer from './components/Footer';

import ResultsShowcase from './components/ResultsShowcase';
import Reviews from './components/Reviews';
import SubmitReview from './components/SubmitReview';
import SEOHead from './components/SEOHead';

function App() {
  const isPortalRoute = window.location.pathname.startsWith('/portal');
  const isSuccessRoute = window.location.pathname === '/consultation-success';
  const isBlogRoute = window.location.pathname.startsWith('/blog');

  if (isPortalRoute) {
    return (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/portal/*" element={<ClientPortal />} />
          </Routes>
        </Router>
      </AuthProvider>
    );
  }

  if (isSuccessRoute) {
    return (
      <Router>
        <Routes>
          <Route path="/consultation-success" element={<ConsultationSuccess />} />
        </Routes>
      </Router>
    );
  }

  if (isBlogRoute) {
    return (
      <Router>
        <Routes>
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </Router>
    );
  }

  const isSubmitReviewRoute = window.location.pathname === '/submit-review';

  if (isSubmitReviewRoute) {
    return <SubmitReview />;
  }

  const isReviewsRoute = window.location.pathname === '/reviews';

  if (isReviewsRoute) {
    return (
      <div className="min-h-screen">
        <SEOHead />
        <Header />
        <Reviews />
        <Footer />
      </div>
    );
  }

  const [activeSection, setActiveSection] = useState<string>('home');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Handle hash changes for navigation
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveSection(hash);
      } else {
        setActiveSection('home');
      }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Check initial hash
    handleHashChange();

    const observeElements = () => {
      const elements = document.querySelectorAll('.scroll-fade-in, .scroll-scale-in, .scroll-slide-left, .scroll-slide-right, .section-reveal, .blur-up, .bounce-in, .divider-animate, .zoom-on-scroll, .grid-stagger');

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -60px 0px'
      });

      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    };

    let ticking = false;
    const handleParallax = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const parallaxElements = document.querySelectorAll('.scroll-parallax');
          parallaxElements.forEach((element) => {
            const yPos = -(scrolled * 0.3);
            (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    const cleanup = observeElements();
    window.addEventListener('scroll', handleParallax, { passive: true });

    return () => {
      cleanup();
      window.removeEventListener('scroll', handleParallax);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.scroll-fade-in, .scroll-scale-in, .scroll-slide-left, .scroll-slide-right, .section-reveal, .blur-up, .bounce-in, .divider-animate, .zoom-on-scroll, .grid-stagger');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
      elements.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, 100);
    return () => clearTimeout(timer);
  }, [activeSection]);

  // Mobile: Show everything on one page
  const renderMobileContent = () => {
    return (
      <>
        <Hero />
        <ResultsShowcase />
        <YashHero />
        <About />
        <Services />
        <BuildPackage />
        <ConsultationBooking />
        <Team />
        <SchoolsShowcase />
        <SuccessStories />
        <Contact />
        <Footer />
      </>
    );
  };

  // Desktop: Show sections based on navigation
  const renderContent = () => {
    switch (activeSection) {
      case 'services':
        return (
          <>
            <Services />
            <Footer />
          </>
        );
      case 'about':
        return (
          <>
            <About />
            <Footer />
          </>
        );
      case 'team':
        return (
          <>
            <Team />
            <Footer />
          </>
        );
      case 'contact':
        return (
          <>
            <Contact />
            <Footer />
          </>
        );
      case 'schools':
        return (
          <>
            <SchoolsShowcase />
            <Footer />
          </>
        );
      case 'success':
        return (
          <>
            <SuccessStories />
            <Footer />
          </>
        );
      case 'build-package':
        return (
          <>
            <BuildPackage />
            <Footer />
          </>
        );
      case 'consultation':
        return (
          <>
            <ConsultationBooking />
            <Footer />
          </>
        );
      default:
        return (
          <>
            <Hero />
            <ResultsShowcase />
            <YashHero />
            <About />
            <Services />
            <BuildPackage />
            <ConsultationBooking />
            <Footer />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead />
      <div className="sticky top-0 z-50">
        <Header />
        <MovingBanner />
      </div>
      {isMobile ? renderMobileContent() : renderContent()}
    </div>
  );
}

export default App;