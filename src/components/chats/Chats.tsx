import {useContext} from "react";
import {AuthContext} from "../../contexts/auth-context";



function Chats() {
  const user = useContext(AuthContext);
  return (
    <>
      <img src={user?.currentUser?.photoURL} alt=""/>
      <h1>Chats Page</h1>
    </>
  )
}

export default Chats;
