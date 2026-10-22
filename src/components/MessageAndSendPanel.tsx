import {
  ModusWcAlert,
  ModusWcButton,
  ModusWcCard,
  ModusWcIcon,
  ModusWcTextInput,
  ModusWcTextarea,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';
import { formatEmployeeMetaLine, type Employee } from '../data/employees';
import type { SendScope } from './RecipientPickerPanel';
import { readInputString } from '../utils/modusFormEvents';

type MessageAndSendPanelProps = {
  scope: SendScope;
  companyEligibleCount: number;
  recipients: Employee[];
  title: string;
  message: string;
  submitted: boolean;
  canSend: boolean;
  onTitleChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onRemoveRecipient: (employeeId: string) => void;
  onClearRecipients: () => void;
  onSend: () => void;
};

export default function MessageAndSendPanel({
  scope,
  companyEligibleCount,
  recipients,
  title,
  message,
  submitted,
  canSend,
  onTitleChange,
  onMessageChange,
  onRemoveRecipient,
  onClearRecipients,
  onSend,
}: MessageAndSendPanelProps) {
  const titleFeedback =
    submitted && !title.trim()
      ? { level: 'error' as const, message: 'Enter a notification title.' }
      : undefined;
  const messageFeedback =
    submitted && !message.trim()
      ? { level: 'error' as const, message: 'Enter a notification message.' }
      : undefined;

  return (
    <ModusWcCard bordered padding="compact" customClass="panel-card">
      <div slot="title" className="message-panel-header">
        <ModusWcTypography
          hierarchy="h2"
          size="lg"
          weight="semibold"
          label="Message and send list"
        />
        <ModusWcButton
          variant="filled"
          color="primary"
          size="sm"
          disabled={!canSend}
          onButtonClick={onSend}
        >
          <ModusWcIcon name="paper_plane" size="xs" decorative />
          Send Notification
        </ModusWcButton>
      </div>

      <div className="form-stack">
        <ModusWcTextInput
          label="Notification Title"
          inputId="notification-title"
          required
          value={title}
          placeholder="Timesheet reminder"
          feedback={titleFeedback}
          onInputChange={(event: CustomEvent) => onTitleChange(readInputString(event))}
        />
        <ModusWcTextarea
          label="Notification Message"
          inputId="notification-message"
          required
          rows={5}
          value={message}
          placeholder="Write the message employees will see on their phone."
          feedback={messageFeedback}
          onInputChange={(event: CustomEvent) => onMessageChange(readInputString(event))}
        />

        {scope === 'company' ? (
          <ModusWcAlert
            variant="info"
            role="status"
            aria-live="polite"
            alertTitle={
              companyEligibleCount === 1
                ? 'Sending to 1 eligible employee company-wide'
                : `Sending to all ${companyEligibleCount} eligible employees company-wide`
            }
            alertDescription="This send does not use the custom list. Only people who allowed notifications in the Timesheets app are included."
          />
        ) : (
          <section aria-label="Send list" className="send-list-section">
            <div className="send-list-header">
              <ModusWcTypography
                hierarchy="h3"
                size="md"
                weight="semibold"
                label={`Will be sent to (${recipients.length})`}
              />
              {recipients.length > 0 ? (
                <ModusWcButton
                  variant="outlined"
                  color="tertiary"
                  size="sm"
                  onButtonClick={onClearRecipients}
                >
                  Clear all
                </ModusWcButton>
              ) : null}
            </div>

            {recipients.length === 0 ? (
              <ModusWcTypography
                hierarchy="p"
                size="sm"
                customClass="muted"
                label="Add people from the panel on the left, or search for someone by name."
              />
            ) : (
              <ul className="recipient-rows send-list">
                {recipients.map((employee) => (
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
                        label={formatEmployeeMetaLine(employee)}
                      />
                    </div>
                    <ModusWcButton
                      variant="borderless"
                      color="tertiary"
                      size="sm"
                      shape="square"
                      aria-label={`Remove ${employee.name} from send list`}
                      onButtonClick={() => onRemoveRecipient(employee.id)}
                    >
                      <ModusWcIcon name="close" size="xs" decorative />
                    </ModusWcButton>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </ModusWcCard>
  );
}
