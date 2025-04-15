import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Subject } from "../../hooks/subjectHooks/useFetchSubjects.ts";
import ToggleWithDescription from "../FormComponents/ToggleWithDescription.tsx";
import { useUpdateSubjectStatus } from "../../hooks/subjectHooks/useUpdateSubjectStatus.ts";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import DeletionModal from "./DeletionModal.tsx";
import { useDeleteSubject } from "../../hooks/subjectHooks/useDeleteSubject.ts";
import { TrashIcon } from "@heroicons/react/24/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface SubjectManageModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  subject: Subject | null;
  refresh: () => void;
}

export default function SubjectManageModal({
  open,
  setOpen,
  subject,
  refresh,
}: SubjectManageModalProps) {
  const { updateSubjectStatus } = useUpdateSubjectStatus();
  const [showDeletionModal, setShowDeletionModal] = useState(false);

  const [isPreferenceWindowOpen, setIsPreferenceWindowOpen] = useState(
    subject?.isPreferenceWindowOpen || false,
  );
  const [isAllotmentFinalized, setIsAllotmentFinalized] = useState(
    subject?.isAllotmentFinalized || false,
  );
  const [dueDate, setDueDate] = useState<string | null>(
    subject?.dueDate || null,
  );
  const [submitLoading, setSubmitLoading] = useState(false);
  const [focusDate, setFocusDate] = useState(false);

  const { deleteSubject } = useDeleteSubject();

  useEffect(() => {
    if (subject) {
      setIsPreferenceWindowOpen(subject.isPreferenceWindowOpen);
      setIsAllotmentFinalized(subject.isAllotmentFinalized);
      setDueDate(subject.dueDate);
    }
  }, [subject]);

  const handleDeletion = async () => {
    if (subject) {
      await deleteSubject(subject?.id);
      setShowDeletionModal(false);
      setOpen(false);
      refresh();
    }
  };

  const handleSubmit = async () => {
    if (subject) {
      if (!dueDate) {
        setFocusDate(true);
      }
      setSubmitLoading(true);
      const result = await updateSubjectStatus({
        id: subject.id,
        isPreferenceWindowOpen,
        isAllotmentFinalized,
        dueDate: dueDate,
      });
      setSubmitLoading(false);
      if (result) {
        refresh();
        setOpen(false);
      }
    }
  };

  useEffect(() => {
    if (isPreferenceWindowOpen) {
      setIsAllotmentFinalized(false);
    }
  }, [isPreferenceWindowOpen]);

  useEffect(() => {
    if (isAllotmentFinalized) {
      setIsPreferenceWindowOpen(false);
    }
  }, [isAllotmentFinalized]);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-50 transition-all"
    >
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm" />
      <div className="fixed inset-0 z-10 overflow-y-auto transition-all">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0 transition-all">
          <DialogPanel className="relative transform overflow-hidden rounded-xl bg-white px-6 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6">
            <div className="absolute right-0 top-0 pr-4 pt-4">
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => setOpen(false)}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <DialogTitle
                  as="h3"
                  className="text-xl font-semibold leading-6 text-gray-900"
                >
                  Manage Subject Settings
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {subject?.name} for Batch {subject?.batch.year}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-8">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <ToggleWithDescription
                  title="Preference Window"
                  description="Allow students to fill out their preferences for this subject."
                  enabled={isPreferenceWindowOpen}
                  setEnabled={setIsPreferenceWindowOpen}
                />
                {isPreferenceWindowOpen && (
                  <div className="mt-4">
                    <DatePicker
                      label="Due Date"
                      autoFocus={focusDate}
                      value={dueDate ? dayjs(dueDate) : null}
                      onChange={(date: Dayjs | null) =>
                        setDueDate(date?.toISOString() || null)
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          size: "small",
                        },
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon
                      className="h-5 w-5 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <ToggleWithDescription
                      warning={true}
                      title="Finalize Allotments"
                      description="This will make the current allotments final and delete all preferences data for this subject."
                      enabled={isAllotmentFinalized}
                      setEnabled={setIsAllotmentFinalized}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
              <button
                onClick={() => setShowDeletionModal(true)}
                className="inline-flex items-center gap-2 rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-150"
              >
                <TrashIcon className="h-5 w-5" />
                Delete Subject
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-150"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isPreferenceWindowOpen && !dueDate}
                  className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                  onClick={handleSubmit}
                >
                  {submitLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
      <DeletionModal
        open={showDeletionModal}
        setOpen={setShowDeletionModal}
        onDelete={handleDeletion}
        title="Delete Subject"
        description={`Are you sure you want to delete the subject ${subject?.name}?`}
        note="Note: Deleting this subject will also result in deletion of all the preference related data"
      />
    </Dialog>
  );
}
