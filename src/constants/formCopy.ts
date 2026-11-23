/** Field labels aligned with push-notifications copy reference (Title Case where noted). */
export const FIELD_LABELS = {
  department: 'Department',
  costCenter: 'Cost Center',
  role: 'Role',
  findSomeone: 'Find someone',
  notificationTitle: 'Notification Title',
  notificationMessage: 'Notification Message',
} as const;

export const FILTER_EMPTY_PLACEHOLDER = {
  department: 'Any department',
  costCenter: 'Any cost center',
  role: 'Any role',
} as const;

export function filterSelectionPlaceholder(selectedCount: number): string {
  return selectedCount === 1 ? '1 selected' : `${selectedCount} selected`;
}

export const BUTTON_LABELS = {
  addSelected: 'Add selected employees',
} as const;

export const EMPTY_RECIPIENTS_HELP = {
  addEmployees:
    'Select employees, then choose Add selected employees. Or search by name to add someone.',
  sendRequirements: 'Add a title, a message, and at least one employee.',
} as const;