import {createBrowserRouter} from "react-router-dom";
import App from "../App.tsx";
import Chats from "../components/chats/Chats.tsx";
import Sidebar from "../components/layouts/Sidebar.tsx";

export const route = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    element: <Sidebar/>,
    children: [
      {
        path: "/chats",
        element: <Chats/>
      }
    ]
  }
])
