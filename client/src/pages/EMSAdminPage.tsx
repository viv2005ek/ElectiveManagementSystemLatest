import React, { useState } from "react";
import { oeChangeRequests } from "../store/OEChangeRequests";
import MainLayout from "../layouts/MainLayout.tsx";
import InfoStudentPopUp from "../components/InfoStudentPopUp";

const EMSAdminPage: React.FC = () => {
  const [requests, setRequests] = useState(oeChangeRequests);
  const [filter, setFilter] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleApprove = (id: number) => {
    const updatedRequests = requests.map((req) => {
      if (req.id === id) {
        if (req.remainingSeats > 0) {
          req.status = "Approved";
          req.remainingSeats -= 1;
        } else {
          alert(
            `Approval failed for ${req.requestedOE.OEName}. No remaining seats.`,
          );
        }
      }
      return req;
    });
    setRequests(updatedRequests);
    console.log(`Processed approval for request ID: ${id}`);
  };

  const handleReject = (id: number) => {
    const updatedRequests = requests.map((req) =>
      req.id === id ? { ...req, status: "Rejected" } : req,
    );
    setRequests(updatedRequests);
    console.log(`Rejected request ID: ${id}`);
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.name.toLowerCase().includes(filter.toLowerCase()) ||
      req.registrationNo.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <MainLayout>
      <div className="min-h-screen flex flex-col items-center p-4 bg-gray-50">
        <div className="w-full max-w-6xl bg-white shadow-xl rounded-lg p-6">
          <h2 className="text-3xl font-bold text-[#df6939] mb-4 text-center">
            Open Elective Change Requests
          </h2>
          <input
            type="text"
            placeholder="Search by name or registration number"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#df6939] text-white">
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Registration No.
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Current OE
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Requested OE
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Remaining Seats
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="text-center hover:bg-gray-100">
                    <td
                      className="border border-gray-300 px-4 py-2 cursor-pointer hover:text-blue-500"
                      onClick={() => setSelectedUserId(req.userId ?? null)}
                    >
                      {req.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {req.registrationNo}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {req.currentOE.OEName} ({req.currentOE.courseCode})
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {req.requestedOE.OEName} ({req.requestedOE.courseCode})
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-2 font-medium ${
                        req.remainingSeats === 0
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {req.remainingSeats}
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-2 font-semibold ${
                        req.status === "Approved"
                          ? "text-green-500"
                          : req.status === "Rejected"
                            ? "text-red-500"
                            : "text-yellow-500"
                      }`}
                    >
                      {req.status}
                    </td>
                    <td className="border border-gray-300">
                      <div className="px-4 py-2 flex justify-center space-x-2">
                        {req.status === "Pending" && (
                          <>
                            {req.remainingSeats > 0 ? (
                              <button
                                className="bg-[#df6939] text-white px-3 py-1 rounded-md hover:bg-[#c65832]"
                                onClick={() => handleApprove(req.id)}
                              >
                                Approve
                              </button>
                            ) : null}
                            <button
                              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                              onClick={() => handleReject(req.id)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedUserId && (
        <InfoStudentPopUp
          id={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </MainLayout>
  );
};

export default EMSAdminPage;
