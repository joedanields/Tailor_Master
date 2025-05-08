import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Edit, Trash2, Plus, Package } from 'lucide-react';
import { formatDate, formatMeasurement } from '../../utils/helpers';
import * as db from '../../services/db';
import { Link } from 'react-router-dom';

const CustomerDetail: React.FC = () => {
  const { selectedCustomer, customerMeasurements, deliveryLogs, refreshData, setSelectedCustomer } = useAppContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!selectedCustomer) {
    return null;
  }

  const handleDelete = async () => {
    if (!selectedCustomer) return;
    
    try {
      setIsDeleting(true);
      await db.deleteCustomer(selectedCustomer.id);
      await refreshData();
      setSelectedCustomer(null);
    } catch (error) {
      console.error('Error deleting customer:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-indigo-900">{selectedCustomer.name}</h2>
          <p className="text-sm text-gray-500 mt-1">{selectedCustomer.id}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedCustomer(selectedCustomer)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            title="Edit Customer"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Delete Customer"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Customer Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{selectedCustomer.location}</p>
            </div>
            
            {selectedCustomer.phone && (
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{selectedCustomer.phone}</p>
              </div>
            )}
            
            {selectedCustomer.email && (
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedCustomer.email}</p>
              </div>
            )}
            
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-medium">{formatDate(selectedCustomer.createdAt)}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium">{formatDate(selectedCustomer.updatedAt)}</p>
            </div>
          </div>
        </div>
        
        {/* Measurements */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Measurements</h3>
          
          {customerMeasurements ? (
            <div className="grid grid-cols-3 gap-y-3 gap-x-4">
              <div>
                <p className="text-sm text-gray-500">Chest</p>
                <p className="font-medium">{formatMeasurement(customerMeasurements.chest)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Waist</p>
                <p className="font-medium">{formatMeasurement(customerMeasurements.waist)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Hips</p>
                <p className="font-medium">{formatMeasurement(customerMeasurements.hips)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Shoulder</p>
                <p className="font-medium">{formatMeasurement(customerMeasurements.shoulder)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Sleeve</p>
                <p className="font-medium">{formatMeasurement(customerMeasurements.sleeve)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Neck</p>
                <p className="font-medium">{formatMeasurement(customerMeasurements.neck)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Height</p>
                <p className="font-medium">{formatMeasurement(customerMeasurements.height)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Inseam</p>
                <p className="font-medium">{formatMeasurement(customerMeasurements.inseam)}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">No measurements recorded</p>
          )}
          
          {customerMeasurements?.notes && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Notes</p>
              <p className="text-sm mt-1">{customerMeasurements.notes}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Delivery Logs */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Recent Deliveries</h3>
          <Link
            to={`/delivery-logs/new?customerId=${selectedCustomer.id}`}
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Delivery
          </Link>
        </div>
        
        {deliveryLogs.length === 0 ? (
          <p className="text-gray-500 italic">No delivery logs found</p>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dress Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Mode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipient
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliveryLogs.slice(0, 5).map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.dressType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.deliveryMode === 'Customer' ? 'Direct to Customer' : 'Via Another Person'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.deliveryMode === 'Customer' ? selectedCustomer.name : log.recipientName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {deliveryLogs.length > 5 && (
          <div className="mt-4 text-center">
            <Link
              to={`/delivery-logs?customerId=${selectedCustomer.id}`}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <Package className="h-4 w-4 mr-1" />
              View All Deliveries
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Customer</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <span className="font-semibold">{selectedCustomer.name}</span>? 
              This will also delete all their measurements and delivery records. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Customer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetail;