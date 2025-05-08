import { DressType } from '../types';

// Generate a unique ID with optional prefix
export const generateId = (prefix = 'CUS'): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}${randomStr}`;
};

// Format date for display
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// List of available dress types
export const dressTypes: DressType[] = [
  'Dress 1',
  'Dress 2',
  'Dress 3',
  'Dress 4',
  'Dress 5',
  'Dress 6',
  'Dress 7',
  'Dress 8',
  'Dress 9',
  'Dress 10',
];

// Format measurement value for display (adds unit)
export const formatMeasurement = (value: number | undefined): string => {
  if (value === undefined) return '-';
  return `${value} in`;
};