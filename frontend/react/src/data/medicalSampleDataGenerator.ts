
import { format, subDays, subHours, subMinutes, addDays } from 'date-fns';

export interface EnhancedPrescription {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  symptoms: string[];
  doctorName: string;
  doctorId: string;
  nurseAssigned?: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review' | 'checked' | 'dispensed';
  confidence: number;
  uploadedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  checkedAt?: string;
  checkedBy?: string;
  comments?: string;
  aiComments: string[];
  interactions: DrugInteraction[];
  alternatives?: Alternative[];
  flags: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  allergies: string[];
  medicalHistory: string[];
}

export interface DrugInteraction {
  id: string;
  drug1: string;
  drug2: string;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  description: string;
  recommendation: string;
  patientId?: string;
  detectedAt: string;
}

export interface Alternative {
  drugName: string;
  dosage: string;
  reason: string;
  safetyScore: number;
  cost: string;
  availability: 'in-stock' | 'limited' | 'out-of-stock';
}

export interface SystemLog {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  userName: string;
  userRole: string;
  details: string;
  status: 'success' | 'error' | 'warning' | 'info';
  ipAddress: string;
  module: string;
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
  permissions: string[];
  phoneNumber: string;
  address: string;
  specialization?: string;
  licenseNumber?: string;
  yearsExperience: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  createdAt: string;
  actionRequired: boolean;
  relatedId?: string;
}

export interface AnalyticsData {
  prescriptionStats: {
    totalProcessed: number;
    approved: number;
    rejected: number;
    pending: number;
    fraudDetected: number;
    averageProcessingTime: number; // in minutes
  };
  dailyData: Array<{
    date: string;
    prescriptions: number;
    fraudDetected: number;
    averageConfidence: number;
  }>;
  drugStats: Array<{
    drugName: string;
    prescriptionCount: number;
    approvalRate: number;
    interactionRate: number;
  }>;
  departmentStats: Array<{
    department: string;
    activeUsers: number;
    prescriptionsProcessed: number;
    averageResponseTime: number;
  }>;
}

const EXTENDED_DRUGS = [
  { name: 'Metformin', dosages: ['500mg', '850mg', '1000mg'], category: 'Diabetes' },
  { name: 'Lisinopril', dosages: ['5mg', '10mg', '20mg', '40mg'], category: 'Cardiovascular' },
  { name: 'Atorvastatin', dosages: ['10mg', '20mg', '40mg', '80mg'], category: 'Cholesterol' },
  { name: 'Amlodipine', dosages: ['2.5mg', '5mg', '10mg'], category: 'Blood Pressure' },
  { name: 'Omeprazole', dosages: ['20mg', '40mg'], category: 'Gastric' },
  { name: 'Levothyroxine', dosages: ['25mcg', '50mcg', '75mcg', '100mcg'], category: 'Thyroid' },
  { name: 'Metoprolol', dosages: ['25mg', '50mg', '100mg'], category: 'Beta Blocker' },
  { name: 'Hydrochlorothiazide', dosages: ['12.5mg', '25mg', '50mg'], category: 'Diuretic' },
  { name: 'Warfarin', dosages: ['1mg', '2mg', '5mg', '10mg'], category: 'Anticoagulant' },
  { name: 'Furosemide', dosages: ['20mg', '40mg', '80mg'], category: 'Diuretic' },
  { name: 'Prednisone', dosages: ['5mg', '10mg', '20mg'], category: 'Steroid' },
  { name: 'Ibuprofen', dosages: ['200mg', '400mg', '600mg'], category: 'NSAID' },
  { name: 'Acetaminophen', dosages: ['325mg', '500mg', '650mg'], category: 'Analgesic' },
  { name: 'Amoxicillin', dosages: ['250mg', '500mg', '875mg'], category: 'Antibiotic' },
  { name: 'Ciprofloxacin', dosages: ['250mg', '500mg', '750mg'], category: 'Antibiotic' },
  { name: 'Losartan', dosages: ['25mg', '50mg', '100mg'], category: 'ARB' },
  { name: 'Simvastatin', dosages: ['10mg', '20mg', '40mg', '80mg'], category: 'Statin' },
  { name: 'Gabapentin', dosages: ['100mg', '300mg', '400mg'], category: 'Anticonvulsant' },
  { name: 'Sertraline', dosages: ['25mg', '50mg', '100mg'], category: 'Antidepressant' },
  { name: 'Alprazolam', dosages: ['0.25mg', '0.5mg', '1mg'], category: 'Benzodiazepine' }
];

const SYMPTOMS_DATABASE = [
  'Chest pain', 'Shortness of breath', 'High blood pressure', 'Diabetes symptoms',
  'Anxiety', 'Depression', 'Chronic pain', 'Insomnia', 'Hypertension',
  'Hyperlipidemia', 'GERD', 'Arthritis pain', 'Migraine', 'Back pain',
  'Thyroid dysfunction', 'Heart palpitations', 'Digestive issues', 'Fatigue',
  'Dizziness', 'Nausea', 'Infection symptoms', 'Allergic reactions',
  'Respiratory issues', 'Skin conditions', 'Neurological symptoms'
];

const MEDICAL_CONDITIONS = [
  'Hypertension', 'Type 2 Diabetes', 'Hyperlipidemia', 'Coronary Artery Disease',
  'Asthma', 'COPD', 'Chronic Kidney Disease', 'Heart Failure', 'Atrial Fibrillation',
  'Osteoarthritis', 'Rheumatoid Arthritis', 'Depression', 'Anxiety Disorder',
  'Thyroid Disease', 'Gastroesophageal Reflux Disease', 'Hypertrophic Cardiomyopathy',
  'Chronic Pain Syndrome', 'Sleep Apnea', 'Osteoporosis', 'Migraine',
  'Epilepsy', 'Stroke History', 'Deep Vein Thrombosis', 'Pulmonary Embolism'
];

const SAMPLE_DOCTORS = [
  { id: 'DOC-001', name: 'Dr. Sarah Mitchell', department: 'Cardiology', experience: 15 },
  { id: 'DOC-002', name: 'Dr. James Wilson', department: 'Internal Medicine', experience: 12 },
  { id: 'DOC-003', name: 'Dr. Emily Chen', department: 'Endocrinology', experience: 8 },
  { id: 'DOC-004', name: 'Dr. Robert Johnson', department: 'Neurology', experience: 20 },
  { id: 'DOC-005', name: 'Dr. Maria Garcia', department: 'Psychiatry', experience: 10 },
  { id: 'DOC-006', name: 'Dr. David Brown', department: 'Orthopedics', experience: 18 },
  { id: 'DOC-007', name: 'Dr. Lisa Anderson', department: 'Dermatology', experience: 7 },
  { id: 'DOC-008', name: 'Dr. Michael Thompson', department: 'Gastroenterology', experience: 14 },
  { id: 'DOC-009', name: 'Dr. Jennifer Lee', department: 'Pulmonology', experience: 11 },
  { id: 'DOC-010', name: 'Dr. Christopher Davis', department: 'Rheumatology', experience: 16 }
];

const SAMPLE_NURSES = [
  { id: 'NUR-001', name: 'Sarah Johnson', department: 'Emergency Care', experience: 8 },
  { id: 'NUR-002', name: 'Michael Rodriguez', department: 'ICU', experience: 12 },
  { id: 'NUR-003', name: 'Emma Williams', department: 'Medical-Surgical', experience: 6 },
  { id: 'NUR-004', name: 'Daniel Kim', department: 'Pediatrics', experience: 9 },
  { id: 'NUR-005', name: 'Jessica Martinez', department: 'Oncology', experience: 11 },
  { id: 'NUR-006', name: 'Ryan Taylor', department: 'Cardiac Care', experience: 7 },
  { id: 'NUR-007', name: 'Amanda Clark', department: 'Recovery', experience: 5 },
  { id: 'NUR-008', name: 'Brandon Lewis', department: 'OR', experience: 10 },
  { id: 'NUR-009', name: 'Nicole Walker', department: 'Nephrology', experience: 8 },
  { id: 'NUR-010', name: 'Kevin Hall', department: 'Neurology', experience: 13 }
];

export const generateEnhancedPrescriptions = (count: number = 200): EnhancedPrescription[] => {
  const prescriptions: EnhancedPrescription[] = [];
  const statuses: EnhancedPrescription['status'][] = ['pending', 'approved', 'rejected', 'under_review', 'checked', 'dispensed'];
  const priorities: EnhancedPrescription['priority'][] = ['low', 'medium', 'high', 'critical'];
  
  for (let i = 0; i < count; i++) {
    const patient = generateSinglePatient(i + 1);
    const doctor = SAMPLE_DOCTORS[Math.floor(Math.random() * SAMPLE_DOCTORS.length)];
    const nurse = SAMPLE_NURSES[Math.floor(Math.random() * SAMPLE_NURSES.length)];
    const drug = EXTENDED_DRUGS[Math.floor(Math.random() * EXTENDED_DRUGS.length)];
    const dosage = drug.dosages[Math.floor(Math.random() * drug.dosages.length)];
    
    const uploadTime = subHours(new Date(), Math.floor(Math.random() * 168)); // Last week
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    
    const symptoms = generateSymptomsForDrug(drug.category);
    
    const aiComments = generateAIComments(drug.name, patient.age, priority);
    
    const prescription: EnhancedPrescription = {
      id: `RX-${String(i + 1).padStart(6, '0')}`,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientAge: patient.age,
      symptoms,
      doctorName: doctor.name,
      doctorId: doctor.id,
      nurseAssigned: Math.random() > 0.3 ? nurse.name : undefined,
      drugName: drug.name,
      dosage,
      frequency: SAMPLE_FREQUENCIES[Math.floor(Math.random() * SAMPLE_FREQUENCIES.length)],
      duration: `${Math.floor(Math.random() * 90) + 7} days`,
      instructions: generateInstructions(drug.name, dosage),
      status,
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
      uploadedAt: format(uploadTime, 'yyyy-MM-dd HH:mm:ss'),
      reviewedAt: status !== 'pending' ? format(subMinutes(uploadTime, Math.floor(Math.random() * 60)), 'yyyy-MM-dd HH:mm:ss') : undefined,
      reviewedBy: status !== 'pending' ? doctor.name : undefined,
      checkedAt: status === 'checked' || status === 'dispensed' ? format(subMinutes(uploadTime, Math.floor(Math.random() * 30)), 'yyyy-MM-dd HH:mm:ss') : undefined,
      checkedBy: status === 'checked' || status === 'dispensed' ? nurse.name : undefined,
      comments: generateComments(status, priority),
      aiComments,
      interactions: generateDrugInteractions(drug.name, patient.id),
      alternatives: generateAlternatives(drug.name),
      flags: generateFlags(priority, patient.age, drug.category),
      priority,
      allergies: patient.allergies,
      medicalHistory: patient.medicalHistory
    };
    
    prescriptions.push(prescription);
  }
  
  return prescriptions.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
};

const generateSinglePatient = (index: number) => {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'William', 'Jennifer', 'James', 'Mary', 'Christopher', 'Patricia', 'Daniel', 'Linda', 'Matthew', 'Elizabeth', 'Anthony', 'Barbara', 'Mark', 'Susan', 'Donald', 'Jessica', 'Steven', 'Karen', 'Paul', 'Nancy', 'Andrew', 'Betty'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const age = 18 + Math.floor(Math.random() * 70);
  
  return {
    id: `PAT-${String(index).padStart(4, '0')}`,
    firstName,
    lastName,
    age,
    allergies: SAMPLE_ALLERGIES.slice(0, Math.floor(Math.random() * 3)),
    medicalHistory: MEDICAL_CONDITIONS.slice(0, Math.floor(Math.random() * 4))
  };
};

const generateSymptomsForDrug = (category: string): string[] => {
  const categorySymptoms = {
    'Diabetes': ['High blood sugar', 'Frequent urination', 'Increased thirst'],
    'Cardiovascular': ['Chest pain', 'Shortness of breath', 'High blood pressure'],
    'Cholesterol': ['High cholesterol levels', 'Cardiovascular risk factors'],
    'Blood Pressure': ['Hypertension', 'Dizziness', 'Headaches'],
    'Gastric': ['Heartburn', 'Acid reflux', 'Stomach pain'],
    'Thyroid': ['Fatigue', 'Weight changes', 'Temperature sensitivity'],
    'NSAID': ['Pain', 'Inflammation', 'Fever'],
    'Antibiotic': ['Infection symptoms', 'Fever', 'Bacterial infection']
  };
  
  return categorySymptoms[category] || ['General symptoms', 'Pain', 'Discomfort'];
};

const generateAIComments = (drugName: string, age: number, priority: string): string[] => {
  const comments = [
    `AI Analysis: ${drugName} dosage appropriate for patient age ${age}`,
    `Drug interaction check completed - ${Math.random() > 0.7 ? 'No significant interactions found' : 'Minor interactions detected'}`,
    `Confidence score: ${Math.floor(Math.random() * 30) + 70}% - ${priority === 'high' ? 'Requires immediate attention' : 'Standard processing recommended'}`,
    `Patient history review: ${Math.random() > 0.5 ? 'Compatible with medical history' : 'Consider alternative due to medical history'}`
  ];
  
  return comments.slice(0, Math.floor(Math.random() * 3) + 1);
};

const generateInstructions = (drugName: string, dosage: string): string => {
  const instructions = [
    `Take ${dosage} with food`,
    `Take ${dosage} on empty stomach`,
    `Take ${dosage} at bedtime`,
    `Take ${dosage} in the morning`,
    `Take ${dosage} with plenty of water`
  ];
  
  return instructions[Math.floor(Math.random() * instructions.length)];
};

const generateComments = (status: string, priority: string): string | undefined => {
  if (status === 'rejected') {
    return ['Dosage too high for patient age', 'Drug interaction concern', 'Alternative medication recommended'][Math.floor(Math.random() * 3)];
  }
  if (priority === 'high' || priority === 'critical') {
    return 'Expedited review required due to priority level';
  }
  return undefined;
};

const generateDrugInteractions = (drugName: string, patientId: string): DrugInteraction[] => {
  const interactions: DrugInteraction[] = [];
  const interactionCount = Math.floor(Math.random() * 3);
  
  for (let i = 0; i < interactionCount; i++) {
    const otherDrug = EXTENDED_DRUGS[Math.floor(Math.random() * EXTENDED_DRUGS.length)];
    if (otherDrug.name !== drugName) {
      interactions.push({
        id: `INT-${Math.random().toString(36).substr(2, 9)}`,
        drug1: drugName,
        drug2: otherDrug.name,
        severity: ['mild', 'moderate', 'severe', 'critical'][Math.floor(Math.random() * 4)] as any,
        description: `Potential ${['mild', 'moderate', 'severe', 'critical'][Math.floor(Math.random() * 4)]} interaction between ${drugName} and ${otherDrug.name}`,
        recommendation: 'Monitor patient closely for adverse effects and consider dose adjustment',
        patientId,
        detectedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
      });
    }
  }
  
  return interactions;
};

const generateAlternatives = (drugName: string): Alternative[] => {
  const alternatives: Alternative[] = [];
  const alternativeCount = Math.floor(Math.random() * 4) + 1;
  
  for (let i = 0; i < alternativeCount; i++) {
    const altDrug = EXTENDED_DRUGS[Math.floor(Math.random() * EXTENDED_DRUGS.length)];
    if (altDrug.name !== drugName) {
      alternatives.push({
        drugName: altDrug.name,
        dosage: altDrug.dosages[Math.floor(Math.random() * altDrug.dosages.length)],
        reason: ['Lower risk of interactions', 'Better tolerability', 'More cost-effective', 'Fewer side effects'][Math.floor(Math.random() * 4)],
        safetyScore: 70 + Math.floor(Math.random() * 30),
        cost: `$${(Math.random() * 100 + 10).toFixed(2)}`,
        availability: ['in-stock', 'limited', 'out-of-stock'][Math.floor(Math.random() * 3)] as any
      });
    }
  }
  
  return alternatives;
};

const generateFlags = (priority: string, age: number, category: string): string[] => {
  const flags: string[] = [];
  
  if (priority === 'high' || priority === 'critical') flags.push('High Priority');
  if (age > 65) flags.push('Elderly Patient');
  if (age < 18) flags.push('Pediatric Patient');
  if (category === 'Anticoagulant') flags.push('Bleeding Risk');
  if (Math.random() > 0.8) flags.push('Allergy Alert');
  if (Math.random() > 0.9) flags.push('Drug Interaction');
  
  return flags;
};

const SAMPLE_FREQUENCIES = [
  'Once daily', 'Twice daily', 'Three times daily', 'Four times daily',
  'Every 12 hours', 'Every 8 hours', 'As needed', 'Before meals',
  'After meals', 'At bedtime', 'Every other day', 'Weekly'
];

const SAMPLE_ALLERGIES = [
  'Penicillin', 'Sulfa drugs', 'Aspirin', 'Latex', 'Shellfish', 'Nuts',
  'Eggs', 'Dairy', 'Codeine', 'Morphine', 'Iodine', 'Bee stings',
  'NSAIDs', 'ACE inhibitors', 'Statins', 'Beta blockers'
];

export const ENHANCED_PRESCRIPTIONS = generateEnhancedPrescriptions(200);
export const ENHANCED_USERS = generateEnhancedUsers();
export const ENHANCED_LOGS = generateEnhancedSystemLogs(200);
export const ENHANCED_NOTIFICATIONS = generateNotifications();
export const ENHANCED_ANALYTICS = generateAnalyticsData();

function generateEnhancedUsers(): UserProfile[] {
  const users: UserProfile[] = [];
  
  SAMPLE_DOCTORS.forEach((doctor, index) => {
    users.push({
      id: doctor.id,
      email: `${doctor.name.toLowerCase().replace(/[^a-z]/g, '')}@mediverse.com`,
      firstName: doctor.name.split(' ')[1],
      lastName: doctor.name.split(' ')[2] || doctor.name.split(' ')[1],
      role: 'doctor',
      department: doctor.department,
      isActive: Math.random() > 0.1,
      lastLogin: format(subHours(new Date(), Math.floor(Math.random() * 48)), 'yyyy-MM-dd HH:mm:ss'),
      createdAt: format(subDays(new Date(), Math.floor(Math.random() * 365)), 'yyyy-MM-dd'),
      permissions: ['upload_prescriptions', 'approve_reject', 'view_analytics', 'add_comments'],
      phoneNumber: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      address: `${Math.floor(Math.random() * 9999) + 1} Medical Center Dr, Healthcare City`,
      specialization: doctor.department,
      licenseNumber: `MD${Math.floor(Math.random() * 900000) + 100000}`,
      yearsExperience: doctor.experience
    });
  });
  
  SAMPLE_NURSES.forEach((nurse, index) => {
    users.push({
      id: nurse.id,
      email: `${nurse.name.toLowerCase().replace(/[^a-z]/g, '')}@mediverse.com`,
      firstName: nurse.name.split(' ')[0],
      lastName: nurse.name.split(' ')[1],
      role: 'nurse',
      department: nurse.department,
      isActive: Math.random() > 0.05,
      lastLogin: format(subHours(new Date(), Math.floor(Math.random() * 24)), 'yyyy-MM-dd HH:mm:ss'),
      createdAt: format(subDays(new Date(), Math.floor(Math.random() * 365)), 'yyyy-MM-dd'),
      permissions: ['view_prescriptions', 'update_status', 'view_interactions'],
      phoneNumber: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      address: `${Math.floor(Math.random() * 9999) + 1} Healthcare Ave, Medical District`,
      licenseNumber: `RN${Math.floor(Math.random() * 900000) + 100000}`,
      yearsExperience: nurse.experience
    });
  });
  
  users.push({
    id: 'ADM-001',
    email: 'admin@mediverse.com',
    firstName: 'Alex',
    lastName: 'Rodriguez',
    role: 'admin',
    department: 'System Administration',
    isActive: true,
    lastLogin: format(subMinutes(new Date(), 15), 'yyyy-MM-dd HH:mm:ss'),
    createdAt: format(subDays(new Date(), 180), 'yyyy-MM-dd'),
    permissions: ['manage_users', 'view_logs', 'system_settings', 'view_statistics', 'full_access'],
    phoneNumber: '(555) 123-0001',
    address: 'Administrative Building, MediVerse HQ',
    yearsExperience: 8
  });
  
  return users;
}

function generateEnhancedSystemLogs(count: number): SystemLog[] {
  const logs: SystemLog[] = [];
  const actions = [
    'Prescription uploaded', 'Prescription approved', 'Prescription rejected',
    'User login', 'User logout', 'Settings updated', 'Patient added',
    'Drug interaction check', 'Report generated', 'User created',
    'User deactivated', 'Password changed', 'Permission updated',
    'System backup', 'Data export', 'Analytics generated',
    'Security scan', 'Maintenance performed', 'Alert triggered'
  ];
  
  const modules = ['Authentication', 'Prescriptions', 'User Management', 'Analytics', 'Security', 'Maintenance', 'Reporting'];
  const users = ENHANCED_USERS || [];
  
  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)] || { id: 'SYS-001', firstName: 'System', lastName: 'User', role: 'system' };
    const action = actions[Math.floor(Math.random() * actions.length)];
    const timestamp = subMinutes(new Date(), Math.floor(Math.random() * 7200)); // Last 5 days
    
    logs.push({
      id: `LOG-${String(i + 1).padStart(6, '0')}`,
      timestamp: format(timestamp, 'yyyy-MM-dd HH:mm:ss'),
      action,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userRole: user.role,
      details: `${action} - ${generateLogDetails(action)}`,
      status: Math.random() > 0.95 ? 'error' : Math.random() > 0.85 ? 'warning' : 'success',
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      module: modules[Math.floor(Math.random() * modules.length)]
    });
  }
  
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function generateLogDetails(action: string): string {
  const details = {
    'Prescription uploaded': 'New prescription submitted for AI validation',
    'Prescription approved': 'Prescription passed all validation checks',
    'Prescription rejected': 'Prescription failed validation - see comments',
    'User login': 'Successful authentication',
    'User logout': 'Session terminated normally',
    'Settings updated': 'System configuration changed',
    'Drug interaction check': 'Automated interaction screening completed',
    'Report generated': 'Analytics report created successfully',
    'User created': 'New user account provisioned',
    'Security scan': 'Automated security check performed'
  };
  
  return details[action] || 'System operation completed';
}

function generateNotifications(): Notification[] {
  const notifications: Notification[] = [];
  const users = ['nurse-001', 'doctor-001', 'admin-001'];
  const types: Notification['type'][] = ['info', 'warning', 'error', 'success'];
  
  const notificationTemplates = [
    { title: 'New Prescription Assignment', message: 'You have been assigned a new prescription for review', type: 'info' as const },
    { title: 'Drug Interaction Alert', message: 'Critical drug interaction detected in prescription RX-001234', type: 'warning' as const },
    { title: 'System Maintenance', message: 'Scheduled maintenance will begin at 2:00 AM', type: 'info' as const },
    { title: 'High Priority Prescription', message: 'Critical prescription requires immediate attention', type: 'error' as const },
    { title: 'Approval Completed', message: 'Prescription RX-001235 has been successfully approved', type: 'success' as const },
    { title: 'User Account Updated', message: 'Your profile information has been updated', type: 'success' as const },
    { title: 'Security Alert', message: 'Unusual login activity detected', type: 'warning' as const },
    { title: 'Report Ready', message: 'Monthly analytics report is now available', type: 'info' as const }
  ];
  
  for (let i = 0; i < 50; i++) {
    const template = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
    const userId = users[Math.floor(Math.random() * users.length)];
    
    notifications.push({
      id: `NOT-${String(i + 1).padStart(6, '0')}`,
      userId,
      title: template.title,
      message: template.message,
      type: template.type,
      isRead: Math.random() > 0.6,
      createdAt: format(subHours(new Date(), Math.floor(Math.random() * 168)), 'yyyy-MM-dd HH:mm:ss'),
      actionRequired: template.type === 'error' || template.type === 'warning',
      relatedId: Math.random() > 0.5 ? `RX-${String(Math.floor(Math.random() * 200) + 1).padStart(6, '0')}` : undefined
    });
  }
  
  return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function generateAnalyticsData(): AnalyticsData {
  const totalProcessed = 1247;
  const approved = 987;
  const rejected = 156;
  const pending = 104;
  const fraudDetected = 23;
  
  const dailyData = [];
  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    dailyData.push({
      date,
      prescriptions: Math.floor(Math.random() * 50) + 20,
      fraudDetected: Math.floor(Math.random() * 3),
      averageConfidence: Math.floor(Math.random() * 20) + 80
    });
  }
  
  const drugStats = EXTENDED_DRUGS.slice(0, 10).map(drug => ({
    drugName: drug.name,
    prescriptionCount: Math.floor(Math.random() * 100) + 20,
    approvalRate: Math.floor(Math.random() * 30) + 70,
    interactionRate: Math.floor(Math.random() * 15) + 5
  }));
  
  const departments = ['Cardiology', 'Internal Medicine', 'Endocrinology', 'Neurology', 'Emergency Care'];
  const departmentStats = departments.map(dept => ({
    department: dept,
    activeUsers: Math.floor(Math.random() * 15) + 5,
    prescriptionsProcessed: Math.floor(Math.random() * 200) + 50,
    averageResponseTime: Math.floor(Math.random() * 30) + 15
  }));
  
  return {
    prescriptionStats: {
      totalProcessed,
      approved,
      rejected,
      pending,
      fraudDetected,
      averageProcessingTime: 24 // minutes
    },
    dailyData,
    drugStats,
    departmentStats
  };
}
