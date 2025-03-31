import React from 'react';
import Hero from '../Landing/Hero';
import Features from '../Landing/Features';
import HowItWorks from '../Landing/HowItWorks';
import Testimonials from '../Landing/Testimonials';
import FinalCTA from '../Landing/FinalCTA';
import Footer from '../components/layouts/Footer';
import FAQ from '../Landing/FAQ';

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  );
};

export default Home;