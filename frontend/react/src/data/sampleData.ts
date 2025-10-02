
import { format, subDays, subHours, subMinutes } from 'date-fns';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  allergies: string[];
  medicalHistory: string[];
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  confidence: number;
  uploadedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  comments?: string;
  interactions: DrugInteraction[];
  alternatives?: Alternative[];
  flags: string[];
}

export interface DrugInteraction {
  id: string;
  drug1: string;
  drug2: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  recommendation: string;
}

export interface Alternative {
  drugName: string;
  dosage: string;
  reason: string;
  safetyScore: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  userName: string;
  details: string;
  status: 'success' | 'error' | 'warning';
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'nurse' | 'doctor' | 'admin';
  department: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}

const SAMPLE_DRUGS = [
  { name: 'Metformin', dosages: ['500mg', '850mg', '1000mg'] },
  { name: 'Lisinopril', dosages: ['5mg', '10mg', '20mg', '40mg'] },
  { name: 'Atorvastatin', dosages: ['10mg', '20mg', '40mg', '80mg'] },
  { name: 'Amlodipine', dosages: ['2.5mg', '5mg', '10mg'] },
  { name: 'Omeprazole', dosages: ['20mg', '40mg'] },
  { name: 'Levothyroxine', dosages: ['25mcg', '50mcg', '75mcg', '100mcg'] },
  { name: 'Metoprolol', dosages: ['25mg', '50mg', '100mg'] },
  { name: 'Hydrochlorothiazide', dosages: ['12.5mg', '25mg', '50mg'] },
  { name: 'Warfarin', dosages: ['1mg', '2mg', '5mg', '10mg'] },
  { name: 'Furosemide', dosages: ['20mg', '40mg', '80mg'] }
];

const SAMPLE_FREQUENCIES = [
  'Once daily',
  'Twice daily', 
  'Three times daily',
  'Four times daily',
  'Every 12 hours',
  'Every 8 hours',
  'As needed',
  'Before meals',
  'After meals',
  'At bedtime'
];

const SAMPLE_FIRST_NAMES = [
  'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa',
  'William', 'Jennifer', 'James', 'Mary', 'Christopher', 'Patricia', 'Daniel',
  'Linda', 'Matthew', 'Elizabeth', 'Anthony', 'Barbara'
];

const SAMPLE_LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'
];

const SAMPLE_ALLERGIES = [
  'Penicillin', 'Sulfa drugs', 'Aspirin', 'Latex', 'Shellfish', 'Nuts',
  'Eggs', 'Dairy', 'Codeine', 'Morphine', 'Iodine', 'Bee stings'
];

const SAMPLE_CONDITIONS = [
  'Hypertension', 'Diabetes Type 2', 'Hyperlipidemia', 'Asthma', 
  'Chronic Kidney Disease', 'Heart Disease', 'COPD', 'Arthritis',
  'Depression', 'Anxiety', 'Thyroid Disease', 'Osteoporosis'
];

export const generatePatients = (count: number = 50): Patient[] => {
  const patients: Patient[] = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = SAMPLE_FIRST_NAMES[Math.floor(Math.random() * SAMPLE_FIRST_NAMES.length)];
    const lastName = SAMPLE_LAST_NAMES[Math.floor(Math.random() * SAMPLE_LAST_NAMES.length)];
    
    patients.push({
      id: `PAT-${String(i + 1).padStart(4, '0')}`,
      firstName,
      lastName,
      age: 18 + Math.floor(Math.random() * 70),
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      allergies: SAMPLE_ALLERGIES.slice(0, Math.floor(Math.random() * 3)),
      medicalHistory: SAMPLE_CONDITIONS.slice(0, Math.floor(Math.random() * 4)),
      contactInfo: {
        phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        address: `${Math.floor(Math.random() * 9999) + 1} ${['Main St', 'Oak Ave', 'Pine Rd', 'Cedar Ln'][Math.floor(Math.random() * 4)]}`
      }
    });
  }
  
  return patients;
};

export const generateInteractions = (drugName: string): DrugInteraction[] => {
  const interactions: DrugInteraction[] = [];
  const interactionCount = Math.floor(Math.random() * 3);
  
  for (let i = 0; i < interactionCount; i++) {
    const otherDrug = SAMPLE_DRUGS[Math.floor(Math.random() * SAMPLE_DRUGS.length)].name;
    if (otherDrug !== drugName) {
      interactions.push({
        id: `INT-${Math.random().toString(36).substr(2, 9)}`,
        drug1: drugName,
        drug2: otherDrug,
        severity: ['mild', 'moderate', 'severe'][Math.floor(Math.random() * 3)] as any,
        description: `Potential interaction between ${drugName} and ${otherDrug}`,
        recommendation: 'Monitor patient closely for adverse effects'
      });
    }
  }
  
  return interactions;
};

export const generateAlternatives = (drugName: string): Alternative[] => {
  const alternatives: Alternative[] = [];
  const alternativeCount = Math.floor(Math.random() * 3) + 1;
  
  for (let i = 0; i < alternativeCount; i++) {
    const altDrug = SAMPLE_DRUGS[Math.floor(Math.random() * SAMPLE_DRUGS.length)];
    if (altDrug.name !== drugName) {
      alternatives.push({
        drugName: altDrug.name,
        dosage: altDrug.dosages[Math.floor(Math.random() * altDrug.dosages.length)],
        reason: 'Lower risk of interactions',
        safetyScore: 70 + Math.floor(Math.random() * 30)
      });
    }
  }
  
  return alternatives;
};

export const generatePrescriptions = (patients: Patient[], count: number = 100): Prescription[] => {
  const prescriptions: Prescription[] = [];
  const statuses = ['pending', 'approved', 'rejected', 'under_review'];
  const doctors = ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Davis'];
  
  for (let i = 0; i < count; i++) {
    const patient = patients[Math.floor(Math.random() * patients.length)];
    const drug = SAMPLE_DRUGS[Math.floor(Math.random() * SAMPLE_DRUGS.length)];
    const dosage = drug.dosages[Math.floor(Math.random() * drug.dosages.length)];
    const frequency = SAMPLE_FREQUENCIES[Math.floor(Math.random() * SAMPLE_FREQUENCIES.length)];
    
    const uploadTime = subHours(new Date(), Math.floor(Math.random() * 72));
    const status = statuses[Math.floor(Math.random() * statuses.length)] as any;
    
    prescriptions.push({
      id: `RX-${String(i + 1).padStart(6, '0')}`,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      doctorName: doctors[Math.floor(Math.random() * doctors.length)],
      drugName: drug.name,
      dosage,
      frequency,
      duration: `${Math.floor(Math.random() * 30) + 7} days`,
      instructions: `Take ${frequency.toLowerCase()} with food`,
      status,
      confidence: 70 + Math.floor(Math.random() * 30),
      uploadedAt: format(uploadTime, 'yyyy-MM-dd HH:mm:ss'),
      reviewedAt: status !== 'pending' ? format(subMinutes(uploadTime, Math.floor(Math.random() * 60)), 'yyyy-MM-dd HH:mm:ss') : undefined,
      reviewedBy: status !== 'pending' ? doctors[Math.floor(Math.random() * doctors.length)] : undefined,
      comments: status === 'rejected' ? 'Dosage too high for patient age' : undefined,
      interactions: generateInteractions(drug.name),
      alternatives: generateAlternatives(drug.name),
      flags: Math.random() > 0.7 ? ['High Dosage'] : []
    });
  }
  
  return prescriptions.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
};

export const generateSystemLogs = (count: number = 50): SystemLog[] => {
  const logs: SystemLog[] = [];
  const actions = [
    'Prescription uploaded',
    'Prescription approved', 
    'Prescription rejected',
    'User login',
    'Settings updated',
    'Patient added',
    'Drug interaction check',
    'Report generated'
  ];
  
  const users = [
    { id: 'nurse-001', name: 'Sarah Johnson' },
    { id: 'doctor-001', name: 'Dr. Michael Smith' },
    { id: 'admin-001', name: 'Alex Rodriguez' }
  ];
  
  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const timestamp = subMinutes(new Date(), Math.floor(Math.random() * 1440)); // Last 24 hours
    
    logs.push({
      id: `LOG-${String(i + 1).padStart(6, '0')}`,
      timestamp: format(timestamp, 'yyyy-MM-dd HH:mm:ss'),
      action,
      userId: user.id,
      userName: user.name,
      details: `${action} - System processed successfully`,
      status: Math.random() > 0.9 ? 'error' : 'success'
    });
  }
  
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const generateUserProfiles = (): UserProfile[] => {
  return [
    {
      id: 'nurse-001',
      email: 'nurse@mediverse.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'nurse',
      department: 'Emergency Care',
      isActive: true,
      lastLogin: format(subHours(new Date(), 2), 'yyyy-MM-dd HH:mm:ss'),
      createdAt: format(subDays(new Date(), 30), 'yyyy-MM-dd')
    },
    {
      id: 'doctor-001',
      email: 'doctor@mediverse.com', 
      firstName: 'Dr. Michael',
      lastName: 'Smith',
      role: 'doctor',
      department: 'Cardiology',
      isActive: true,
      lastLogin: format(subHours(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
      createdAt: format(subDays(new Date(), 45), 'yyyy-MM-dd')
    },
    {
      id: 'admin-001',
      email: 'admin@mediverse.com',
      firstName: 'Alex',
      lastName: 'Rodriguez', 
      role: 'admin',
      department: 'System Administration',
      isActive: true,
      lastLogin: format(subMinutes(new Date(), 15), 'yyyy-MM-dd HH:mm:ss'),
      createdAt: format(subDays(new Date(), 60), 'yyyy-MM-dd')
    }
  ];
};

export const SAMPLE_PATIENTS = generatePatients(50);
export const SAMPLE_PRESCRIPTIONS = generatePrescriptions(SAMPLE_PATIENTS, 100);
export const SAMPLE_LOGS = generateSystemLogs(50);
export const SAMPLE_USERS = generateUserProfiles();
