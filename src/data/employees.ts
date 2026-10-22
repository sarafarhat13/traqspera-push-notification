export type Employee = {
  id: string;
  employeeCode: string;
  name: string;
  department: string;
  costCenter: string;
  role: string;
  notificationsAllowed: boolean;
};

export const EMPLOYEES: Employee[] = [
  {
    id: 'e1',
    employeeCode: 'EMP-1001',
    name: 'Avery Chen',
    department: 'Field Operations',
    costCenter: 'CC-100 Field',
    role: 'Foreman',
    notificationsAllowed: true,
  },
  {
    id: 'e2',
    employeeCode: 'EMP-1002',
    name: 'Jordan Hale',
    department: 'Field Operations',
    costCenter: 'CC-100 Field',
    role: 'Operator',
    notificationsAllowed: true,
  },
  {
    id: 'e3',
    employeeCode: 'EMP-1003',
    name: 'Sam Patel',
    department: 'Field Operations',
    costCenter: 'CC-210 Shop',
    role: 'Operator',
    notificationsAllowed: true,
  },
  {
    id: 'e4',
    employeeCode: 'EMP-1004',
    name: 'Riley Nguyen',
    department: 'Equipment',
    costCenter: 'CC-210 Shop',
    role: 'Mechanic',
    notificationsAllowed: true,
  },
  {
    id: 'e5',
    employeeCode: 'EMP-1005',
    name: 'Casey Brooks',
    department: 'Equipment',
    costCenter: 'CC-210 Shop',
    role: 'Mechanic',
    notificationsAllowed: true,
  },
  {
    id: 'e6',
    employeeCode: 'EMP-1006',
    name: 'Morgan Diaz',
    department: 'Equipment',
    costCenter: 'CC-210 Shop',
    role: 'Foreman',
    notificationsAllowed: true,
  },
  {
    id: 'e7',
    employeeCode: 'EMP-1007',
    name: 'Taylor Kim',
    department: 'Payroll',
    costCenter: 'CC-340 Office',
    role: 'Payroll Clerk',
    notificationsAllowed: true,
  },
  {
    id: 'e8',
    employeeCode: 'EMP-1008',
    name: 'Quinn Alvarez',
    department: 'Payroll',
    costCenter: 'CC-340 Office',
    role: 'Admin',
    notificationsAllowed: true,
  },
  {
    id: 'e9',
    employeeCode: 'EMP-1009',
    name: 'Drew Okonkwo',
    department: 'Safety',
    costCenter: 'CC-410 Safety',
    role: 'Superintendent',
    notificationsAllowed: true,
  },
  {
    id: 'e10',
    employeeCode: 'EMP-1010',
    name: 'Parker Singh',
    department: 'Safety',
    costCenter: 'CC-410 Safety',
    role: 'Admin',
    notificationsAllowed: true,
  },
  {
    id: 'e11',
    employeeCode: 'EMP-1011',
    name: 'Reese Laurent',
    department: 'Project Management',
    costCenter: 'CC-340 Office',
    role: 'Superintendent',
    notificationsAllowed: true,
  },
  {
    id: 'e12',
    employeeCode: 'EMP-1012',
    name: 'Jamie Ortiz',
    department: 'Project Management',
    costCenter: 'CC-100 Field',
    role: 'Foreman',
    notificationsAllowed: true,
  },
  {
    id: 'e13',
    employeeCode: 'EMP-1013',
    name: 'Alex Rivera',
    department: 'Field Operations',
    costCenter: 'CC-100 Field',
    role: 'Operator',
    notificationsAllowed: true,
  },
  {
    id: 'e14',
    employeeCode: 'EMP-1014',
    name: 'Cameron Walsh',
    department: 'Field Operations',
    costCenter: 'CC-410 Safety',
    role: 'Operator',
    notificationsAllowed: true,
  },
  {
    id: 'e15',
    employeeCode: 'EMP-1015',
    name: 'Skyler Berg',
    department: 'Equipment',
    costCenter: 'CC-210 Shop',
    role: 'Admin',
    notificationsAllowed: true,
  },
  {
    id: 'e16',
    employeeCode: 'EMP-1016',
    name: 'Harper Cole',
    department: 'Payroll',
    costCenter: 'CC-340 Office',
    role: 'Payroll Clerk',
    notificationsAllowed: true,
  },
];

export function uniqueValues(key: 'department' | 'costCenter' | 'role'): string[] {
  return [...new Set(EMPLOYEES.map((employee) => employee[key]))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function formatEmployeeMetaLine(employee: Employee, extra?: string): string {
  const parts = [
    employee.department,
    employee.costCenter,
    employee.role,
    employee.employeeCode,
  ];
  if (extra) parts.push(extra);
  return parts.join(' · ');
}
