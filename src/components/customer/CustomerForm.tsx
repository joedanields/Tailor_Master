import React, { useState, useEffect } from 'react';
import { Customer, Measurements } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { generateId } from '../../utils/helpers';
import * as db from '../../services/db';

interface CustomerFormProps {
  onSuccess?: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSuccess }) => {
  const { selectedCustomer, customerMeasurements, refreshData } = useAppContext();
  
  const [customer, setCustomer] = useState<Partial<Customer>>({
    id: '',
    name: '',
    location: '',
    phone: '',
    email: '',
  });
  
  const [measurements, setMeasurements] = useState<Partial<Measurements>>({
    customerId: '',
    chest: undefined,
    waist: undefined,
    hips: undefined,
    shoulder: undefined,
    sleeve: undefined,
    neck: undefined,
    inseam: undefined,
    outseam: undefined,
    thigh: undefined,
    calf: undefined,
    ankle: undefined,
    bicep: undefined,
    wrist: undefined,
    height: undefined,
    notes: '',
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Load customer and measurements data when editing
  useEffect(() => {
    if (selectedCustomer) {
      setCustomer(selectedCustomer);
    } else {
      // Generate new ID for new customer
      setCustomer({
        id: generateId(),
        name: '',
        location: '',
        phone: '',
        email: '',
      });
    }
    
    if (customerMeasurements) {
      setMeasurements(customerMeasurements);
    } else {
      setMeasurements({
        customerId: selectedCustomer?.id || '',
        chest: undefined,
        waist: undefined,
        hips: undefined,
        shoulder: undefined,
        sleeve: undefined,
        neck: undefined,
        inseam: undefined,
        outseam: undefined,
        thigh: undefined,
        calf: undefined,
        ankle: undefined,
        bicep: undefined,
        wrist: undefined,
        height: undefined,
        notes: '',
      });
    }
  }, [selectedCustomer, customerMeasurements]);

  // Update measurements customer ID when customer ID changes
  useEffect(() => {
    if (customer.id) {
      setMeasurements(prev => ({ ...prev, customerId: customer.id }));
    }
  }, [customer.id]);

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleMeasurementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Convert to number for measurement fields, keep as string for notes
    if (name === 'notes') {
      setMeasurements(prev => ({ ...prev, [name]: value }));
    } else {
      const numValue = value ? parseFloat(value) : undefined;
      setMeasurements(prev => ({ ...prev, [name]: numValue }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customer.name || !customer.location) {
      setErrorMessage('Customer name and location are required');
      setSaveStatus('error');
      return;
    }
    
    try {
      setSaveStatus('saving');
      
      if (selectedCustomer) {
        // Update existing customer
        await db.updateCustomer(customer as Customer);
      } else {
        // Add new customer
        await db.addCustomer({
          ...customer,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        } as Customer);
      }
      
      // Save measurements if any exist
      if (measurements.customerId) {
        await db.addOrUpdateMeasurements({
          ...measurements,
          customerId: customer.id!,
          updatedAt: Date.now(),
        } as Measurements);
      }
      
      setSaveStatus('success');
      await refreshData();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      setSaveStatus('error');
      setErrorMessage('Failed to save customer data. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-indigo-900 mb-6">
        {selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Customer Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer ID
              </label>
              <input
                  type="text"
                  name="id"
                  value={customer.id}
                  onChange={(e) => setCustomer({ ...customer, id: e.target.value })}
                  placeholder="Enter Customer ID"
                  className="input-class"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name*
              </label>
              <input
                type="text"
                name="name"
                value={customer.name}
                onChange={handleCustomerChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location*
              </label>
              <input
                type="text"
                name="location"
                value={customer.location}
                onChange={handleCustomerChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={customer.phone || ''}
                onChange={handleCustomerChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={customer.email || ''}
                onChange={handleCustomerChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          {/* Measurements */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Measurements (inches)</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chest
                </label>
                <input
                  type="number"
                  name="chest"
                  value={measurements.chest || ''}
                  onChange={handleMeasurementChange}
                  step="0.25"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waist
                </label>
                <input
                  type="number"
                  name="waist"
                  value={measurements.waist || ''}
                  onChange={handleMeasurementChange}
                  step="0.25"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hips
                </label>
                <input
                  type="number"
                  name="hips"
                  value={measurements.hips || ''}
                  onChange={handleMeasurementChange}
                  step="0.25"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shoulder
                </label>
                <input
                  type="number"
                  name="shoulder"
                  value={measurements.shoulder || ''}
                  onChange={handleMeasurementChange}
                  step="0.25"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sleeve
                </label>
                <input
                  type="number"
                  name="sleeve"
                  value={measurements.sleeve || ''}
                  onChange={handleMeasurementChange}
                  step="0.25"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Neck
                </label>
                <input
                  type="number"
                  name="neck"
                  value={measurements.neck || ''}
                  onChange={handleMeasurementChange}
                  step="0.25"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                <input
                  type="number"
                  name="height"
                  value={measurements.height || ''}
                  onChange={handleMeasurementChange}
                  step="0.25"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inseam
                </label>
                <input
                  type="number"
                  name="inseam"
                  value={measurements.inseam || ''}
                  onChange={handleMeasurementChange}
                  step="0.25"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={measurements.notes || ''}
                onChange={handleMeasurementChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Error message */}
        {saveStatus === 'error' && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md">
            {errorMessage}
          </div>
        )}
        
        {/* Success message */}
        {saveStatus === 'success' && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md">
            Customer information saved successfully!
          </div>
        )}
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => onSuccess?.()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saveStatus === 'saving'}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {saveStatus === 'saving' ? 'Saving...' : 'Save Customer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;