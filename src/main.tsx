import React from 'react'
import ReactDOM from 'react-dom/client'
  import './index.css'
import {RouterProvider} from "react-router-dom";
import {route} from "./routes";
import AuthProvider from "./contexts/auth-context";
import moment from "moment";
moment().locale();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={route}/>
    </AuthProvider>
  </React.StrictMode>,
)
