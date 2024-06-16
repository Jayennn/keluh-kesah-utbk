import React from 'react'
import ReactDOM from 'react-dom/client'
  import './index.css'
import {RouterProvider} from "react-router-dom";
import {route} from "./routes";
import moment from "moment";
import {UserProvider} from "./contexts/UserContext.tsx";
moment().locale();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={route}/>
    </UserProvider>
  </React.StrictMode>,
)
