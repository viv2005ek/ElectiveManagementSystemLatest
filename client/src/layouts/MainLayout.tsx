/* eslint-disable @typescript-eslint/no-explicit-any */
import {ReactNode, useEffect, useState, useRef, useCallback} from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import {
  AcademicCapIcon,
  Bars3Icon,
  BellIcon,
  BookOpenIcon,
  ChevronDownIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  HomeIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store.ts";
import {BookIcon, BuildingIcon, GraduationCap, SchoolIcon, UniversityIcon, UserIcon,Smartphone} from "lucide-react";
import {Link, useLocation} from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import {UserRole} from "../types/UserTypes.ts";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  current?: boolean;
  requiredRoles?: UserRole[];
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  {
    name: "Home",
    href: "/home",
    icon: HomeIcon,
    current: true,
    requiredRoles: [UserRole.ADMIN, UserRole.STUDENT],
  },
  
  {
    name: "My Subjects",
    href: "/my-subjects",
    icon: BookOpenIcon,
    current: true,
    requiredRoles: [UserRole.STUDENT],
  },
  {
    name: "Users",
    href: "#",
    icon: UserGroupIcon,
    current: false,
    requiredRoles: [UserRole.ADMIN],
    children: [
      {
        name: "Professors",
        href: "/professors",
        icon: AcademicCapIcon,
        current: false,
        requiredRoles: [UserRole.ADMIN],
      },
      {
        name: "Students",
        href: "/students",
        icon: UserIcon,
        current: false,
        requiredRoles: [UserRole.ADMIN],
      },
      {
        name: "Admins",
        href: "/admins",
        icon: ClipboardDocumentCheckIcon,
        current: false,
        requiredRoles: [UserRole.ADMIN],
      },
    ],
  },
  {
    name: "Management",
    href: "#",
    icon: BuildingIcon,
    current: false,
    requiredRoles: [UserRole.ADMIN],
    children: [
      {
        name: "Faculties",
        href: "/faculties",
        icon: UniversityIcon,
        current: false,
        requiredRoles: [UserRole.ADMIN],
      },
      {
        name: "Schools",
        href: "/schools",
        icon: SchoolIcon,
        current: false,
        requiredRoles: [UserRole.ADMIN],
      },
      {
        name: "Departments",
        href: "/departments",
        icon: BuildingIcon,
        current: false,
        requiredRoles: [UserRole.ADMIN],
      },
       {
        name: "Management",
        href: "/ManagementPage",
        icon: Smartphone,
        current: false,
        requiredRoles: [UserRole.ADMIN],
      },
    ],
  },
  {
    name: "Academics",
    href: "#",
    icon: GraduationCap,
    current: false,
    requiredRoles: [UserRole.ADMIN],
    children: [
      {
        name: "Programs",
        href: "/programs",
        icon: AcademicCapIcon,
        current: false,
        requiredRoles: [UserRole.ADMIN],
      },
      {
        name: "Courses",
        href: "/courses",
        icon: BookIcon,
        current: false,
        requiredRoles: [UserRole.ADMIN],
      },
      {
        name: "Course Buckets",
        href: "/course-buckets",
        icon: ClipboardDocumentListIcon,
        current: false,
        requiredRoles: [UserRole.ADMIN],
      },
      {
        name: "Subjects",
        href: "/subjects",
        icon: BookOpenIcon,
        current: false,
        requiredRoles: [UserRole.ADMIN],
      },
      {
        name: "Subject Types",
        href: "/subject-types",
        icon: BookOpenIcon,
      },
    ],
  },
];

const userNavigation = [
  { name: "Your profile", href: "/profile" },
  { name: " Password", href: "/settings" },
  { name: "Sign out", href: "/login" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// Function to get user's first letter and background color
const getUserInitials = (firstName?: string, lastName?: string) => {
  if (!firstName && !lastName) return 'U';
  
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
  
  return firstInitial ;
};

// Function to generate consistent background color based on user's name
const getAvatarColor = (firstName?: string, lastName?: string) => {
  const name = (firstName || '') + (lastName || '');
  if (!name) return 'bg-gray-500';
  
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
    'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500',
    'bg-cyan-500', 'bg-amber-500'
  ];
  
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const SidebarDisclosure = ({
  item,
  isOpen,
  onToggle,
  location,
  hasRequiredRole,
  isMobile = false,
  onMobileItemClick,
}: {
  item: any;
  isOpen: boolean;
  onToggle: () => void;
  location: any;
  hasRequiredRole: (roles: UserRole[]) => boolean;
  isMobile?: boolean;
  onMobileItemClick?: () => void;
}) => {
  return (
    <div className="space-y-1">
      <button
        type="button"
        className={classNames(
          "flex w-full justify-between text-white font-semibold p-2 rounded-lg transition-all duration-200",
          "hover:bg-white/10 active:bg-white/20",
          isOpen ? "bg-white/10" : "",
          isMobile ? "text-base" : "text-sm"
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }}
      >
        <div className="flex items-center gap-3">
          <item.icon className="h-5 w-5" />
          {item.name}
        </div>
        <ChevronDownIcon
          className={classNames(
            "h-5 w-5 transition-transform duration-300",
            isOpen ? "rotate-180 transform" : "",
          )}
        />
      </button>
      <div
        className={classNames(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className={classNames("space-y-1 mt-2", isMobile ? "ml-2" : "ml-4")}>
          {item.children.map(
            (child: any) =>
              hasRequiredRole(child.requiredRoles) && (
                <li key={child.name}>
                  <Link
                    to={child.href}
                    onClick={onMobileItemClick}
                    className={classNames(
                      location.pathname === child.href
                        ? "bg-white/20 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white",
                      "group flex gap-x-3 rounded-lg p-2 font-medium transition-all duration-200",
                      isMobile ? "text-base" : "text-sm"
                    )}
                  >
                    <child.icon
                      className={classNames(
                        "h-5 w-5 transition-colors duration-200",
                        location.pathname === child.href
                          ? "text-white"
                          : "text-white/70 group-hover:text-white",
                      )}
                    />
                    {child.name}
                  </Link>
                </li>
              ),
          )}
        </div>
      </div>
    </div>
  );
};

const MobileNavigationItem = ({ 
  item, 
  location, 
  hasRequiredRole,
  onItemClick 
}: { 
  item: any; 
  location: any; 
  hasRequiredRole: any;
  onItemClick: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (item.children) {
    return (
      <SidebarDisclosure
        item={item}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        location={location}
        hasRequiredRole={hasRequiredRole}
        isMobile={true}
        onMobileItemClick={onItemClick}
      />
    );
  }

  return (
    <li>
      <Link
        to={item.href}
        onClick={onItemClick}
        className={classNames(
          location.pathname === item.href
            ? "bg-white/20 text-white"
            : "text-white/70 hover:bg-white/10 hover:text-white",
          "group flex gap-x-3 rounded-lg p-2 text-base font-medium transition-all duration-200"
        )}
      >
        <item.icon
          className={classNames(
            "h-5 w-5 transition-colors duration-200",
            location.pathname === item.href
              ? "text-white"
              : "text-white/70 group-hover:text-white",
          )}
        />
        {item.name}
      </Link>
    </li>
  );
};

export default function MainLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // Initialize all sections as open by default
  const defaultSections = navigation.reduce((acc, item) => {
    if (item.children) {
      acc[item.name] = true;
    }
    return acc;
  }, {} as Record<string, boolean>);

  const [activeSections, setActiveSections] = useState(defaultSections);

  const toggleSection = (sectionName: string) => {
    setActiveSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const hasRequiredRole = (requiredRoles?: UserRole[]) => {
    if (!requiredRoles) return true;
    return requiredRoles.some((role) => user?.role === role);
  };

  // Get user initials and avatar color
  const userInitials = getUserInitials(user?.firstName, user?.lastName);
  const avatarColor = getAvatarColor(user?.firstName, user?.lastName);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleMobileItemClick = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <div>
        {/* Mobile Sidebar */}
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
              
              {/* Mobile Sidebar Content */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-muj-orange z-50">
                <div className="flex h-16 shrink-0 items-center justify-between px-6">
                  <img
                    alt="MUJ"
                    src="/MUJ_logo.png"
                    className="h-8 w-auto"
                  />
                  <div className="text-white font-semibold text-lg">
                    MUJ Portal
                  </div>
                </div>
                
                {/* User Info in Mobile Sidebar */}
                <div className="px-6 pb-4 border-b border-white/20">
                  <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold text-lg`}>
                      {userInitials}
                    </div>
                    <div className="text-white">
                      <div className="font-semibold">
                        {user ? `${user.firstName} ${user.lastName}` : <Skeleton width={120} />}
                      </div>
                      <div className="text-sm text-white/80">
                        {user?.role || <Skeleton width={80} />}
                      </div>
                    </div>
                  </div>
                </div>

                <nav className="flex flex-1 flex-col px-6">
                  <ul role="list" className="flex flex-1 flex-col gap-y-4">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map(
                          (item) =>
                            hasRequiredRole(item.requiredRoles) && (
                              <MobileNavigationItem 
                                key={item.name} 
                                item={item} 
                                location={location} 
                                hasRequiredRole={hasRequiredRole}
                                onItemClick={handleMobileItemClick}
                              />
                            ),
                        )}
                      </ul>
                    </li>
                    
                    {/* Mobile Settings and Logout */}
                    <li className="mt-auto space-y-2 pb-8">
                      <Link
                        to="/settings"
                        onClick={handleMobileItemClick}
                        className="group flex gap-x-3 rounded-lg p-2 text-base font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
                      >
                        <Cog6ToothIcon className="h-5 w-5" />
                        Change Password
                      </Link>
                      <Link
                        to="/login"
                        onClick={handleMobileItemClick}
                        className="group flex gap-x-3 rounded-lg p-2 text-base font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
                      >
                        <XMarkIcon className="h-5 w-5" />
                        Sign Out
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Desktop Sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-72 lg:flex-col bg-muj-orange">
          <div className="flex flex-col h-full border-r border-white/10">
            {/* Sticky Logo */}
            <div className="sticky top-0 bg-muj-orange px-6 pt-4 z-0">
              <div className="flex h-20 items-center justify-center bg-white rounded-lg shadow-sm p-4 z-0">
                <img alt="MUJ" src="/MUJ_logo.png" className="w-max" />
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 px-6 overflow-y-auto scrollbar-hide z-10">
              <nav className="py-4">
                <ul role="list" className="space-y-2" key="sidebar-navigation">
                  {navigation.map(
                    (item) =>
                      hasRequiredRole(item.requiredRoles) && (
                        <li key={item.name}>
                          {item.children ? (
                            <SidebarDisclosure
                              item={item}
                              isOpen={!!activeSections[item.name]}
                              onToggle={() => toggleSection(item.name)}
                              location={location}
                              hasRequiredRole={hasRequiredRole}
                            />
                          ) : (
                            <Link
                              to={item.href}
                              className={classNames(
                                location.pathname === item.href
                                  ? "bg-white/20 text-white"
                                  : "text-white/70 hover:bg-white/10 hover:text-white",
                                "group flex gap-x-3 rounded-lg p-2 text-sm font-medium transition-all duration-200",
                              )}
                            >
                              <item.icon
                                className={classNames(
                                  "h-5 w-5 transition-colors duration-200",
                                  location.pathname === item.href
                                    ? "text-white"
                                    : "text-white/70 group-hover:text-white",
                                )}
                              />
                              {item.name}
                            </Link>
                          )}
                        </li>
                      ),
                  )}
                </ul>
              </nav>
            </div>

            {/* Sticky Settings */}
            <div className="sticky bottom-0 bg-muj-orange px-6 py-4 border-t border-white/10">
              <Link
                to="/settings"
                className="group flex gap-x-3 rounded-lg p-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                <Cog6ToothIcon className="h-5 w-5 transition-colors duration-200 text-white/70 group-hover:text-white" />
                Change Password
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:pl-72">
          {/* Top Navigation Bar */}
          <div className="sticky top-0 z-30 bg-white shadow-sm lg:shadow-none">
            <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 sm:gap-x-6 sm:px-6 lg:px-8">
              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              <div
                aria-hidden="true"
                className="h-6 w-px bg-gray-200 lg:hidden"
              />

              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                {/* Welcome message - hidden on small mobile, visible on medium+ */}
                <div className="hidden sm:flex text-lg md:text-xl mt-4 flex-grow gap-2">
                  <span className="font-light">Welcome back,</span>
                  <span className="font-semibold">
                    {user ? `${user.firstName} ${user.lastName}` : <Skeleton width={100} />}
                  </span>
                </div>

                {/* Mobile page title */}
                <div className="sm:hidden flex items-center">
                  <span className="font-semibold text-gray-900 text-lg">
                    {navigation.find(item => item.href === location.pathname)?.name || 
                     navigation.flatMap(item => item.children || []).find(child => child.href === location.pathname)?.name ||
                     "MUJ Portal"}
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

                  <div
                    aria-hidden="true"
                    className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
                  />

                  {/* User menu */}
                  <Menu as="div" className="relative">
                    <MenuButton className="-m-1.5 flex items-center p-1.5">
                      <span className="sr-only">Open user menu</span>
                      <div className={`size-8 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold text-sm`}>
                        {userInitials}
                      </div>
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

          {/* Main Content */}
          <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}