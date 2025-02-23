"use client";

import { ReactNode, useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from '@headlessui/react';
import { Bars3Icon, BellIcon, Cog6ToothIcon, HomeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store.ts';
import { BookIcon, BuildingIcon, GraduationCap, SchoolIcon, UniversityIcon } from 'lucide-react';
import { BsBucket } from 'react-icons/bs';
import { PiBooks, PiStudentBold } from 'react-icons/pi';
import { Link, useLocation } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

const navigation = [
  { name: "Home", href: "/home", icon: HomeIcon, current: true },
  { name: "Students", href: "/students", icon: PiStudentBold, current: false },
  {
    name: "Faculties",
    href: "/faculties",
    icon: UniversityIcon,
    current: false,
  },
  { name: "Schools", href: "/schools", icon: SchoolIcon, current: false },
  {
    name: "Departments",
    href: "/departments",
    icon: BuildingIcon,
    current: false,
  },
  { name: "Programs", href: "/programs", icon: GraduationCap, current: false },
  { name: "Courses", href: "/courses", icon: BookIcon, current: false },
  {
    name: "Course Buckets",
    href: "/course-buckets",
    icon: BsBucket,
    current: false,
  },
  { name: "Subjects", href: "/subjects", icon: PiBooks, current: false },
];

const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function MainLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  return (
    <>
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow  flex-col gap-y-5 overflow-y-auto  px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                  <img
                    alt="Your Company"
                    src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                    className="h-8 w-auto"
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <Link
                              to={item.href}
                              className={classNames(
                                location.pathname === item.href
                                  ? "bg-gray-50 text-indigo-600"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  location.pathname === item.href
                                    ? "text-indigo-600"
                                    : "text-gray-400 group-hover:text-indigo-600",
                                  "size-6 shrink-0",
                                )}
                              />
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="mt-auto">
                      <Link
                        to="#"
                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                      >
                        <Cog6ToothIcon
                          aria-hidden="true"
                          className="size-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                        />
                        Settings
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0  lg:z-50 lg:flex lg:w-72 lg:flex-col bg-muj-orange">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5  overflow-y-auto border-r border-gray-200 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center pt-12 mb-8 ">
              <img alt="Your Company" src="/MUJ_logo.png" className="w-max" />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-4">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={classNames(
                            location.pathname === item.href
                              ? "bg-gray-50 text-indigo-600"
                              : "text-white hover:bg-gray-50 hover:text-indigo-600",
                            "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              location.pathname === item.href
                                ? "text-indigo-600"
                                : "text-white-400 group-hover:text-indigo-600",
                              "size-6 shrink-0",
                            )}
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto">
                  <Link
                    to="#"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-white hover:bg-gray-50 hover:text-indigo-600"
                  >
                    <Cog6ToothIcon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-white group-hover:text-indigo-600"
                    />
                    Settings
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8">
            <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* Separator */}
              <div
                aria-hidden="true"
                className="h-6 w-px bg-gray-200 lg:hidden"
              />

              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className={"text-xl mt-4 flex flex-grow gap-2"}>
                  <span className={"font-light"}>{"Welcome back,   "}</span>
                  <span className={"font-semibold"}>
                    {" "}
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon aria-hidden="true" className="size-6" />
                  </button>

                  {/* Separator */}
                  <div
                    aria-hidden="true"
                    className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
                  />

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative">
                    <MenuButton className="-m-1.5 flex items-center p-1.5">
                      <span className="sr-only">Open user menu</span>
                      <img
                        alt=""
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        className="size-8 rounded-full bg-gray-50"
                      />
                      <span className="hidden lg:flex lg:items-center">
                        <span
                          aria-hidden="true"
                          className="ml-4 text-sm/6 font-semibold text-gray-900"
                        >
                          {user ? (
                            <div>
                              {user.firstName} {user.lastName}
                            </div>
                          ) : (
                            <Skeleton />
                          )}
                        </span>
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="ml-2 size-5 text-gray-400"
                        />
                      </span>
                    </MenuButton>
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      {userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          <Link
                            to={item.href}
                            className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                          >
                            {item.name}
                          </Link>
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </div>
              </div>
            </div>
          </div>

          <main className="">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
