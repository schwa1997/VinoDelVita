import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/reset.css';

import App from './app';

import './styles/index.css';
import { UserProvider } from './components/pages/UserContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <UserProvider>
            <App />
        </UserProvider>
    </React.StrictMode>,
);
