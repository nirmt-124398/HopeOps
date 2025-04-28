import React from 'react';

const DeveloperCard = ({ name, role, responsibilities, achievements, image }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="md:flex">
        <div className="md:w-1/3">
          <img 
            src={image || "https://via.placeholder.com/300x400?text=Developer"} 
            alt={name}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="p-6 md:w-2/3">
          <h2 className="text-2xl font-bold text-primary mb-2">{name}</h2>
          <p className="text-lg text-secondary font-medium mb-4">{role}</p>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Responsibilities:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {responsibilities.map((item, index) => (
                <li key={index} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Notable Work:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {achievements.map((item, index) => (
                <li key={index} className="text-gray-700">{item}</li>
              ))}
            </ul>
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
      image: "/images/developers/nirmit-rampal.jpg",
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
