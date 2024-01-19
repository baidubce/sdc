import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { HashRouter as Router } from 'react-router-dom'
import 'acud/dist/acud.min.css';
import './assets/css/katex.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <Router>
    <App />
  </Router>
);