// OpenElectivePage.tsx
import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout.tsx';
import OpenElective from '../components/OpeElective.tsx';
import electives from '../store/OEList.ts';
import userDetails from '../store/currentUserData';
import img from '../assets/back.png';
import { useNavigate } from 'react-router-dom';

const OpenElectivePage: React.FC = () => {
  const [userElective, setUserElective] = useState(userDetails.OE);
  const navigate = useNavigate();

  const handleElectiveRegister = (elective: {
    name: string;
    courseCode: string;
  }) => {
    userDetails.OE.OEName = elective.name;
    userDetails.OE.courseCode = elective.courseCode;

    userDetails.electiveHistory.push({
      OEName: elective.name,
      courseCode: elective.courseCode,
      status: "assigned",
      date: new Date().toISOString(),
    });
    setUserElective(userDetails.OE);
    navigate("/oe");
  };

  return (
    <MainLayout>
      <div
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        }}
      >
        {userElective.OEName === "" && userElective.courseCode === "" ? (
          <OpenElective
            electives={electives}
            onRegister={handleElectiveRegister}
          />
        ) : (
          <div className="flex flex-col items-center w-full p-4">
            <h1 className="text-lg md:text-xl lg:text-2xl p-3 font-bold bg-[#df6939] text-white w-full rounded-md text-center shadow-md mb-6">
              ELECTIVE DETAILS
            </h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 bg-opacity-40 min-w-[50%] flex flex-col items-center">
              <div className="text-lg font-semibold mb-4">
                <strong>OE Name:</strong> {userElective.OEName}
              </div>
              <div className="text-lg font-semibold mb-4">
                <strong>Course Code:</strong> {userElective.courseCode}
              </div>
              <button
                className="w-full bg-[#FFE6e6] bg-opacity-50 rounded-lg shadow p-4 text-center font-medium hover:bg-[#df6939] hover:text-white transition "
                onClick={() => navigate("/oemanage")}
              >
                Manage Elective
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default OpenElectivePage;
