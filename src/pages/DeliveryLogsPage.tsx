import React from 'react';
import Layout from '../components/layout/Layout';
import DeliveryList from '../components/delivery/DeliveryList';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const DeliveryLogsPage: React.FC = () => {
  const location = useLocation();
  const { customers } = useAppContext();
  
  const queryParams = new URLSearchParams(location.search);
  const customerId = queryParams.get('customerId');
  
  // Find customer name if customerId is provided
  const customerName = customerId 
    ? customers.find(c => c.id === customerId)?.name || 'Unknown Customer'
    : null;

  return (
    <Layout>
      <div className="space-y-6">
        {customerName && (
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <p className="text-indigo-800">
              Showing delivery logs for customer: <span className="font-semibold">{customerName}</span>
            </p>
          </div>
        )}
        
        <DeliveryList />
      </div>
    </Layout>
  );
};

export default DeliveryLogsPage;