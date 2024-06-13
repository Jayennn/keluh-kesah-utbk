import {Outlet, useNavigate} from "react-router-dom";
import {LogOut} from "lucide-react";
import {signOut} from "firebase/auth"

import {auth} from "../../firebase-config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import placeholderUser from "../../assets/placeholder/placeholder-user.jpg";

function Sidebar(){
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const signOutUser = async() => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  }
  return (
    <>
      <div className="flex min-h-screen font-poppins">
        <div className="fixed top-0 max-w-[270px] w-full border-r border-gray-300 border-solid">
          <div className="h-screen flex flex-col p-4">
            <div className="flex items-center space-x-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <img className="object-contain" src={user?.photoURL ?? placeholderUser} alt="user-image"/>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 leading-4">Profile</p>
                <p className="text-base font-medium">{user?.displayName}</p>
              </div>
            </div>
            <button onClick={signOutUser} className="transition-all hover:bg-gray-100/90 mt-auto text-sm inline-flex items-center justify-center border rounded-md h-9 px-4 py-2">
              Logout
              <LogOut className="ml-2 w-4 h-4"/>
            </button>
          </div>
        </div>
        <div className="ml-[270px] w-full min-h-[80vh]">
          <Outlet/>
        </div>
      </div>
    </>
  )
}

export default Sidebar;
