import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, Measurements, DeliveryLog } from '../types';
import * as db from '../services/db';

interface AppContextType {
  customers: Customer[];
  selectedCustomer: Customer | null;
  customerMeasurements: Measurements | null;
  deliveryLogs: DeliveryLog[];
  loading: boolean;
  error: string | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  refreshData: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredCustomers: Customer[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerMeasurements, setCustomerMeasurements] = useState<Measurements | null>(null);
  const [deliveryLogs, setDeliveryLogs] = useState<DeliveryLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Initialize the database and load initial data
  useEffect(() => {
    const initializeData = async () => {
      try {
        await db.initDB();
        await refreshData();
      } catch (err) {
        console.error('Failed to initialize data:', err);
        setError('Failed to load data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Load customer measurements when selected customer changes
  useEffect(() => {
    const loadMeasurements = async () => {
      if (selectedCustomer) {
        try {
          const measurements = await db.getMeasurements(selectedCustomer.id);
          setCustomerMeasurements(measurements || null);
          
          // Load delivery logs for the selected customer
          const logs = await db.getCustomerDeliveryLogs(selectedCustomer.id);
          setDeliveryLogs(logs);
        } catch (err) {
          console.error('Failed to load measurements:', err);
        }
      } else {
        setCustomerMeasurements(null);
        setDeliveryLogs([]);
      }
    };

    loadMeasurements();
  }, [selectedCustomer]);

  // Refresh all data
  const refreshData = async () => {
    try {
      setLoading(true);
      const allCustomers = await db.getAllCustomers();
      setCustomers(allCustomers);
      
      if (selectedCustomer) {
        // Refresh the selected customer data
        const refreshedCustomer = await db.getCustomer(selectedCustomer.id);
        setSelectedCustomer(refreshedCustomer || null);
        
        if (refreshedCustomer) {
          const measurements = await db.getMeasurements(refreshedCustomer.id);
          setCustomerMeasurements(measurements || null);
          
          const logs = await db.getCustomerDeliveryLogs(refreshedCustomer.id);
          setDeliveryLogs(logs);
        }
      } else {
        // If no customer is selected, load all delivery logs
        const allLogs = await db.getAllDeliveryLogs();
        setDeliveryLogs(allLogs);
      }
      
      setError(null);
    } catch (err) {
      console.error('Failed to refresh data:', err);
      setError('Failed to refresh data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer => 
    customer.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppContext.Provider
      value={{
        customers,
        selectedCustomer,
        customerMeasurements,
        deliveryLogs,
        loading,
        error,
        setSelectedCustomer,
        refreshData,
        searchQuery,
        setSearchQuery,
        filteredCustomers
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};