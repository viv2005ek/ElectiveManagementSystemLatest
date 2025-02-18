"use client";

import { Dispatch, SetStateAction } from 'react';
import { Description, Field, Label, Switch } from '@headlessui/react';

interface ToggleWithDescriptionProps {
  enabled: boolean;
  setEnabled: Dispatch<SetStateAction<boolean>>;
  title?: string;
  description?: string;
}

export default function ToggleWithDescription({
  enabled,
  setEnabled,
  title,
  description,
}: ToggleWithDescriptionProps) {
  return (
    <Field className={"flex items-center flex-row gap-4 w-full"}>
      <span className="flex grow flex-col gap-2">
        {title && (
          <Label as="span" className="text-sm font-medium text-gray-900">
            {title}
          </Label>
        )}
        {description && (
          <Description as="span" className="text-sm text-gray-500">
            {description}
          </Description>
        )}
      </span>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${enabled ? "bg-indigo-600" : "bg-gray-200"} relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`}
      >
        <span
          aria-hidden="true"
          className={`${enabled ? "translate-x-5" : "translate-x-0"} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </Field>
  );
}
