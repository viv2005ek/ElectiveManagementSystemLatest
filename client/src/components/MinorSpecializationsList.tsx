import { useState, useEffect } from 'react';
import { ChevronDownIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';

const specializations = [
  {
    name: 'Cloud Computing',
    department: 'CSE',
    subjects: ['AWS Basics', 'Azure Fundamentals', 'Distributed Systems'],
  },
  {
    name: 'Data Science',
    department: 'CSE',
    subjects: ['Machine Learning', 'Big Data', 'Data Visualization'],
  },
  {
    name: 'IoT',
    department: 'ECE',
    subjects: ['Embedded Systems', 'Wireless Communication', 'IoT Security'],
  },
  {
    name: 'Robotics',
    department: 'Mechanical',
    subjects: ['Automation', 'Kinematics', 'Control Systems'],
  },
];

function Notification({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-[#df6039] px-4 py-2 text-white shadow-lg flex items-center gap-x-2">
      <p>{message}</p>
      <XCircleIcon
        className="h-5 w-5 cursor-pointer hover:text-gray-200"
        onClick={onClose}
      />
    </div>
  );
}

export default function MinorSpecializationsList() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<
    { subject: string; department: string }[]
  >([]);
  const [notification, setNotification] = useState<string | null>(null);

  const handleSelectOrRemoveSubject = (subject: string, department: string) => {
    const selectedIndex = preferences.findIndex((pref) => pref.subject === subject);

    if (selectedIndex >= 0) {
      setPreferences((prev) => prev.filter((_, i) => i !== selectedIndex));
    } else {
      if (preferences.length >= 4) {
        setNotification('You can select a maximum of 4 preferences.');
        return;
      }
      setPreferences((prev) => [...prev, { subject, department }]);
    }
  };

  const handleRemovePreference = (index: number) => {
    setPreferences((prev) => prev.filter((_, i) => i !== index));
  };

  const getSelectedIndex = (subject: string) => {
    const index = preferences.findIndex((pref) => pref.subject === subject);
    return index >= 0 ? `Choosed-${index + 1}` : '';
  };

  return (
    <div className="space-y-6 px-2 sm:px-4 ">
      <ul
        role="list"
        className="divide-y divide-gray-200 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
      >
        {specializations.map((spec) => (
          <li key={spec.name} className="relative">
            <div
              className="flex justify-between px-2 py-3 hover:bg-gray-200 sm:px-6 cursor-pointer"
              onClick={() =>
                setOpenDropdown(openDropdown === spec.name ? null : spec.name)
              }
            >
              <div className="flex items-center gap-x-4">
                <p className="text-sm font-semibold text-gray-900">{spec.name}</p>
              </div>
              <div className="flex items-center gap-x-4">
                <p className="text-xs text-gray-500">{spec.department} Department</p>
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-500 transform ${
                    openDropdown === spec.name ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>
            {openDropdown === spec.name && (
              <ul className="bg-gray-50 px-2 py-2 sm:px-6">
                {spec.subjects.map((subject) => (
                  <li
                    key={subject}
                    onClick={() => handleSelectOrRemoveSubject(subject, spec.department)}
                    className={`cursor-pointer rounded-md px-2 py-2 text-sm ${
                      preferences.some((pref) => pref.subject === subject)
                        ? 'bg-[#df6039] hover:bg-[#a63e1e] text-white m-1'
                        : 'text-gray-700 hover:bg-[#a63e1e] hover:text-white m-1 border-black'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span>{subject}</span>
                      {getSelectedIndex(subject) && (
                        <span className="text-xs font-semibold text-white">
                          {getSelectedIndex(subject)}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
  
      <div className="overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <div className="px-2 py-4 sm:px-6">
          <h2 className="text-lg font-semibold text-gray-900">Preference Table</h2>
        </div>
        <div className="px-2 py-3 sm:px-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Preference No.
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Subject
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Department
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {preferences.map((preference, index) => (
                  <tr key={index}>
                    <td className="px-2 py-4 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-2 py-4 text-sm text-gray-500">
                      {preference.subject}
                    </td>
                    <td className="px-2 py-4 text-sm text-gray-500">
                      {preference.department}
                    </td>
                    <td className="px-2 py-4">
                      <button
                        onClick={() => handleRemovePreference(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-[#df6039] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#a63e1e]"
              onClick={() => {
                if (preferences.length < 4) {
                  setNotification('Please select 4 preferences before submitting.');
                  return;
                }
                setNotification('Preferences submitted successfully!');
              }}
            >
              Submit Preferences
            </button>
          </div>
        </div>
      </div>
  
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
  
}
