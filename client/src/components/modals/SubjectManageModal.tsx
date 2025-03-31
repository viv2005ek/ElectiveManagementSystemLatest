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

  const [isPreferenceWindowOpen, setIsPreferenceWindowOpen] = useState(false);
  const [isAllotmentFinalized, setIsAllotmentFinalized] = useState(false);

  useEffect(() => {
    if (subject) {
      setIsPreferenceWindowOpen(subject.isPreferenceWindowOpen);
      setIsAllotmentFinalized(subject.isAllotmentFinalized);
    }
  }, [subject]);

  useEffect(() => {
    if (!open) {
      setIsPreferenceWindowOpen(false);
      setIsAllotmentFinalized(false);
    }
  }, [open]);

  useEffect(() => {
    if (isAllotmentFinalized) {
      setIsPreferenceWindowOpen(false);
    }
  }, [isAllotmentFinalized]);

  useEffect(() => {
    if (isPreferenceWindowOpen) {
      setIsAllotmentFinalized(false);
    }
  }, [isPreferenceWindowOpen]);

  const handleSubmit = async () => {
    if (subject) {
      const result = await updateSubjectStatus({
        id: subject.id,
        isPreferenceWindowOpen,
        isAllotmentFinalized,
      });
      if (result) {
        setOpen(false);
        refresh();
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-50"
    >
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-6 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6">
            <DialogTitle
              as="h3"
              className="text-lg text-center font-semibold leading-6 text-gray-900"
            >
              Manage Settings of {subject?.name} for Batch {subject?.batch.year}
            </DialogTitle>
            <div className="mt-8 flex flex-col gap-8">
              <ToggleWithDescription
                title="Is preference window open?"
                description="Enabling this will allow students to fill out their preferences for this particular subject."
                enabled={isPreferenceWindowOpen}
                setEnabled={setIsPreferenceWindowOpen}
              />
              <ToggleWithDescription
                warning={true}
                title="Are allotments finalized?"
                description="Turning this on will make the current allotments final and will delete all the preferences data for this subject."
                enabled={isAllotmentFinalized}
                setEnabled={setIsAllotmentFinalized}
              />
            </div>
            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
