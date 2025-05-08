import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { DeliveryLog, Customer, DeliveryStatus } from '../../types';
import { dressTypes, generateId } from '../../utils/helpers';
import * as db from '../../services/db';
import { useNavigate, useLocation } from 'react-router-dom';

interface DeliveryFormProps {
  logId?: string;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({ logId }) => {
  const { customers, refreshData } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedCustomerId = queryParams.get('customerId');

  const [deliveryLog, setDeliveryLog] = useState<Partial<DeliveryLog>>({
    id: '',
    customerId: preselectedCustomerId || '',
    dressType: 'Dress 1',
    quantity: 1,
    deliveryMode: 'Customer',
    recipientName: '',
    status: 'Taken',
    takenDate: Date.now(),
    notes: '',
  });

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const loadDeliveryLog = async () => {
      if (logId) {
        try {
          const log = await db.getDeliveryLog(logId);
          if (log) {
            setDeliveryLog(log);
            
            const customer = customers.find(c => c.id === log.customerId);
            if (customer) {
              setSelectedCustomer(customer);
            }
          }
        } catch (error) {
          console.error('Error loading delivery log:', error);
          setErrorMessage('Failed to load delivery log data');
          setSaveStatus('error');
        }
      } else {
        setDeliveryLog({
          id: generateId('DEL'),
          customerId: preselectedCustomerId || '',
          dressType: 'Dress 1',
          quantity: 1,
          deliveryMode: 'Customer',
          recipientName: '',
          status: 'Taken',
          takenDate: Date.now(),
          notes: '',
        });
        
        if (preselectedCustomerId) {
          const customer = customers.find(c => c.id === preselectedCustomerId);
          if (customer) {
            setSelectedCustomer(customer);
          }
        }
      }
    };
    
    loadDeliveryLog();
  }, [logId, customers, preselectedCustomerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'customerId') {
      setDeliveryLog(prev => ({ ...prev, [name]: value }));
      const customer = customers.find(c => c.id === value);
      setSelectedCustomer(customer || null);
    } else if (name === 'status') {
      const newStatus = value as DeliveryStatus;
      setDeliveryLog(prev => ({
        ...prev,
        status: newStatus,
        deliveryDate: newStatus === 'Delivered' ? Date.now() : undefined
      }));
    } else if (name === 'quantity') {
      const quantity = parseInt(value) || 1;
      setDeliveryLog(prev => ({ ...prev, quantity: Math.max(1, quantity) }));
    } else {
      setDeliveryLog(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deliveryLog.customerId || !deliveryLog.dressType || !deliveryLog.deliveryMode) {
      setErrorMessage('Please fill out all required fields');
      setSaveStatus('error');
      return;
    }
    
    if (deliveryLog.deliveryMode === 'Other' && !deliveryLog.recipientName) {
      setErrorMessage('Recipient name is required when delivery mode is "Given to Someone Else"');
      setSaveStatus('error');
      return;
    }
    
    try {
      setSaveStatus('saving');
      
      if (logId) {
        await db.updateDeliveryLog(deliveryLog as DeliveryLog);
      } else {
        await db.addDeliveryLog({
          ...deliveryLog,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        } as DeliveryLog);
      }
      
      setSaveStatus('success');
      await refreshData();
      
      setTimeout(() => {
        navigate('/delivery-logs');
      }, 1000);
    } catch (error) {
      console.error('Error saving delivery log:', error);
      setSaveStatus('error');
      setErrorMessage('Failed to save delivery log. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-indigo-900 mb-6">
        {logId ? 'Edit Delivery Log' : 'New Delivery Log'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer*
            </label>
            <select
              name="customerId"
              value={deliveryLog.customerId || ''}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a customer</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.id})
                </option>
              ))}
            </select>
          </div>
          
          {selectedCustomer && (
            <div className="bg-indigo-50 p-3 rounded-md">
              <p className="text-sm text-indigo-800">
                <span className="font-semibold">Selected Customer:</span> {selectedCustomer.name}
              </p>
              <p className="text-sm text-indigo-800">
                <span className="font-semibold">Location:</span> {selectedCustomer.location}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dress Type*
              </label>
              <select
                name="dressType"
                value={deliveryLog.dressType || 'Dress 1'}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {dressTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity*
              </label>
              <input
                type="number"
                name="quantity"
                value={deliveryLog.quantity || 1}
                onChange={handleChange}
                min="1"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status*
            </label>
            <select
              name="status"
              value={deliveryLog.status}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Taken">Taken</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Mode*
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="customer"
                  name="deliveryMode"
                  value="Customer"
                  checked={deliveryLog.deliveryMode === 'Customer'}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="customer" className="ml-2 block text-sm text-gray-700">
                  Handed to Customer
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="other"
                  name="deliveryMode"
                  value="Other"
                  checked={deliveryLog.deliveryMode === 'Other'}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="other" className="ml-2 block text-sm text-gray-700">
                  Given to Someone Else
                </label>
              </div>
            </div>
          </div>
          
          {deliveryLog.deliveryMode === 'Other' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Name*
              </label>
              <input
                type="text"
                name="recipientName"
                value={deliveryLog.recipientName || ''}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Name of person receiving the dress"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={deliveryLog.notes || ''}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Any additional notes about this delivery"
            ></textarea>
          </div>
        </div>
        
        {saveStatus === 'error' && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md">
            {errorMessage}
          </div>
        )}
        
        {saveStatus === 'success' && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md">
            Delivery log saved successfully!
          </div>
        )}
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/delivery-logs')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saveStatus === 'saving'}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {saveStatus === 'saving' ? 'Saving...' : 'Save Delivery Log'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryForm;