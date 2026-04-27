import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './Mimics.css';
import { PLCDataProvider } from './Components/PLCDataProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <PLCDataProvider>
            <App />
        </PLCDataProvider>
    </React.StrictMode>
);