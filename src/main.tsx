import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    document.dispatchEvent(new Event('xrostao-rendered'));
  } catch (error) {
    console.error("Fatal render error:", error);
    rootElement.innerHTML = `<div style="color: white; padding: 20px; text-align: center;">Error loading site. Please refresh.</div>`;
  }
}
