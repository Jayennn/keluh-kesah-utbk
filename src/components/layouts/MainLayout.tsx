import {Outlet} from "react-router-dom";

function MainLayout () {
  return (
    <div className="bg-gray-200 md:flex md:items-center md:justify-center">
      <div className="md:container md:px-[20rem] font-poppins">
        <Outlet/>
      </div>
    </div>
  )
}

export default MainLayout;
