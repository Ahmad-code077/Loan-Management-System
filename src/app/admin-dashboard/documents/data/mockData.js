export const mockDocuments = [
  {
    id: 1,
    document_type: 'CNIC Front',
    file: 'https://drfloan.pythonanywhere.com/media/documents/cnic_front.png',
    uploaded_at: '2025-05-22T19:30:47.473862Z',
    user: {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      first_name: 'John',
      last_name: 'Doe',
    },
  },
  {
    id: 2,
    document_type: 'CNIC Back',
    file: 'https://drfloan.pythonanywhere.com/media/documents/cnic_back.png',
    uploaded_at: '2025-05-22T19:31:12.943392Z',
    user: {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      first_name: 'John',
      last_name: 'Doe',
    },
  },
  {
    id: 3,
    document_type: 'Salary Slip',
    file: 'https://drfloan.pythonanywhere.com/media/documents/salary_slip.png',
    uploaded_at: '2025-05-22T19:31:26.713733Z',
    user: {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      first_name: 'John',
      last_name: 'Doe',
    },
  },
  {
    id: 4,
    document_type: 'CNIC Front',
    file: 'https://drfloan.pythonanywhere.com/media/documents/cnic_front_2.png',
    uploaded_at: '2025-05-23T10:15:30.123456Z',
    user: {
      id: 2,
      username: 'sarah_ahmed',
      email: 'sarah@example.com',
      first_name: 'Sarah',
      last_name: 'Ahmed',
    },
  },
  {
    id: 5,
    document_type: 'CNIC Back',
    file: 'https://drfloan.pythonanywhere.com/media/documents/cnic_back_2.png',
    uploaded_at: '2025-05-23T10:16:45.987654Z',
    user: {
      id: 2,
      username: 'sarah_ahmed',
      email: 'sarah@example.com',
      first_name: 'Sarah',
      last_name: 'Ahmed',
    },
  },
  {
    id: 6,
    document_type: 'Salary Slip',
    file: 'https://drfloan.pythonanywhere.com/media/documents/salary_slip_2.png',
    uploaded_at: '2025-05-23T10:18:12.456789Z',
    user: {
      id: 3,
      username: 'ali_hassan',
      email: 'ali@example.com',
      first_name: 'Ali',
      last_name: 'Hassan',
    },
  },
];

export const DOCUMENT_TYPES = ['CNIC Front', 'CNIC Back', 'Salary Slip'];
