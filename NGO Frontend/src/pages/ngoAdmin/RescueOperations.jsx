import { Outlet, Link, useLocation } from 'react-router-dom';

const RescueOperations = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Rescue Operations</h1>
      
      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="flex space-x-4 border-b">
          <Link
            to="available"
            className={`pb-2 px-4 ${
              isActive('available')
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            Available Operations
          </Link>
          <Link
            to="ongoing"
            className={`pb-2 px-4 ${
              isActive('ongoing')
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            Ongoing Operations
          </Link>
          <Link
            to="completed"
            className={`pb-2 px-4 ${
              isActive('completed')
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            Completed Operations
          </Link>
        </div>
      </div>

      {/* Nested Route Content */}
      <Outlet />
    </div>
  );
};

export default RescueOperations; 