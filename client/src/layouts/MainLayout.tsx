import TopBar from "../components/TopBar.tsx";
import { ReactNode } from "react";
import Sidebar from "../components/Sidebar.tsx";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className={"w-full h-full"}>
      <div className={"flex flex-row"}>
        <div className={"w-80 hidden md:block"}>
          <Sidebar />
        </div>
        <div className={"w-full"}>
          <TopBar />

          {children}
        </div>
      </div>
    </div>
  );
}
