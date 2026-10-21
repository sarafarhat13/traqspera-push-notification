import { useState } from 'react';
import { ModusWcAlert, ModusWcToast } from '@trimble-oss/moduswebcomponents-react';
import PushNotificationPage from './components/PushNotificationPage';

type ToastMessage = {
  title: string;
  description: string;
};

export default function App() {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  function showToast(next: ToastMessage) {
    setToast(next);
    window.setTimeout(() => setToast(null), 4500);
  }

  return (
    <div className="app-shell">
      <main className="app-main" id="main-content">
        <PushNotificationPage onSent={showToast} />
      </main>
      <div className="toast-layer" aria-live="polite" aria-atomic="false">
        {toast ? (
          <ModusWcToast position="bottom-end">
            <ModusWcAlert
              variant="success"
              alertTitle={toast.title}
              alertDescription={toast.description}
            />
          </ModusWcToast>
        ) : null}
      </div>
    </div>
  );
}
