import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './styles/global.css';

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY.includes('your_clerk')) {
  document.getElementById('root').innerHTML =
    '<div style="padding:40px;font-family:sans-serif;color:#de350b">' +
    '<h2>⚠️ Missing Clerk Key</h2>' +
    '<p>Set <code>REACT_APP_CLERK_PUBLISHABLE_KEY</code> in <code>client/.env</code> and restart.</p>' +
    '</div>';
} else {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      <App />
    </ClerkProvider>
  );
}
