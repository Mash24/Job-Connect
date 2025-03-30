import React from 'react';
import Hero from '../Landing/Hero';
import Features from '../Landing/Features';
import HowItWorks from '../Landing/HowItWorks';
import Testimonials from '../Landing/Testimonials';
import FinalCTA from '../Landing/FinalCTA';
import Footer from '../components/layouts/Footer';

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </>
  );
};

export default Home;