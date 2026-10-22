import { useCallback, useMemo, useState } from 'react';
import { ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';
import { EMPLOYEES } from '../data/employees';
import {
  EMPTY_MULTI_FILTERS,
  clearMultiFilters,
  toggleFilterValue,
  type MultiFilters,
} from '../utils/employeeFilters';
import MessageAndSendPanel from './MessageAndSendPanel';
import RecipientPickerPanel, { type SendScope } from './RecipientPickerPanel';

type ToastPayload = {
  title: string;
  description: string;
  variant?: 'success' | 'warning' | 'info';
};

type PushNotificationPageProps = {
  onToast: (toast: ToastPayload) => void;
};

function alreadyOnSendListToast(employeeIds: string[]): ToastPayload {
  const names = employeeIds
    .map((id) => EMPLOYEES.find((employee) => employee.id === id)?.name)
    .filter((name): name is string => Boolean(name));

  if (names.length === 1) {
    return {
      variant: 'warning',
      title: 'Already on send list',
      description: `${names[0]} is already on the send list.`,
    };
  }

  return {
    variant: 'warning',
    title: 'Already on send list',
    description: `${names.length} people are already on the send list.`,
  };
}

export default function PushNotificationPage({ onToast }: PushNotificationPageProps) {
  const [scope, setScope] = useState<SendScope>('custom');
  const [recipientIds, setRecipientIds] = useState<string[]>([]);
  const [poolCheckedIds, setPoolCheckedIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [multiFilters, setMultiFilters] = useState<MultiFilters>(EMPTY_MULTI_FILTERS);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const reachableEmployees = useMemo(
    () => EMPLOYEES.filter((employee) => employee.notificationsAllowed),
    [],
  );

  const recipientIdSet = useMemo(() => new Set(recipientIds), [recipientIds]);

  const recipients = useMemo(
    () =>
      recipientIds
        .map((id) => EMPLOYEES.find((e) => e.id === id))
        .filter((e): e is NonNullable<typeof e> => Boolean(e)),
    [recipientIds],
  );

  const canSend =
    title.trim().length > 0 &&
    message.trim().length > 0 &&
    (scope === 'company' ? reachableEmployees.length > 0 : recipientIds.length > 0);

  const addRecipients = useCallback(
    (ids: string[]) => {
      if (ids.length === 0) return;

      const eligibleIds = ids.filter((id) => {
        const employee = EMPLOYEES.find((e) => e.id === id);
        return Boolean(employee?.notificationsAllowed);
      });

      const alreadyInList = eligibleIds.filter((id) => recipientIds.includes(id));
      const toAdd = eligibleIds.filter((id) => !recipientIds.includes(id));

      if (alreadyInList.length > 0) {
        onToast(alreadyOnSendListToast(alreadyInList));
      }

      if (toAdd.length === 0) return;

      setRecipientIds((current) => [...new Set([...current, ...toAdd])]);
    },
    [onToast, recipientIds],
  );

  const removeRecipient = useCallback((id: string) => {
    setRecipientIds((current) => current.filter((item) => item !== id));
  }, []);

  const clearRecipients = useCallback(() => {
    setRecipientIds([]);
    setPoolCheckedIds(new Set());
  }, []);

  const togglePoolCheck = useCallback((employeeId: string, checked: boolean) => {
    setPoolCheckedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(employeeId);
      else next.delete(employeeId);
      return next;
    });
  }, []);

  const setPoolChecksForEmployees = useCallback(
    (employeeIds: string[], checked: boolean) => {
      setPoolCheckedIds((current) => {
        const next = new Set(current);
        for (const id of employeeIds) {
          if (checked) next.add(id);
          else next.delete(id);
        }
        return next;
      });
    },
    [],
  );

  const toggleFilter = useCallback((dimension: keyof MultiFilters, value: string) => {
    setMultiFilters((current) => toggleFilterValue(current, dimension, value));
  }, []);

  function send() {
    setSubmitted(true);
    if (!canSend) return;

    const count =
      scope === 'company' ? reachableEmployees.length : recipientIds.length;

    onToast({
      variant: 'success',
      title: 'Notification sent',
      description:
        count === 1
          ? '1 employee will receive this notification.'
          : `${count} employees will receive this notification.`,
    });

    setTitle('');
    setMessage('');
    setRecipientIds([]);
    setPoolCheckedIds(new Set());
    setMultiFilters(clearMultiFilters());
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

      <div className="two-panel-grid">
        <RecipientPickerPanel
          scope={scope}
          onScopeChange={setScope}
          multiFilters={multiFilters}
          onToggleFilter={toggleFilter}
          onClearFilters={() => setMultiFilters(clearMultiFilters())}
          poolCheckedIds={poolCheckedIds}
          onTogglePoolCheck={togglePoolCheck}
          onSetPoolChecksForEmployees={setPoolChecksForEmployees}
          recipientIds={recipientIdSet}
          onAddRecipients={addRecipients}
          onSearchAdd={(id) => addRecipients([id])}
        />
        <MessageAndSendPanel
          scope={scope}
          companyEligibleCount={reachableEmployees.length}
          recipients={recipients}
          title={title}
          message={message}
          submitted={submitted}
          canSend={canSend}
          onTitleChange={setTitle}
          onMessageChange={setMessage}
          onRemoveRecipient={removeRecipient}
          onClearRecipients={clearRecipients}
          onSend={send}
        />
      </div>
    </div>
  );
}
