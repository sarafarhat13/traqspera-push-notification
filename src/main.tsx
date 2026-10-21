import { defineCustomElements } from '@trimble-oss/moduswebcomponents/loader';
import { ModusWcThemeProvider } from '@trimble-oss/moduswebcomponents-react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

defineCustomElements();

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element #root is missing.');
}

createRoot(root).render(
  <ModusWcThemeProvider>
    <App />
  </ModusWcThemeProvider>,
);
