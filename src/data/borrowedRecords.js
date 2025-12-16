import { AVAILABLE_ITEMS } from './mockData';

// Mock borrowed records data
export const BORROWED_RECORDS = [
  {
    id: 1,
    borrower: {
      fullname: 'สมชาย ใจดี',
      department: 'IT Support',
      phone: '081-234-5678'
    },
    items: [
      { ...AVAILABLE_ITEMS[0], quantity: 2 },
      { ...AVAILABLE_ITEMS[2], quantity: 1 }
    ],
    borrowDate: '2024-12-10',
    returnDate: null,
    status: 'borrowed'
  },
  {
    id: 2,
    borrower: {
      fullname: 'สมหญิง รักเรียน',
      department: 'Marketing',
      phone: '089-876-5432'
    },
    items: [
      { ...AVAILABLE_ITEMS[1], quantity: 1 }
    ],
    borrowDate: '2024-12-12',
    returnDate: null,
    status: 'borrowed'
  },
  {
    id: 3,
    borrower: {
      fullname: 'วิชัย เก่งกล้า',
      department: 'Sales',
      phone: '086-111-2222'
    },
    items: [
      { ...AVAILABLE_ITEMS[3], quantity: 3 },
      { ...AVAILABLE_ITEMS[4], quantity: 1 }
    ],
    borrowDate: '2024-12-08',
    returnDate: '2024-12-14',
    status: 'returned'
  },
  {
    id: 4,
    borrower: {
      fullname: 'มานี มีสุข',
      department: 'HR',
      phone: '084-333-4444'
    },
    items: [
      { ...AVAILABLE_ITEMS[5], quantity: 1 }
    ],
    borrowDate: '2024-12-14',
    returnDate: null,
    status: 'borrowed'
  },
  {
    id: 5,
    borrower: {
      fullname: 'ประยุทธ์ จันทร์เพ็ญ',
      department: 'Finance',
      phone: '082-555-6666'
    },
    items: [
      { ...AVAILABLE_ITEMS[0], quantity: 1 },
      { ...AVAILABLE_ITEMS[1], quantity: 2 },
      { ...AVAILABLE_ITEMS[2], quantity: 1 }
    ],
    borrowDate: '2024-12-05',
    returnDate: '2024-12-10',
    status: 'returned'
  }
];

/**
 * Get all currently borrowed records
 */
export const getBorrowedRecords = () => {
  return BORROWED_RECORDS.filter(record => record.status === 'borrowed');
};

/**
 * Get all returned records
 */
export const getReturnedRecords = () => {
  return BORROWED_RECORDS.filter(record => record.status === 'returned');
};

/**
 * Format date to Thai locale
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
