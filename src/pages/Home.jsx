import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Components
import Hero from '../Landing/Hero';
import Features from '../Landing/Features';
import HowItWorks from '../Landing/HowItWorks';
import Testimonials from '../Landing/Testimonials';
import FinalCTA from '../Landing/FinalCTA';
import Footer from '../components/layouts/Footer';
import FAQ from '../Landing/FAQ';
import SearchBar from '../components/common/SearchBar';
import FeaturedJobs from '../components/home/FeaturedJobs';
import CompanyLogos from '../components/home/CompanyLogos';
// import SuccessStories from '../components/home/SuccessStories';
import JobCategories from '../components/home/JobCategories';
import SalaryCalculator from '../components/home/SalaryCalculator';
import SkillsAssessment from '../components/home/SkillsAssessment';

// Services
import { trackPageView, trackSectionVisibility } from '../services/analytics';
import performanceMonitor from '../services/performance';

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert" className="p-4 bg-red-50 text-red-700 rounded-lg">
    <h2 className="text-lg font-semibold">Something went wrong:</h2>
    <pre className="mt-2 text-sm">{error.message}</pre>
    <button
      onClick={resetErrorBoundary}
      className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Try again
    </button>
  </div>
);

const Home = () => {
  useEffect(() => {
    // Track page view
    trackPageView('Home');
    
    // Start performance monitoring
    performanceMonitor.startMeasure('home_page_load');
    
    // Track section visibility
    const sections = ['hero', 'features', 'how-it-works', 'testimonials', 'faq'];
    sections.forEach(section => {
      performanceMonitor.observeElement(section, () => {
        trackSectionVisibility(section);
      });
    });

    return () => {
      // End performance monitoring
      performanceMonitor.endMeasure('home_page_load');
      // Clear observers
      sections.forEach(section => {
        performanceMonitor.unobserveElement(section);
      });
    };
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Helmet>
        <title>Job Connect - Your One Stop For All Great Job Opportunities</title>
        <meta name="description" content="Find your dream job, connect with top employers, and get hired faster with Job Connect. We offer AI-powered job matching, real-time alerts, and seamless employer connections." />
        <meta name="keywords" content="job search, career, employment, hiring, recruitment, job matching, AI jobs, career development" />
        <meta property="og:title" content="Job Connect - Your Career Success Platform" />
        <meta property="og:description" content="Find your dream job with AI-powered matching and real-time alerts. Connect with top employers and accelerate your career." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Job Connect - Your Career Success Platform" />
        <meta name="twitter:description" content="Find your dream job with AI-powered matching and real-time alerts. Connect with top employers and accelerate your career." />
      </Helmet>

      <main>
        <Hero />
        <SearchBar />
        <JobCategories />
        <FeaturedJobs />
        <CompanyLogos />
        <Features />
        <HowItWorks />
        {/* <SuccessStories /> */}
        <Testimonials />
        <SalaryCalculator />
        <SkillsAssessment />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />
    </ErrorBoundary>
  );
};

export default Home;