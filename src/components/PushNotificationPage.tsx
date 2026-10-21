import { useMemo, useState } from 'react';
import {
  ModusWcAlert,
  ModusWcAutocomplete,
  ModusWcButton,
  ModusWcCard,
  ModusWcDivider,
  ModusWcIcon,
  ModusWcRadio,
  ModusWcSelect,
  ModusWcTextInput,
  ModusWcTextarea,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';
import { EMPLOYEES, uniqueValues, type Employee } from '../data/employees';
import { readInputChecked, readInputString } from '../utils/modusFormEvents';

type RecipientMode = 'people' | 'filters';

type Filters = {
  department: string;
  costCenter: string;
  role: string;
};

type AutocompleteItem = {
  label: string;
  value: string;
  visibleInMenu: boolean;
  selected: boolean;
  checkbox: boolean;
};

const EMPTY_FILTERS: Filters = { department: '', costCenter: '', role: '' };

const DEPARTMENTS = uniqueValues('department');
const COST_CENTERS = uniqueValues('costCenter');
const ROLES = uniqueValues('role');

function withAll(values: string[]) {
  return [{ label: 'All', value: '' }, ...values.map((value) => ({ label: value, value }))];
}

function employeeMatches(employee: Employee, filters: Filters): boolean {
  const hasFilter = Boolean(filters.department || filters.costCenter || filters.role);
  if (!hasFilter) return false;
  if (filters.department && employee.department !== filters.department) return false;
  if (filters.costCenter && employee.costCenter !== filters.costCenter) return false;
  if (filters.role && employee.role !== filters.role) return false;
  return true;
}

function audienceSummary(willReceive: number, skipped: number, mode: RecipientMode, filtersSet: boolean) {
  const title =
    willReceive === 0
      ? 'No employees will receive this notification'
      : willReceive === 1
        ? '1 employee will receive this notification'
        : `${willReceive} employees will receive this notification`;

  let description = 'Only people who allowed notifications in the Timesheets app are included.';
  if (mode === 'people' && willReceive === 0) {
    description = 'Search and select the employees who should get this message.';
  } else if (mode === 'filters' && !filtersSet) {
    description = 'Choose a department, cost center, or role. Everyone who matches is included.';
  } else if (skipped > 0 && willReceive === 0) {
    description =
      skipped === 1
        ? '1 matching employee has not allowed notifications and will be skipped.'
        : `${skipped} matching employees have not allowed notifications and will be skipped.`;
  } else if (skipped > 0) {
    description =
      skipped === 1
        ? '1 matching employee has not allowed notifications and will be skipped.'
        : `${skipped} matching employees have not allowed notifications and will be skipped.`;
  }

  const variant = willReceive === 0 && skipped > 0 ? 'warning' : 'info';
  return { title, description, variant } as const;
}

type PushNotificationPageProps = {
  onSent: (toast: { title: string; description: string }) => void;
};

export default function PushNotificationPage({ onSent }: PushNotificationPageProps) {
  const [mode, setMode] = useState<RecipientMode>('people');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const reachableEmployees = useMemo(
    () => EMPLOYEES.filter((employee) => employee.notificationsAllowed),
    [],
  );

  const employeeItems = useMemo<AutocompleteItem[]>(
    () =>
      reachableEmployees.map((employee) => ({
        label: `${employee.name} · ${employee.role}`,
        value: employee.id,
        visibleInMenu: true,
        selected: selectedIds.includes(employee.id),
        checkbox: true,
      })),
    [reachableEmployees, selectedIds],
  );

  const filterMatches = useMemo(
    () => EMPLOYEES.filter((employee) => employeeMatches(employee, filters)),
    [filters],
  );

  const selectedEmployees = useMemo(
    () => reachableEmployees.filter((employee) => selectedIds.includes(employee.id)),
    [reachableEmployees, selectedIds],
  );

  const filtersSet = Boolean(filters.department || filters.costCenter || filters.role);
  const matchedWillReceive = filterMatches.filter((employee) => employee.notificationsAllowed);
  const matchedSkipped = filterMatches.filter((employee) => !employee.notificationsAllowed);
  const recipients = mode === 'people' ? selectedEmployees : matchedWillReceive;
  const skippedCount = mode === 'filters' ? matchedSkipped.length : 0;
  const summary = audienceSummary(recipients.length, skippedCount, mode, filtersSet);

  const titleFeedback =
    submitted && !title.trim()
      ? { level: 'error' as const, message: 'Enter a notification title.' }
      : undefined;
  const messageFeedback =
    submitted && !message.trim()
      ? { level: 'error' as const, message: 'Enter a notification message.' }
      : undefined;

  const canSend = recipients.length > 0 && title.trim().length > 0 && message.trim().length > 0;

  function addEmployee(item: { value?: string } | null) {
    const id = item?.value;
    if (!id) return;
    setSelectedIds((current) => (current.includes(id) ? current : [...current, id]));
  }

  function removeEmployee(item: { value?: string } | null) {
    const id = item?.value;
    if (!id) return;
    setSelectedIds((current) => current.filter((selected) => selected !== id));
  }

  function send() {
    setSubmitted(true);
    if (!canSend) return;
    const count = recipients.length;
    onSent({
      title: 'Notification sent',
      description:
        count === 1
          ? '1 employee will receive this notification.'
          : `${count} employees will receive this notification.`,
    });
    setTitle('');
    setMessage('');
    setSelectedIds([]);
    setFilters(EMPTY_FILTERS);
    setSubmitted(false);
  }

  return (
    <div className="page">
      <div className="page-intro">
        <ModusWcTypography
          hierarchy="h1"
          size="2xl"
          weight="semibold"
          label="Send Push Notification"
        />
        <ModusWcTypography
          hierarchy="p"
          size="sm"
          customClass="muted"
          label="Send a push notification to users who have allowed notifications in the Traqspera Timesheets mobile app."
        />
      </div>

      <ModusWcCard bordered padding="comfortable">
        <ModusWcTypography
          slot="title"
          hierarchy="h2"
          size="lg"
          weight="semibold"
          label="Recipients and message"
        />

        <div className="form-stack">
          <fieldset className="choice-group">
            <legend>
              <ModusWcTypography
                hierarchy="h3"
                size="md"
                weight="semibold"
                label="Who should receive this?"
              />
            </legend>

            <div className="choice-option">
              <ModusWcRadio
                name="recipient-mode"
                inputId="recipient-mode-people"
                label="Specific employees"
                value={mode === 'people'}
                onInputChange={(event: CustomEvent) => {
                  if (readInputChecked(event)) setMode('people');
                }}
              />
              <ModusWcTypography
                hierarchy="p"
                size="sm"
                customClass="muted"
                label="Pick one or more people. Only the employees you select are included."
              />
            </div>

            <div className="choice-option">
              <ModusWcRadio
                name="recipient-mode"
                inputId="recipient-mode-filters"
                label="Everyone matching filters"
                value={mode === 'filters'}
                onInputChange={(event: CustomEvent) => {
                  if (readInputChecked(event)) setMode('filters');
                }}
              />
              <ModusWcTypography
                hierarchy="p"
                size="sm"
                customClass="muted"
                label="Use the fields below. Everyone who matches all of the filters you set is included."
              />
            </div>
          </fieldset>

          <div className="choice-panel" hidden={mode !== 'people'}>
            <ModusWcAutocomplete
              label="Employees"
              placeholder="Search by name"
              multiSelect
              showMenuOnFocus
              leaveMenuOpen
              items={employeeItems}
              noResults={{
                ariaLabel: 'No employees found',
                label: 'No employees found',
                subLabel: 'Try another name. People who have not allowed notifications are not listed.',
              }}
              onItemSelect={(event) => addEmployee(event.detail)}
              onChipRemove={(event) => removeEmployee(event.detail)}
              onClearClick={() => setSelectedIds([])}
            />
            <ModusWcTypography
              hierarchy="p"
              size="sm"
              customClass="muted"
              label="People who have not allowed notifications in the Timesheets app are not listed."
            />
          </div>

          <div className="choice-panel" hidden={mode !== 'filters'}>
            <ModusWcSelect
              label="Department"
              inputId="filter-department"
              value={filters.department}
              options={withAll(DEPARTMENTS)}
              onInputChange={(event: CustomEvent) => {
                const department = readInputString(event);
                setFilters((current) => ({ ...current, department }));
              }}
            />
            <ModusWcSelect
              label="Cost Center"
              inputId="filter-cost-center"
              value={filters.costCenter}
              options={withAll(COST_CENTERS)}
              onInputChange={(event: CustomEvent) => {
                const costCenter = readInputString(event);
                setFilters((current) => ({ ...current, costCenter }));
              }}
            />
            <ModusWcSelect
              label="Role"
              inputId="filter-role"
              value={filters.role}
              options={withAll(ROLES)}
              onInputChange={(event: CustomEvent) => {
                const role = readInputString(event);
                setFilters((current) => ({ ...current, role }));
              }}
            />
            <ModusWcTypography
              hierarchy="p"
              size="sm"
              customClass="muted"
              label="Leave a field on All to ignore it. An employee must match every filter you set."
            />
            {filtersSet ? (
              <div className="filter-actions">
                <ModusWcButton
                  variant="outlined"
                  color="tertiary"
                  size="sm"
                  onButtonClick={() => setFilters(EMPTY_FILTERS)}
                >
                  Clear filters
                </ModusWcButton>
              </div>
            ) : null}

            {filterMatches.length > 0 ? (
              <section aria-label="Matching employees">
                <ModusWcTypography
                  hierarchy="h4"
                  size="sm"
                  weight="semibold"
                  label="Matching employees"
                />
                <ul className="recipient-rows">
                  {filterMatches.map((employee) => (
                    <li key={employee.id}>
                      <div className="recipient-copy">
                        <ModusWcTypography
                          hierarchy="p"
                          size="sm"
                          weight="semibold"
                          label={employee.name}
                        />
                        <ModusWcTypography
                          hierarchy="p"
                          size="xs"
                          customClass="muted"
                          label={`${employee.department} · ${employee.costCenter} · ${employee.role}`}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <ModusWcAlert
            variant={summary.variant}
            alertTitle={summary.title}
            alertDescription={summary.description}
            role="status"
          />

          <ModusWcDivider />

          <ModusWcTypography hierarchy="h3" size="md" weight="semibold" label="Message" />
          <ModusWcTextInput
            label="Notification Title"
            inputId="notification-title"
            required
            value={title}
            placeholder="Timesheet reminder"
            feedback={titleFeedback}
            onInputChange={(event: CustomEvent) => setTitle(readInputString(event))}
          />
          <ModusWcTextarea
            label="Notification Message"
            inputId="notification-message"
            required
            rows={5}
            value={message}
            placeholder="Write the message employees will see on their phone."
            feedback={messageFeedback}
            onInputChange={(event: CustomEvent) => setMessage(readInputString(event))}
          />
        </div>

        <div slot="footer" className="card-footer">
          <ModusWcButton
            variant="filled"
            color="primary"
            size="sm"
            disabled={!canSend}
            onButtonClick={send}
          >
            <ModusWcIcon name="form_send" size="sm" decorative />
            Send Notification
          </ModusWcButton>
        </div>
      </ModusWcCard>
    </div>
  );
}
