import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import CustomerList from '../components/customer/CustomerList';
import CustomerForm from '../components/customer/CustomerForm';
import CustomerDetail from '../components/customer/CustomerDetail';
import { useAppContext } from '../context/AppContext';

const CustomersPage: React.FC = () => {
  const { selectedCustomer, setSelectedCustomer } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);

  // Determine what to show in the main content area
  const renderMainContent = () => {
    if (selectedCustomer && !isEditing) {
      return <CustomerDetail />;
    } else {
      return (
        <CustomerForm 
          onSuccess={() => {
            if (!selectedCustomer) {
              // If adding a new customer, go back to list view
              setIsEditing(false);
            } else {
              // If editing, go back to detail view
              setIsEditing(false);
            }
          }} 
        />
      );
    }
  };

  // Watch for changes in selectedCustomer
  React.useEffect(() => {
    // When a customer is selected, start in view mode
    setIsEditing(false);
  }, [selectedCustomer]);

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-12">
          <CustomerList />
        </div>
        
        <div className="md:col-span-12">
          {renderMainContent()}
        </div>
      </div>
    </Layout>
  );
};

export default CustomersPage;