import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../redux/store";
import {Navigate} from "react-router-dom";
import {UserRole} from "../types/UserTypes.ts";
import {fetchUser} from "../redux/slices/authSlice.ts";
import "../BouncingDots.css";

interface RoleWrapperProps {
  requiredRoles: UserRole[];
  children: React.ReactNode;
}

const RoleWrapper: React.FC<RoleWrapperProps> = ({
  requiredRoles,
  children,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser()).then(() => setInitialized(true));
    } else {
      setInitialized(true);
    }
  }, [dispatch, user]);

  if (loading || !initialized) {
    return (
      <div className={"flex items-center justify-center h-screen flex-col"}>
        {/*<div className={'text-2xl text-red-600'}>Getting the app ready</div>*/}
        <div className="bouncing-dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate replace={true} to="/login" />;
  }

  if (!user.role || !requiredRoles.includes(user.role)) {
    return <Navigate replace={true} to="/unauthorized" />;
  }

  return <>{children}</>;
};

export default RoleWrapper;
