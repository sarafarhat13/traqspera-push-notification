import { useCallback, useRef, useState } from 'react';
import { ModusWcAlert, ModusWcToast } from '@trimble-oss/moduswebcomponents-react';
import PushNotificationPage from './components/PushNotificationPage';

type ToastMessage = {
  id: string;
  title: string;
  description: string;
  variant?: 'success' | 'warning' | 'info';
};

const TOAST_DURATION_MS = 4500;

export default function App() {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const dismissTimeoutRef = useRef<number | undefined>(undefined);

  const showToast = useCallback(
    (next: Omit<ToastMessage, 'id'>) => {
      if (dismissTimeoutRef.current !== undefined) {
        window.clearTimeout(dismissTimeoutRef.current);
      }

      const toastWithId: ToastMessage = {
        ...next,
        id: crypto.randomUUID(),
      };
      setToast(toastWithId);

      dismissTimeoutRef.current = window.setTimeout(() => {
        setToast(null);
        dismissTimeoutRef.current = undefined;
      }, TOAST_DURATION_MS);
    },
    [],
  );

  return (
    <div className="app-shell">
      <main className="app-main" id="main-content">
        <PushNotificationPage onToast={showToast} />
      </main>
      <div className="toast-layer" aria-live="polite" aria-atomic="false">
        {toast ? (
          <ModusWcToast
            key={toast.id}
            position="bottom-end"
            delay={TOAST_DURATION_MS}
            customClass="app-toast"
          >
            <ModusWcAlert
              variant={toast.variant ?? 'success'}
              alertTitle={toast.title}
              alertDescription={toast.description}
            />
          </ModusWcToast>
        ) : null}
      </div>
    </div>
  );
}
