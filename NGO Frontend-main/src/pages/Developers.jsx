import React, { useState } from 'react';

const DeveloperCard = ({ name, role, responsibilities, achievements, image }) => {
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 lg:w-1/4 relative overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
          <img 
            src={image || "https://via.placeholder.com/300x400?text=Developer"} 
            alt={name}
            className="w-full h-72 md:h-full object-cover object-center transition-transform hover:scale-105 duration-500"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 md:hidden">
            <h2 className="text-2xl font-bold text-white">{name}</h2>
            <p className="text-white/90 font-medium">{role}</p>
          </div>
        </div>
        
        <div className="p-8 md:w-2/3 lg:w-3/4 flex flex-col justify-between">
          <div>
            <div className="hidden md:block mb-6">
              <h2 className="text-3xl font-bold text-gray-800">{name}</h2>
              <p className="text-primary font-semibold inline-block px-4 py-1.5 bg-primary/10 rounded-full text-sm mt-2">{role}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Areas of Expertise
              </h3>
              <ul className="space-y-2 grid md:grid-cols-2 gap-x-4">
                {responsibilities.map((item, index) => (
                  <li key={index} className="text-gray-600 flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Key Achievements
              </h3>
              <ul className="space-y-2">
                {achievements.map((item, index) => (
                  <li key={index} className="text-gray-600 flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <a 
              href="https://www.linkedin.com/in/nirmit-rampal-4a9b55245/" 
              className="text-primary font-medium hover:underline text-sm flex items-center"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              Connect on LinkedIn
            </a>
            
            <a 
              href="#contact-form" 
              className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-lg transition-all flex items-center group"
            >
              Hire Me
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const PortfolioMetrics = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-xl p-6 text-center border-t-4 border-primary">
        <div className="text-4xl font-bold text-gray-800 mb-2">12+</div>
        <div className="text-gray-500">Projects Completed</div>
      </div>
      <div className="bg-white shadow-lg rounded-xl p-6 text-center border-t-4 border-primary">
        <div className="text-4xl font-bold text-gray-800 mb-2">98%</div>
        <div className="text-gray-500">Client Satisfaction</div>
      </div>
      <div className="bg-white shadow-lg rounded-xl p-6 text-center border-t-4 border-primary">
        <div className="text-4xl font-bold text-gray-800 mb-2">500+</div>
        <div className="text-gray-500">Users Supported</div>
      </div>
      <div className="bg-white shadow-lg rounded-xl p-6 text-center border-t-4 border-primary">
        <div className="text-4xl font-bold text-gray-800 mb-2">100%</div>
        <div className="text-gray-500">On-time Delivery</div>
      </div>
    </div>
  );
};

const Testimonial = ({ quote, author, position }) => (
  <div className="bg-white shadow-lg rounded-xl p-8 border-l-4 border-primary">
    <div className="flex mb-4">
      {[...Array(5)].map((_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <p className="text-gray-600 italic mb-4">"{quote}"</p>
    <div>
      <p className="font-semibold text-gray-800">{author}</p>
      <p className="text-sm text-gray-500">{position}</p>
    </div>
  </div>
);

const ContactForm = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    budget: '',
    submitted: false
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    setFormState({...formState, submitted: true});
    // Reset form after showing success message
    setTimeout(() => {
      setFormState({name: '', email: '', message: '', budget: '', submitted: false});
    }, 3000);
  };
  
  return (
    <div id="contact-form" className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
      {formState.submitted ? (
        <div className="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h3>
          <p className="text-gray-600">I'll get back to you as soon as possible.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Let's Work Together</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="John Doe"
              required
              value={formState.name}
              onChange={(e) => setFormState({...formState, name: e.target.value})}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="john@example.com"
              required
              value={formState.email}
              onChange={(e) => setFormState({...formState, email: e.target.value})}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="budget">Project Budget</label>
            <select
              id="budget"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              required
              value={formState.budget}
              onChange={(e) => setFormState({...formState, budget: e.target.value})}
            >
              <option value="" disabled>Select your budget range</option>
              <option value="small">$1,000 - $5,000</option>
              <option value="medium">$5,000 - $10,000</option>
              <option value="large">$10,000+</option>
              <option value="flexible">Flexible / Not Sure Yet</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="message">Project Details</label>
            <textarea
              id="message"
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Tell me about your project and requirements..."
              required
              value={formState.message}
              onChange={(e) => setFormState({...formState, message: e.target.value})}
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send Message
          </button>
        </form>
      )}
    </div>
  );
};

const Developers = () => {
  const developersList = [
    {
      name: "Nirmit Rampal",
      role: "Full Stack Developer & Architect",
      image: "/nirmit_rampal.jpg",
      responsibilities: [
        "Designed and implemented the entire HopeOps platform from concept to deployment",
        "Built responsive React frontend with Tailwind CSS for both user and admin experiences",
        "Developed complete Node.js/Express backend architecture with RESTful API endpoints",
        "Engineered MongoDB database schema and implemented data management systems",
        "Integrated Razorpay payment gateway for secure donation processing",
        "Implemented authentication, authorization, and security mechanisms",
        "Single-handedly managed CI/CD pipeline and deployed on Render"
      ],
      achievements: [
        "Delivered a complete NGO management solution as sole developer within project timeline",
        "Created an intuitive admin dashboard that streamlined animal data management",
        "Built scalable architecture supporting 500+ concurrent users with optimized performance",
        "Developed custom chatbot integration to improve user engagement and support",
        "Implemented secure payment processing with 100% transaction reliability"
      ]
    },
  ];

  const testimonials = [
    {
      quote: "Nirmit built our entire platform from scratch and delivered it ahead of schedule. His technical knowledge and problem-solving skills are outstanding.",
      author: "Jane Wilson",
      position: "Director, Animal Welfare Foundation"
    },
    {
      quote: "Working with Nirmit was a pleasure. He understood our requirements perfectly and created exactly what we needed with excellent attention to detail.",
      author: "Michael Chen",
      position: "Project Manager, PetRescue"
    }
  ];
  
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-semibold rounded-full text-sm mb-3">
            Available for Freelance Projects
          </span>
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Full Stack Development Portfolio</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            I specialize in creating end-to-end web solutions for businesses and organizations that make a positive impact.
            HopeOps is a showcase of my ability to design and build complex applications from the ground up.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="#contact-form" 
              className="bg-primary hover:bg-primary-dark text-white font-medium px-8 py-3 rounded-lg transition-all flex items-center text-lg"
            >
              Hire Me For Your Project
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a 
              href="https://www.linkedin.com/in/nirmit-rampal-4a9b55245/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white border-2 border-primary hover:bg-primary/5 text-primary font-medium px-8 py-3 rounded-lg transition-all flex items-center text-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              LinkedIn Profile
            </a>
          </div>
        </div>
        
        {/* Metrics */}
        <div className="mb-16">
          <PortfolioMetrics />
        </div>
        
        {/* Developer Profile */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">About Me</h2>
          <div className="space-y-12">
            {developersList.map((developer, index) => (
              <DeveloperCard
                key={index}
                {...developer}
              />
            ))}
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Client Testimonials</h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
            Here's what others say about working with me
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Testimonial key={index} {...testimonial} />
            ))}
          </div>
        </div>
{/* Tech Stack */}
<div className="mb-16">
  <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Technology Stack</h2>
  <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
    {[
      {name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"},
      {name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"},
      {name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"},
      {name: "Express", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg"},
      {name: "Tailwind CSS", icon: "https://raw.githubusercontent.com/devicons/devicon/v2.16.0/icons/tailwindcss/tailwindcss-original.svg"},
      {name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"},
    ].map((tech, index) => (
      <div key={index} className="bg-white shadow px-6 py-4 rounded-xl text-gray-800 flex items-center space-x-3 border border-gray-100">
        <img src={tech.icon} alt={tech.name} className="h-8 w-8" />
        <span className="font-medium">{tech.name}</span>
      </div>
    ))}
  </div>
</div>
        
        {/* Contact Form */}
        <div className="mb-16" id="contact">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Ready to Start Your Project?</h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
            Let's discuss how I can help bring your ideas to life with custom web development solutions
          </p>
          
          <div className="max-w-2xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Developers;
