import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import currentUser from "../store/currentUserData";
import { FaList } from "react-icons/fa";
import { ImCross } from "react-icons/im";

import Sidebar from "./Sidebar";
import { RootState, store } from "../redux/store.ts";
import { useSelector } from "react-redux";
import { toast } from "react-toastify"; // import Sidebar if it's a separate component

export default function TopBar() {
  const { name, profilePic, mailId, mobileNo1, branchName, courseName } =
    currentUser;

  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { user, loading } = useSelector((state: RootState) => state.auth);

  const handleProfileClick = () => {
    console.log("User state from Redux:", user); // Logs the current user state
    navigate("/user-profile");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <div className="sticky top-0 bg-white">
      <div className="shadow-md h-auto flex items-center justify-between px-6 py-2">
        <div className="flex md:hidden">
          <button onClick={toggleSidebar} className="p-2 focus:outline-none">
            {isSidebarOpen ? (
              <span className="material-icons">
                <ImCross />
              </span>
            ) : (
              <span className="material-icons ">
                <FaList />
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-grow flex-col sm:flex-row sm:items-center">
          <div className="ml-4">
            <div className="text-xl">
              <span className="font-thin">Welcome back, </span>
              <span className="font-semibold">{user?.firstName}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center gap-4 relative">
          <div
            className="relative group cursor-pointer"
            onClick={handleProfileClick}
          >
            <img
              src={profilePic ?? "./userDefaultPfp.png"}
              alt={`${name}'s Profile`}
              className="h-12 w-auto rounded-full object-cover text-gray-600"
            />
            <div className="absolute left-[-8rem] hidden group-hover:block bg-white shadow-md rounded-lg p-4 w-48 max-w-xs mt-2 text-sm text-gray-700 z-10">
              <div>
                <div className="font-semibold">{name}</div>
                <div>{mailId}</div>
                <div>{mobileNo1}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`transition-transform duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        {isSidebarOpen && <Sidebar />}
      </div>
    </div>
  );
}
