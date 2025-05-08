import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import CustomersPage from './pages/CustomersPage';
import DeliveryLogsPage from './pages/DeliveryLogsPage';
import NewDeliveryLogPage from './pages/NewDeliveryLogPage';
import EditDeliveryLogPage from './pages/EditDeliveryLogPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<CustomersPage />} />
          <Route path="/delivery-logs" element={<DeliveryLogsPage />} />
          <Route path="/delivery-logs/new" element={<NewDeliveryLogPage />} />
          <Route path="/delivery-logs/edit/:id" element={<EditDeliveryLogPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;