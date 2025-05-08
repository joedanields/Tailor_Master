import React from 'react';
import { Users, PackageCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="bg-indigo-800 text-white w-full md:w-64 min-h-screen p-4">
      <nav className="mt-10">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className={`flex items-center p-3 rounded-lg transition-colors ${
                isActive('/') ? 'bg-indigo-700 text-yellow-400' : 'hover:bg-indigo-700'
              }`}
            >
              <Users className="mr-3 h-5 w-5" />
              <span>Customers</span>
            </Link>
          </li>
          <li>
            <Link
              to="/delivery-logs"
              className={`flex items-center p-3 rounded-lg transition-colors ${
                isActive('/delivery-logs') ? 'bg-indigo-700 text-yellow-400' : 'hover:bg-indigo-700'
              }`}
            >
              <PackageCheck className="mr-3 h-5 w-5" />
              <span>Delivery Logs</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;