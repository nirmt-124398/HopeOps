import React from 'react';
const DeveloperCard = ({ name, role, responsibilities, achievements, image }) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 relative overflow-hidden">
          <div className="bg-primary/10 absolute inset-0 -z-10"></div>
          <img 
            src={image || "https://via.placeholder.com/300x400?text=Developer"} 
            alt={name}
            className="w-full h-64 md:h-auto md:aspect-[3/4] object-cover object-center transition-transform hover:scale-105 duration-500"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/90 to-transparent p-4 md:hidden">
            <h2 className="text-2xl font-bold text-white">{name}</h2>
            <p className="text-white/90 font-medium">{role}</p>
          </div>
        </div>
        
        <div className="p-6 md:w-3/4 flex flex-col justify-between">
          <div>
            <div className="hidden md:block mb-4">
              <h2 className="text-2xl font-bold text-primary">{name}</h2>
              <p className="text-secondary font-medium inline-block px-3 py-1 bg-secondary/10 rounded-full text-sm mt-1">{role}</p>
            </div>
            
            <div className="mb-5">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Responsibilities
              </h3>
              <ul className="space-y-1">
                {responsibilities.map((item, index) => (
                  <li key={index} className="text-gray-700 flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Notable Work
              </h3>
              <ul className="space-y-1">
                {achievements.map((item, index) => (
                  <li key={index} className="text-gray-700 flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 hidden md:block">
            <a href="https://www.linkedin.com/in/nirmit-rampal-4a9b55245/" className="text-primary font-medium hover:underline text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const Developers = () => {
  const developersList = [
    {
      name: "Nirmit Rampal",
      role: "Full Stack Developer",
      image: "/nirmit_rampal.jpg",
      responsibilities: [
        "Fully handled connecting backend with frontend",
        "Frontend development using React",
        "Backend development using Node.js",
        "Database management with MongoDB",
        "API integration and testing",
        "Integration with third-party services (Razorpay)",
        "Deployed application on Render",
      ],
      achievements: [
        "Developed user-friendly UI for the admin dashboard",
        "Implemented RESTful APIs for animal data management"
      ]
    },
    {
      name: "John Smith",
      role: "Backend Developer",
      image: "/images/developers/john-smith.jpg",
      responsibilities: [
        "API development and documentation",
        "Database optimization",
        "Server-side security implementation"
      ],
      achievements: [
        "Built scalable authentication system",
        "Integrated payment processing API",
        "Optimized database queries for 60% faster response"
      ]
    },
    {
      name: "Alex Johnson",
      role: "Full Stack Developer",
      image: "/images/developers/alex-johnson.jpg",
      responsibilities: [
        "Cross-platform integration",
        "DevOps and deployment processes",
        "Performance optimization"
      ],
      achievements: [
        "Created CI/CD pipeline",
        "Implemented real-time notifications system",
        "Developed admin dashboard analytics"
      ]
    }
  ];

  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Our Development Team</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Meet the talented individuals behind HopeOps who are dedicated to creating technology
          that helps animals in need and supports animal welfare organizations.
        </p>
      </div>

      <div className="space-y-12">
        {developersList.map((developer, index) => (
          <DeveloperCard
            key={index}
            {...developer}
          />
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Our Technology Stack</h2>
        <div className="flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
          {["React", "Node.js", "MongoDB", "Express", "Tailwind CSS", "Render"].map((tech, index) => (
            <div key={index} className="bg-gray-100 px-4 py-2 rounded-full text-gray-800">
              {tech}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Developers;
