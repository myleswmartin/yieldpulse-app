import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/index.css';
import './styles/print.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  
);