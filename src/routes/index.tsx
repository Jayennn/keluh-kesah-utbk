import {createBrowserRouter} from "react-router-dom";
import App from "../App.tsx";
import Chats from "../components/chats/Chats.tsx";

export const route = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path: "/chats",
    element: <Chats/>
  }
])
