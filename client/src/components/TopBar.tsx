
import { useNavigate } from "react-router-dom";
import currentUser from "../store/currentUserData"; 
export default function TopBar() {
  const {
    name,
    profilePic,
    mailId,
    mobileNo1
  } = currentUser;

  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/user-profile");
  };

  return (
    <div className="shadow-md h-16 flex items-center justify-end px-4">
      <div className={"flex flex-grow"}>
        <div className={"ml-4"}>
          <div className={"text-xl"}>
            <span className={"font-thin"}>Welcome back, </span>
            <span className={"font-semibold"}>{name}</span>
          </div>
          <div className={"text-xl"}>
            <span className={"font-semibold"}>B.Tech </span>
            <span>in </span>
            <span className={"font-semibold"}>CSE </span>
          </div>
        </div>
      </div>
      <div className={"flex flex-row items-center gap-4 relative"}>
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
  );
}
