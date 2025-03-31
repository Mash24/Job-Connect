import React from 'react'
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';
import TITLE from '../components/common/Title'


    const testimonials = [
      {
        name: 'Alex M.',
        title: 'Software Developer @ TechCorp',
        quote: "I was struggling to find the right job until I joined Job Connect. Within two weeks, I landed multiple interviews and secured my dream job!",
        rating: 5,
        badge: 'Verified Job Seeker',
        image: '/images/alex.jpg'
      },
      {
        name: 'Jessica R.',
        title: 'HR Manager @ GrowthX',
        quote: "We needed top-tier candidates for a critical role. Job Connect’s talent pool made hiring effortless—we found the perfect fit in just five days!",
        rating: 5,
        badge: 'Verified Employer',
        image: '/images/jessica.jpg'
      },
      {
        name: 'Mark T.',
        title: 'Freelancer | UI/UX Designer',
        quote: "As a freelancer, finding consistent gigs was tough. Job Connect gave me three high-paying clients in my first month!",
        rating: 4,
        badge: 'Top Freelancer',
        image: '/images/mark.jpg'
      },
      {
        name: 'Sophia K.',
        title: 'Recent Graduate | Marketing Intern @ BrightStart',
        quote: "I was fresh out of college and had zero experience. Thanks to Job Connect, I got an internship that turned into a full-time role!",
        rating: 5,
        badge: 'Success Story',
        image: '/images/sophia.jpg'
      },
      {
        name: 'David W.',
        title: 'Warehouse Worker @ LogisticsPro',
        quote: "I needed a stable job fast. Job Connect helped me find a warehouse position in my area within days. Highly recommended!",
        rating: 4,
        badge: 'Reliable Hire',
        image: '/images/david.jpg'
      },
      {
        name: 'Maria L.',
        title: 'Retail Associate @ FashionHub',
        quote: "I love fashion but struggled to break into the industry. Job Connect matched me with a retail store that values my skills!",
        rating: 5,
        badge: 'Retail Rockstar',
        image: '/images/maria.jpg'
      },
      {
        name: 'James P.',
        title: 'Construction Worker @ BuildRight',
        quote: "Job Connect made it easy to connect with contractors looking for skilled workers. Now I have steady work and better pay.",
        rating: 4,
        badge: 'Skilled Tradesman',
        image: '/images/james.jpg'
      },
      {
        name: 'Emily R.',
        title: 'Remote Virtual Assistant',
        quote: "Working remotely seemed impossible for me before. Job Connect helped me secure a virtual assistant job that fits my schedule!",
        rating: 5,
        badge: 'Remote Work Success',
        image: '/images/emily.jpg'
      },
      {
        name: 'Carlos G.',
        title: 'Delivery Driver @ FastTrack',
        quote: "After losing my job, I needed something flexible. Job Connect helped me land a delivery job that pays well and works with my schedule!",
        rating: 4,
        badge: 'Fast & Reliable',
        image: '/images/carlos.jpg'
      },
      {
        name: 'Nina S.',
        title: 'Chef @ Five Star Bistro',
        quote: "I wanted to showcase my culinary skills but needed the right opportunity. Job Connect linked me to a great restaurant!",
        rating: 5,
        badge: 'Culinary Expert',
        image: '/images/nina.jpg'
      },
    ];

const Testimonials = () => {
  return (
    <section id="testimonials" className="w-full px-6 md:px-20 py-20 bg-white text-gray-800">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">Success Stories from <span className='text-yellow-500'>{TITLE}</span></h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Don't just take our word for it. See what our users have to say about finding jobs, hiring top talents, and growing careers with <span className='text-yellow-500'>{TITLE}</span> </p>
        <p className="italic text-sm mt-2 text-gray-500">"Changing the way we find and hire talent, one job at a time."</p>
      </div>

{/* Testimonial Cards */} {/* Swiper Carousel */}

        <Swiper
          modules = {[Navigation, Autoplay]}
          spaceBetween = {30}
          slidesPerView = {1}
          loop = {true}
          navigation
          autoplay = {{ delay: 5000, disableOnInteraction: false }}
          breakpoints = {{
            768: {slidesPerView: 2},
            1024: {slidesPerView: 3},
          }}
          className = "mt-10"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-lg p-6 h-full flex flex-col justify-between hover:shadow-2xl transition duration-300 ease-in-out">
{/* Container inserting the image, name and title */}
                  <div className="flex items-center gap-4 mb-4">
                      <img src= {testimonial.image} alt= {testimonial.name} className='w-14 h-14 rounded-full object-cover border-2 border-blue-600' />
                      <h4 className="text-lg font-semibold text-blue-800">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.title}</p>
                  </div>

                  <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key = {i} className = 'text-yellow-400 text-sm' />
                    ))}
                  </div>
                      <span className="inline-block mt-2 text-xs text-white bg-blue-600 px-3 py-1 rounded-full self-start">{testimonial.badge}</span>
                </div>
              </SwiperSlide>
            ))}
 
        </Swiper>

   {/* CTA Button */}
        <div className="text-center mt-16">
         <p className="text-lg font-medium mb-4">Your story is our success. Share your experience with us.</p>
         <Link to="/register" className='px-8 py-3 bg-yellow-500 text-blue-800 font-bold rounded-lg hover:bg-blue-500 hover:text-white transition duration-300'>
           Join the conversation for Free!
        </Link>
      </div>
    </section>
  )
}

export default Testimonials