import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import { createHashRouter, RouterProvider } from "react-router-dom";
import { Home } from './home';
import { Groups } from './groups';
import { Login } from './login';
import { Participants } from './participants';

const root = ReactDOM.createRoot(document.getElementById('root'));

if (typeof (window.electronAPI) === 'undefined') {
  document.getElementById('root').innerHTML = "Invalid browser, you have to use electron";
} else {
  const router = createHashRouter([
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/groups/:groupId",
      element: <Groups />,
    },
    {
      path: "/groups/:groupId/:participantId",
      element: <Participants />
    },
    {
      path: "/",
      element: <Login />,
    },
  ]);

  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
