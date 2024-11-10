import React, { useState } from 'react';
import currentUser from '../store/currentUserData'; 

export default function UserProfile() {
  const {
    name,
    registrationNo,
    mobileNo1,
    mobileNo2,
    departmentName,
    branchName,
    semester,
    classCoordinator,
    profilePic,
    classCoordinatorName,
    mailId,
    section,
    batchNo,
    gender,
    password, 
  } = currentUser;

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = () => {
    if (newPassword.length < 8) {
      setMessage("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (oldPassword !== password) {
      setMessage("Old password is incorrect.");
      return;
    }

    setMessage("Password changed successfully.");
    
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordForm(false); 
  };

  return (
    <div className="p-8 max-w-screen-lg mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center">
        <img
          src={profilePic ?? "./userDefaultPfp.png"}
          alt={`${name}'s Profile`}
          className="w-32 h-32 rounded-full object-cover shadow-lg shadow-[#ababab] mb-4"
        />
        <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
        <p className="text-gray-500 mb-6">{mailId}</p>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p><span className="font-semibold">Registration No:</span> {registrationNo}</p>
          <p><span className="font-semibold">Department:</span> {departmentName}</p>
          <p><span className="font-semibold">Branch:</span> {branchName}</p>
          <p><span className="font-semibold">Semester:</span> {semester}</p>
          <p><span className="font-semibold">Section:</span> {section}</p>
          <p><span className="font-semibold">Batch No:</span> {batchNo}</p>
          <p><span className="font-semibold">Gender:</span> {gender}</p>
          <p><span className="font-semibold">Mobile 1:</span> {mobileNo1}</p>
          <p><span className="font-semibold">Mobile 2:</span> {mobileNo2}</p>
          <p>
            <span className="font-semibold">Class Coordinator:</span> {classCoordinator ? 'Yes' : 'No'}
          </p>
          {classCoordinator && (
            <p><span className="font-semibold">Coordinator Name:</span> {classCoordinatorName}</p>
          )}
        </div>

        <button
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          className="mt-6 bg-[#d05c23] text-white py-2 px-4 rounded-lg hover:bg-[#a73904] transition duration-200"
        >
          {showPasswordForm ? "Cancel" : "Change Password"}
        </button>

        {showPasswordForm && (
          <div className="w-full mt-6 p-6 bg-gray-50 rounded-lg shadow-inner">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Change Password</h2>
            
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="border rounded-lg p-3 w-full mb-4 focus:border-blue-400 focus:outline-none"
            />
            
           <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border rounded-lg p-3 w-full mb-4 focus:border-blue-400 focus:outline-none"
            />
            
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border rounded-lg p-3 w-full mb-4 focus:border-blue-400 focus:outline-none"
            />
            
            <button
              onClick={handleChangePassword}
              className="bg-[#d05c23] text-white py-2 px-4 rounded-lg hover:bg-[#a73904] transition duration-200 w-full"
            >
              Update Password
            </button>
            
            {message && <p className={`mt-4 text-center ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
