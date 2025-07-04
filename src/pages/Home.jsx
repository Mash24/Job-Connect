import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { AnimatePresence } from 'framer-motion';
import { 
  Search, TrendingUp, Users, Briefcase, 
  MapPin, DollarSign, Star, ArrowRight,
  Play, Pause, Volume2, VolumeX
} from 'lucide-react';
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
import JobCategories from '../components/home/JobCategories';
import SalaryCalculator from '../components/home/SalaryCalculator';
import SkillsAssessment from '../components/home/SkillsAssessment';

// Services
import { trackPageView, trackSectionVisibility } from '../services/analytics';
import performanceMonitor from '../services/performance';

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div 
    role="alert" 
    className="p-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl shadow-lg"
  >
    <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong:</h2>
    <pre className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded">{error.message}</pre>
    <button
      onClick={resetErrorBoundary}
      className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Try again
    </button>
  </div>
);

/**
 * @component LiveStats
 * @description Animated live statistics component
 */
const LiveStats = () => {
  const [stats, setStats] = useState({
    jobs: 0,
    companies: 0,
    users: 0,
    successRate: 0
  });

  useEffect(() => {
    // Simulate live stats
    const interval = setInterval(() => {
      setStats(prev => ({
        jobs: prev.jobs + Math.floor(Math.random() * 5),
        companies: prev.companies + Math.floor(Math.random() * 2),
        users: prev.users + Math.floor(Math.random() * 10),
        successRate: Math.min(98, prev.successRate + Math.random() * 0.5)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Live Platform Stats
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          className="text-center"
        >
          <div className="text-2xl font-bold text-white">{stats.jobs.toLocaleString()}</div>
          <div className="text-sm text-white/80">Active Jobs</div>
        </div>
        <div 
          className="text-center"
        >
          <div className="text-2xl font-bold text-white">{stats.companies.toLocaleString()}</div>
          <div className="text-sm text-white/80">Companies</div>
        </div>
        <div 
          className="text-center"
        >
          <div className="text-2xl font-bold text-white">{stats.users.toLocaleString()}</div>
          <div className="text-sm text-white/80">Users</div>
        </div>
        <div 
          className="text-center"
        >
          <div className="text-2xl font-bold text-white">{stats.successRate.toFixed(1)}%</div>
          <div className="text-sm text-white/80">Success Rate</div>
        </div>
      </div>
    </div>
  );
};

/**
 * @component QuickActions
 * @description Quick action buttons for common tasks
 */
const QuickActions = () => {
  const actions = [
    { icon: Search, label: 'Search Jobs', color: 'bg-blue-500 hover:bg-blue-600' },
    { icon: Briefcase, label: 'Post Job', color: 'bg-green-500 hover:bg-green-600' },
    { icon: Users, label: 'Find Talent', color: 'bg-purple-500 hover:bg-purple-600' },
    { icon: Star, label: 'Featured', color: 'bg-yellow-500 hover:bg-yellow-600' }
  ];

  return (
    <div 
      className="flex flex-wrap gap-3 justify-center"
    >
      {actions.map((action) => (
        <button
          key={action.label}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all ${action.color}`}
        >
          <action.icon className="w-4 h-4" />
          {action.label}
        </button>
      ))}
    </div>
  );
};

/**
 * @component FloatingActionButton
 * @description Floating action button for quick access
 */
const FloatingActionButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <button
          className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50 flex items-center justify-center"
        >
          <ArrowRight className="w-5 h-5 rotate-[-90deg]" />
        </button>
      )}
    </AnimatePresence>
  );
};

const Home = () => {
  const [isMuted, setIsMuted] = useState(false);

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

      <main className="relative">
        {/* Hero Section */}
        <div
        >
          <Hero />
        </div>

        {/* Enhanced Search Section */}
        <div
          className="relative z-10 -mt-8"
        >
          <div className="max-w-4xl mx-auto px-4">
            <SearchBar />
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className="py-8 bg-gradient-to-r from-blue-50 to-purple-50"
        >
          <div className="max-w-6xl mx-auto px-4">
            <QuickActions />
          </div>
        </div>

        {/* Live Stats */}
        <div
          className="py-8 bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <div className="max-w-6xl mx-auto px-4">
            <LiveStats />
          </div>
        </div>

        {/* Job Categories */}
        <div
          className="py-16"
        >
          <JobCategories />
        </div>

        {/* Featured Jobs */}
        <div
          className="py-16 bg-gray-50"
        >
          <FeaturedJobs />
        </div>

        {/* Company Logos */}
        <div
          className="py-16"
        >
          <CompanyLogos />
        </div>

        {/* Features */}
        <div
          className="py-16 bg-gradient-to-r from-blue-50 to-purple-50"
        >
          <Features />
        </div>

        {/* How It Works */}
        <div
          className="py-16"
        >
          <HowItWorks />
        </div>

        {/* Testimonials */}
        <div
          className="py-16 bg-gray-50"
        >
          <Testimonials />
        </div>

        {/* Salary Calculator */}
        <div
          className="py-16"
        >
          <SalaryCalculator />
        </div>

        {/* Skills Assessment */}
        <div
          className="py-16 bg-gradient-to-r from-green-50 to-blue-50"
        >
          <SkillsAssessment />
        </div>

        {/* FAQ */}
        <div
          className="py-16"
        >
          <FAQ />
        </div>

        {/* Final CTA */}
        <div
          className="py-16 bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <FinalCTA />
        </div>
      </main>

      <Footer />

      {/* Floating Action Button */}
      <FloatingActionButton />

      {/* Audio Control (for background music if added) */}
      <button
        className="fixed top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full shadow-lg hover:bg-white/30 transition-colors z-50 flex items-center justify-center"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </ErrorBoundary>
  );
};

export default Home;