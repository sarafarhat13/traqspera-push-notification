export type Employee = {
  id: string;
  name: string;
  department: string;
  costCenter: string;
  role: string;
  notificationsAllowed: boolean;
};

export const EMPLOYEES: Employee[] = [
  {
    id: 'e1',
    name: 'Avery Chen',
    department: 'Field Operations',
    costCenter: 'CC-100 Field',
    role: 'Foreman',
    notificationsAllowed: true,
  },
  {
    id: 'e2',
    name: 'Jordan Hale',
    department: 'Field Operations',
    costCenter: 'CC-100 Field',
    role: 'Operator',
    notificationsAllowed: true,
  },
  {
    id: 'e3',
    name: 'Sam Patel',
    department: 'Field Operations',
    costCenter: 'CC-210 Shop',
    role: 'Operator',
    notificationsAllowed: false,
  },
  {
    id: 'e4',
    name: 'Riley Nguyen',
    department: 'Equipment',
    costCenter: 'CC-210 Shop',
    role: 'Mechanic',
    notificationsAllowed: true,
  },
  {
    id: 'e5',
    name: 'Casey Brooks',
    department: 'Equipment',
    costCenter: 'CC-210 Shop',
    role: 'Mechanic',
    notificationsAllowed: true,
  },
  {
    id: 'e6',
    name: 'Morgan Diaz',
    department: 'Equipment',
    costCenter: 'CC-210 Shop',
    role: 'Foreman',
    notificationsAllowed: false,
  },
  {
    id: 'e7',
    name: 'Taylor Kim',
    department: 'Payroll',
    costCenter: 'CC-340 Office',
    role: 'Payroll Clerk',
    notificationsAllowed: true,
  },
  {
    id: 'e8',
    name: 'Quinn Alvarez',
    department: 'Payroll',
    costCenter: 'CC-340 Office',
    role: 'Admin',
    notificationsAllowed: true,
  },
  {
    id: 'e9',
    name: 'Drew Okonkwo',
    department: 'Safety',
    costCenter: 'CC-410 Safety',
    role: 'Superintendent',
    notificationsAllowed: true,
  },
  {
    id: 'e10',
    name: 'Parker Singh',
    department: 'Safety',
    costCenter: 'CC-410 Safety',
    role: 'Admin',
    notificationsAllowed: false,
  },
  {
    id: 'e11',
    name: 'Reese Laurent',
    department: 'Project Management',
    costCenter: 'CC-340 Office',
    role: 'Superintendent',
    notificationsAllowed: true,
  },
  {
    id: 'e12',
    name: 'Jamie Ortiz',
    department: 'Project Management',
    costCenter: 'CC-100 Field',
    role: 'Foreman',
    notificationsAllowed: true,
  },
  {
    id: 'e13',
    name: 'Alex Rivera',
    department: 'Field Operations',
    costCenter: 'CC-100 Field',
    role: 'Operator',
    notificationsAllowed: true,
  },
  {
    id: 'e14',
    name: 'Cameron Walsh',
    department: 'Field Operations',
    costCenter: 'CC-410 Safety',
    role: 'Operator',
    notificationsAllowed: true,
  },
  {
    id: 'e15',
    name: 'Skyler Berg',
    department: 'Equipment',
    costCenter: 'CC-210 Shop',
    role: 'Admin',
    notificationsAllowed: true,
  },
  {
    id: 'e16',
    name: 'Harper Cole',
    department: 'Payroll',
    costCenter: 'CC-340 Office',
    role: 'Payroll Clerk',
    notificationsAllowed: false,
  },
];

export function uniqueValues(key: 'department' | 'costCenter' | 'role'): string[] {
  return [...new Set(EMPLOYEES.map((employee) => employee[key]))].sort((a, b) =>
    a.localeCompare(b),
  );
}
