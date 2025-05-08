import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { MapPin, Clock } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const CustomerList: React.FC = () => {
  const { filteredCustomers, setSelectedCustomer, selectedCustomer } = useAppContext();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-indigo-900">Customers</h2>
        <button 
          onClick={() => setSelectedCustomer(null)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Add New Customer
        </button>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No customers found. Add your first customer to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => (
            <div 
              key={customer.id}
              onClick={() => setSelectedCustomer(customer)}
              className={`border rounded-lg p-4 cursor-pointer transition-all transform hover:scale-105 ${
                selectedCustomer?.id === customer.id 
                  ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <h3 className="font-semibold text-lg mb-1">{customer.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{customer.id}</p>
              
              <div className="flex items-start mb-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-1" />
                <p className="text-sm text-gray-600">{customer.location}</p>
              </div>
              
              {customer.phone && (
                <p className="text-sm text-gray-600 mb-2">
                  Phone: {customer.phone}
                </p>
              )}
              
              <div className="flex items-center mt-3 text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>Updated {formatDate(customer.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerList;