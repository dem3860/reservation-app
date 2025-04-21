"use client";

import SideNav from "@/components/ui/SideNav";
import { useUserGuard } from "@/features/user/hooks/useUserGurd";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthorized = useUserGuard();

  if (!isAuthorized) {
    return null;
  }
  return (
    <div className="bg-white flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
