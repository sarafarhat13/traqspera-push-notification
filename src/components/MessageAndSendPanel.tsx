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
import { EMPTY_RECIPIENTS_HELP, FIELD_LABELS } from '../constants/formCopy';
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
      ? { level: 'error' as const, message: 'Enter a title.' }
      : undefined;
  const messageFeedback =
    submitted && !message.trim()
      ? { level: 'error' as const, message: 'Enter a message.' }
      : undefined;

  return (
    <ModusWcCard bordered padding="compact" customClass="panel-card">
      <div slot="title" className="message-panel-header">
        <ModusWcTypography
          hierarchy="h2"
          size="md"
          weight="semibold"
          label="Message"
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

      <div className="form-stack panel-form-fields">
        <ModusWcTextInput
          label={FIELD_LABELS.notificationTitle}
          inputId="notification-title"
          required
          value={title}
          placeholder="Timesheet reminder"
          feedback={titleFeedback}
          onInputChange={(event: CustomEvent) => onTitleChange(readInputString(event))}
        />
        <ModusWcTextarea
          label={FIELD_LABELS.notificationMessage}
          inputId="notification-message"
          required
          rows={5}
          value={message}
          placeholder="Submit your timesheet by Friday."
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
                ? '1 employee will get this'
                : `${companyEligibleCount} employees will get this`
            }
          />
        ) : (
          <section aria-label="Send list" className="send-list-section">
            <div className="send-list-header">
              <ModusWcTypography
                hierarchy="h3"
                size="md"
                weight="semibold"
                label={`Recipients (${recipients.length})`}
              />
              {recipients.length > 0 ? (
                <ModusWcButton
                  variant="outlined"
                  color="tertiary"
                  size="sm"
                  onButtonClick={onClearRecipients}
                >
                  Remove all
                </ModusWcButton>
              ) : null}
            </div>

            {recipients.length === 0 ? (
              <div className="send-list-empty-help">
                <ModusWcTypography
                  hierarchy="p"
                  size="sm"
                  customClass="muted"
                  label={EMPTY_RECIPIENTS_HELP.addEmployees}
                />
                <ModusWcTypography
                  hierarchy="p"
                  size="sm"
                  customClass="muted"
                  label={EMPTY_RECIPIENTS_HELP.sendRequirements}
                />
              </div>
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
