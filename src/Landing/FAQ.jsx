import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { Link } from 'react-router-dom'
import { FaPlus, FaMinus } from 'react-icons/fa'
import TITLE from '../components/common/Title'


// TODO: Add FAQ section with accordions for each question. Add a link to the bottom of the page that says "View all FAQs".
const faqs = [
  {
    category: "General",
    questions: [
      {
        question: "What is Job Connect, and how does it work?",
        answer: "Job Connect is a platform that bridges the gap between job seekers and employers. Candidates can create profiles, upload resumes, and apply for jobs, while employers can post job listings and find suitable talent.",
      },
      {
        question: "Is Job Connect free to use?",
        answer: "Yes! Job seekers can use the platform for free to browse and apply for jobs. Employers can post a limited number of job listings for free, with premium options available for additional features.",
      },
      {
        question: "How do I sign up?",
        answer: "To sign up, click on the 'Register' button on the homepage, choose whether you're a job seeker or employer, and complete the required details.",
      },
      {
        question: "Can I use Job Connect on my mobile device?",
        answer: "Yes, our platform is fully optimized for mobile use. You can access all features through your phone’s browser or our upcoming mobile app.",
      },
    ],
  },
  {
    category: "For Job Seekers",
    questions: [
      {
        question: "How do I apply for a job?",
        answer: "To apply for a job, log into your account, browse job listings, and click 'Apply' on the jobs that interest you. Ensure your resume is up to date before submitting your application.",
      },
      {
        question: "How can I improve my chances of getting hired?",
        answer: "Make sure your profile is complete and up to date. Tailor your resume and cover letter for each job application, and consider networking with professionals in your field.",
      },
      {
        question: "What types of jobs are available?",
        answer: "Job Connect offers a wide range of job categories, including full-time, part-time, freelance, and remote positions across multiple industries.",
      },
      {
        question: "Can I get remote job opportunities?",
        answer: "Yes! You can filter job listings to find remote work opportunities in various fields, including tech, customer service, marketing, and more.",
      },
    ],
  },
  {
    category: "For Employers",
    questions: [
      {
        question: "How do I post a job?",
        answer: "Log in to your employer account, navigate to the 'Post a Job' section, fill in the job details, and publish your listing to start receiving applications.",
      },
      {
        question: "Are there paid plans for employers?",
        answer: "Yes! We offer premium plans that provide greater visibility for job postings, access to top candidates, and additional hiring tools.",
      },
      {
        question: "Can I search for candidates directly?",
        answer: "Absolutely! Employers can use our candidate search feature to find potential hires based on skills, experience, and location.",
      },
      {
        question: "How do I manage job applications?",
        answer: "You can review applications through your employer dashboard, shortlist candidates, schedule interviews, and communicate with applicants directly.",
      },
    ],
  },
  {
    category: "Security & Privacy",
    questions: [
      {
        question: "How do you protect my data?",
        answer: "We use industry-standard encryption and secure authentication methods to protect user data. Your personal information is never shared without your consent.",
      },
      {
        question: "Can employers see my personal information?",
        answer: "Employers can only view the details you choose to share on your profile, such as your resume and job-related information.",
      },
      {
        question: "How can I report a suspicious job posting?",
        answer: "If you come across a job listing that seems fraudulent, you can report it using the 'Report' button on the job posting or contact our support team.",
      },
    ],
  },
  {
    category: "Technical Support",
    questions: [
      {
        question: "I forgot my password. How do I reset it?",
        answer: "Click on the 'Forgot Password' link on the login page and follow the instructions to reset your password.",
      },
      {
        question: "I’m having trouble logging in. What should I do?",
        answer: "Ensure that you’re entering the correct email and password. If the issue persists, try clearing your browser cache or using a different device.",
      },
      {
        question: "How can I contact support?",
        answer: "You can reach out to our support team via the 'Contact Support' button at the bottom of this page or by emailing support@jobconnect.com.",
      },
    ],
  },
];


const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (key) => {
    setOpenQuestion(openQuestion === key ? null : key);
  };

  return (
    <section id="faq" className="w-full py-24">
      {/* FAQ Section Header */}
      <motion.div
          initial={{ opacity: 0, y:30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
          className='text-center max-w-3xl mx-auto mb-12'
      >
      <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mb-3">Frequently Asked Questions</h2>
      <p className="text-lg text-gray-600">Got questions? We've got answers! Here's what you need to know about using <span className='text-yellow-500 font-semibold'>{TITLE}</span>.</p>
      </motion.div>

      {/* End of FAQ Section Header and beginning of FAQ Accordion*/}
      <div className="max-w-4xl mx-auto divide-y divide-gray-300">
        {faqs.map((section, sectionIndex) =>(
          <div key={sectionIndex} className='py-8'>
            <h3 className="text-2xl font-semibold text-blue-700 mb-4 border-b bp-1">{section.category}</h3>

            <div className="space-y-4">
              {section.questions.map((item, itemIndex) => {
                const key = `${sectionIndex}-${itemIndex}`;
                const isOpen = openQuestion === key;

                return (
                  <motion.div key={key} className='bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all duration-300 cursor-pointer' >
                    <div className="flex justify-between items-center" onClick={()=> toggleQuestion(key)}>
                      <p className="text-xl font-medium text-gray-900">{item.question}</p>
                      <span>{isOpen ? <FaMinus className='text-blue-600' /> : <FaPlus className='text-blue-600' />}</span>
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                            initial = {{ opacity: 0, height: 0 }}
                            animate = {{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4 }}
                            className='mt-3 text-sm text-gray-700 leading-relaxed'
                        >
                          {item.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Support CTA */}
      <motion.div
          inition = {{ opacity: 0, y:20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
          className='text-center mt-16'
      >
        <p className="text-lg text-gray-700 font-medium mb-3">Still have a question? We're happy to help!</p>
        <Link to="/contact"className="inline-block px-8 py-3 bg-blue-700 text-white rounded-lg font-bold hover:bg-yellow-500 hover:text-black transition duration-300">Contact Support</Link>
      </motion.div>
    </section>
  );
};

export default FAQ