
export interface DemoUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'nurse' | 'doctor' | 'admin';
  department?: string;
  permissions: string[];
  phone?: string;
  address?: string;
  specialization?: string;
  licenseNumber?: string;
  bio?: string;
  profilePicture?: string;
  createdAt?: string;
  lastLogin?: string;
}

export const DEMO_CREDENTIALS: DemoUser[] = [
  {
    id: 'nurse-001',
    email: 'nurse@mediverse.com',
    password: 'nurse123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'nurse',
    department: 'Emergency Care',
    permissions: ['view_prescriptions', 'update_status', 'view_interactions'],
    phone: '+1 (555) 123-4567',
    address: '123 Medical Center Drive, Healthcare City, HC 12345',
    specialization: 'Emergency Medicine',
    licenseNumber: 'RN-123456789',
    bio: 'Dedicated emergency care nurse with over 8 years of experience in critical patient care and medication management.',
    createdAt: '2023-01-15',
    lastLogin: new Date().toISOString()
  },
  {
    id: 'doctor-001', 
    email: 'doctor@mediverse.com',
    password: 'doctor123',
    firstName: 'Dr. Michael',
    lastName: 'Smith',
    role: 'doctor',
    department: 'Cardiology',
    permissions: ['upload_prescriptions', 'approve_reject', 'view_analytics', 'add_comments'],
    phone: '+1 (555) 987-6543',
    address: '456 Cardiac Way, Medical District, MD 67890',
    specialization: 'Interventional Cardiology',
    licenseNumber: 'MD-987654321',
    bio: 'Board-certified cardiologist specializing in complex cardiac interventions and precision medicine approaches.',
    createdAt: '2022-08-20',
    lastLogin: new Date().toISOString()
  },
  {
    id: 'admin-001',
    email: 'admin@mediverse.com', 
    password: 'admin123',
    firstName: 'Alex',
    lastName: 'Rodriguez',
    role: 'admin',
    department: 'System Administration',
    permissions: ['manage_users', 'view_logs', 'system_settings', 'view_statistics'],
    phone: '+1 (555) 555-0123',
    address: '789 Admin Plaza, Technology Center, TC 98765',
    specialization: 'Healthcare IT Systems',
    licenseNumber: 'SA-456789123',
    bio: 'Healthcare IT administrator with expertise in medical information systems and data security compliance.',
    createdAt: '2021-12-01',
    lastLogin: new Date().toISOString()
  }
];

export const printDemoCredentials = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('\n🔐 MEDIVERSE GUARDIAN X - DEMO CREDENTIALS');
    console.log('=' .repeat(50));
    console.log('🏥 For testing purposes only - DO NOT use in production');
    console.log('');
    
    DEMO_CREDENTIALS.forEach(user => {
      console.log(`👤 ${user.role.toUpperCase()}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Name: ${user.firstName} ${user.lastName}`);
      console.log(`   Department: ${user.department}`);
      console.log('');
    });
    
    console.log('🌐 Access the application at: http://localhost:3000');
    console.log('=' .repeat(50));
  }
};

export const validateCredentials = (email: string, password: string): DemoUser | null => {
  return DEMO_CREDENTIALS.find(
    user => user.email === email && user.password === password
  ) || null;
};

export const hasPermission = (user: DemoUser, permission: string): boolean => {
  return user.permissions.includes(permission);
};
