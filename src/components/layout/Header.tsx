import React from 'react';
import { Scissors, Search } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Header: React.FC = () => {
  const { searchQuery, setSearchQuery } = useAppContext();

  return (
    <header className="bg-indigo-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Scissors className="h-8 w-8 text-yellow-400 mr-2" />
            <h1 className="text-2xl font-bold">Mariam Tailors</h1>
          </div>
          
          <div className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customers..."
                className="w-full py-2 px-4 pl-10 bg-indigo-800 text-white placeholder-indigo-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-indigo-300" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;