import React, { useState } from "react";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
// import 'react-pro-sidebar/dist/css/styles.css';
import {
  FaBook,
  FaCog,
  FaHome,
  FaUniversity,
  FaUserGraduate,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function MainSidebar() {
  const [collapsed] = useState(false);

  return (
    <Sidebar className={""} collapsed={collapsed}>
      <Menu
        menuItemStyles={{
          button: {
            // the active class will be added automatically by react router
            // so we can use it to style the active menu item
            [`&.active`]: {
              backgroundColor: "#DF6139",
              color: "#b6c8d9",
            },
          },
        }}
      >
        <MenuItem icon={<FaHome />}>
          Home
          <Link to="/home" />
        </MenuItem>
        <MenuItem icon={<FaUserGraduate />}>
          Students
          <Link to="/students" />
        </MenuItem>
        <SubMenu title="Management" icon={<FaUniversity />}>
          <MenuItem>
            Faculties
            <Link to="/faculties" />
          </MenuItem>
          <MenuItem>
            Schools
            <Link to="/schools" />
          </MenuItem>
          <MenuItem>
            Departments
            <Link to="/departments" />
          </MenuItem>
          <MenuItem>
            Programs
            <Link to="/programs" />
          </MenuItem>
        </SubMenu>
        <MenuItem icon={<FaBook />}>
          Courses
          <Link to="/courses" />
        </MenuItem>
        <MenuItem icon={<FaCog />}>
          Settings
          <Link to="/settings" />
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}
