import React from 'react';
import Layout from '../components/layout/Layout';
import DeliveryForm from '../components/delivery/DeliveryForm';
import { useParams } from 'react-router-dom';

const EditDeliveryLogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <Layout>
      <DeliveryForm logId={id} />
    </Layout>
  );
};

export default EditDeliveryLogPage;