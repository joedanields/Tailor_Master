import React from 'react';
import Layout from '../components/layout/Layout';
import DeliveryForm from '../components/delivery/DeliveryForm';

const NewDeliveryLogPage: React.FC = () => {
  return (
    <Layout>
      <DeliveryForm />
    </Layout>
  );
};

export default NewDeliveryLogPage;