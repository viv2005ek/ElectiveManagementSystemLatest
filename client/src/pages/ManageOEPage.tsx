import React, {useEffect, useState} from "react";
import OpenElective from "../components/OpeElective.tsx";
import MainLayout from "../layouts/MainLayout.tsx";
import userDetails from "../store/currentUserData";
import electives from "../store/OEList.ts";
import img from "../assets/back.png";
import {useNavigate} from "react-router-dom";

const ManageOEPage: React.FC = () => {
  const navigate = useNavigate();
  const [isChangingOE, setIsChangingOE] = useState(false);
  const [userElective, setUserElective] = useState(userDetails.OE);

  const handleElectiveChange = (elective: {
    name: string;
    courseCode: string;
  }) => {
    // Add the elective to the electiveHistory
    userDetails.electiveHistory.push({
      OEName: elective.name,
      courseCode: elective.courseCode,
      status: "pending",
      date: new Date().toISOString(),
    });

    setIsChangingOE(false);
    console.log(
      `Changed elective to: ${elective.name} (${elective.courseCode})`,
    );
  };

  const filteredElectives = electives.filter(
    (elective) => elective.courseCode !== userElective.courseCode,
  );

  useEffect(() => {
    if (userElective.OEName === "" && userElective.courseCode === "") {
      navigate("/oe");
    }
  }, [userElective, navigate]);
  const handleCancel = (index: number) => {
    const updatedHistory = [...userDetails.electiveHistory];
    updatedHistory[index].status = "cancelled";
    userDetails.electiveHistory = updatedHistory;
    setUserElective({ ...userDetails.OE });
    console.log(`Elective at index ${index} has been cancelled.`);
  };

  return (
    <MainLayout>
      <div
        className="min-h-screen flex flex-col items-center w-full p-4"
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        }}
      >
        {!isChangingOE ? (
          <>
            <h1 className="text-lg md:text-xl lg:text-2xl p-3 font-bold bg-[#df6939] text-white w-full rounded-md text-center shadow-md mb-6">
              MANAGE OPEN ELECTIVE
            </h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 bg-opacity-40 min-w-[50%] flex flex-col items-center">
              <div className="text-lg font-semibold mb-4">
                <strong>OE Name:</strong> {userElective.OEName}
              </div>
              <div className="text-lg font-semibold mb-4">
                <strong>Course Code:</strong> {userElective.courseCode}
              </div>
              <button
                className="w-full bg-[#FFE6e6] bg-opacity-50 rounded-lg shadow p-4 text-center font-medium hover:bg-[#df6939] hover:text-white transition"
                onClick={() => setIsChangingOE(true)}
              >
                Change OE
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md bg-opacity-40 w-full mt-6">
              <h2 className="text-xl font-bold mb-4 text-center text-[#000000]">
                Elective History
              </h2>
              <table className="w-full border-collapse border border-gray-300 text-sm text-left">
                <thead className="bg-[#df6939] text-white">
                  <tr>
                    <th className="border border-gray-300 p-2">OE Name</th>
                    <th className="border border-gray-300 p-2">Course Code</th>
                    <th className="border border-gray-300 p-2">Status</th>
                    <th className="border border-gray-300 p-2">Date</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userDetails.electiveHistory.length > 0 ? (
                    userDetails.electiveHistory.map((history, index) => (
                      <tr
                        key={index}
                        className={`odd:bg-white even:bg-[#FFF4F2] `}
                      >
                        <td className="border border-gray-300 p-2">
                          {history.OEName || "N/A"}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {history.courseCode || "N/A"}
                        </td>
                        <td
                          className={`border border-gray-300 p-2 capitalize font-semibold ${
                            history.status === "pending"
                              ? "text-[#df6939]"
                              : history.status === "cancelled"
                                ? "text-red-500"
                                : "text-green-600"
                          }`}
                        >
                          {history.status || "N/A"}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {new Date(history.date).toLocaleString() || "N/A"}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {history.status === "pending" && (
                            <button
                              className="bg-[#df6939] text-white py-1 px-3 rounded-lg shadow hover:bg-[#bb572e] transition"
                              onClick={() => handleCancel(index)}
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="border border-gray-300 p-2 text-center text-[#df6939]"
                      >
                        No elective history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <OpenElective
              onRegister={handleElectiveChange}
              electives={filteredElectives}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ManageOEPage;
