import { Customer, Measurements, DeliveryLog } from '../types';

// Database configuration
const DB_NAME = 'tailoring_business_db';
const DB_VERSION = 1;
const STORES = {
  customers: 'customers',
  measurements: 'measurements',
  deliveryLogs: 'deliveryLogs',
};

// Initialize the database
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Database error:', (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.customers)) {
        const customerStore = db.createObjectStore(STORES.customers, { keyPath: 'id' });
        customerStore.createIndex('name', 'name', { unique: false });
        customerStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.measurements)) {
        const measurementStore = db.createObjectStore(STORES.measurements, { keyPath: 'customerId' });
        measurementStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.deliveryLogs)) {
        const logStore = db.createObjectStore(STORES.deliveryLogs, { keyPath: 'id' });
        logStore.createIndex('customerId', 'customerId', { unique: false });
        logStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
  });
};

// Generic function to perform a database operation
const dbOperation = async <T>(
  storeName: string,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    const request = operation(store);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Customer operations
export const addCustomer = async (customer: Customer): Promise<string> => {
  return dbOperation<IDBValidKey>(
    STORES.customers,
    'readwrite',
    (store) => store.add({ ...customer, createdAt: Date.now(), updatedAt: Date.now() })
  ) as Promise<string>;
};

export const updateCustomer = async (customer: Customer): Promise<string> => {
  return dbOperation<IDBValidKey>(
    STORES.customers,
    'readwrite',
    (store) => store.put({ ...customer, updatedAt: Date.now() })
  ) as Promise<string>;
};

export const getCustomer = async (id: string): Promise<Customer | undefined> => {
  return dbOperation<Customer>(
    STORES.customers,
    'readonly',
    (store) => store.get(id)
  );
};

export const getAllCustomers = async (): Promise<Customer[]> => {
  return dbOperation<Customer[]>(
    STORES.customers,
    'readonly',
    (store) => store.index('updatedAt').getAll()
  );
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await dbOperation(
    STORES.customers,
    'readwrite',
    (store) => store.delete(id)
  );
  
  try {
    // Also delete associated measurements
    await dbOperation(
      STORES.measurements,
      'readwrite',
      (store) => store.delete(id)
    );
  } catch (error) {
    console.log('No measurements to delete');
  }
};

export const searchCustomers = async (query: string): Promise<Customer[]> => {
  const allCustomers = await getAllCustomers();
  return allCustomers.filter(customer => 
    customer.id.toLowerCase().includes(query.toLowerCase()) || 
    customer.name.toLowerCase().includes(query.toLowerCase()) ||
    customer.location.toLowerCase().includes(query.toLowerCase())
  );
};

// Measurements operations
export const addOrUpdateMeasurements = async (measurements: Measurements): Promise<string> => {
  return dbOperation<IDBValidKey>(
    STORES.measurements,
    'readwrite',
    (store) => store.put({ ...measurements, updatedAt: Date.now() })
  ) as Promise<string>;
};

export const getMeasurements = async (customerId: string): Promise<Measurements | undefined> => {
  return dbOperation<Measurements>(
    STORES.measurements,
    'readonly',
    (store) => store.get(customerId)
  );
};

// Delivery log operations
export const addDeliveryLog = async (log: DeliveryLog): Promise<string> => {
  return dbOperation<IDBValidKey>(
    STORES.deliveryLogs,
    'readwrite',
    (store) => store.add({ ...log, createdAt: Date.now(), updatedAt: Date.now() })
  ) as Promise<string>;
};

export const updateDeliveryLog = async (log: DeliveryLog): Promise<string> => {
  return dbOperation<IDBValidKey>(
    STORES.deliveryLogs,
    'readwrite',
    (store) => store.put({ ...log, updatedAt: Date.now() })
  ) as Promise<string>;
};

export const getDeliveryLog = async (id: string): Promise<DeliveryLog | undefined> => {
  return dbOperation<DeliveryLog>(
    STORES.deliveryLogs,
    'readonly',
    (store) => store.get(id)
  );
};

export const getAllDeliveryLogs = async (): Promise<DeliveryLog[]> => {
  return dbOperation<DeliveryLog[]>(
    STORES.deliveryLogs,
    'readonly',
    (store) => store.index('createdAt').getAll()
  );
};

export const getCustomerDeliveryLogs = async (customerId: string): Promise<DeliveryLog[]> => {
  const allLogs = await getAllDeliveryLogs();
  return allLogs.filter(log => log.customerId === customerId);
};

export const deleteDeliveryLog = async (id: string): Promise<void> => {
  await dbOperation(
    STORES.deliveryLogs,
    'readwrite',
    (store) => store.delete(id)
  );
};