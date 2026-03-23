"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import type { ReactNode } from "react";

export function PublicLayout({
  children,
  footer,
  applyEnabled,
  applyDeadline,
}: {
  children: ReactNode;
  footer: ReactNode;
  applyEnabled: boolean;
  applyDeadline: string;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar applyEnabled={applyEnabled} applyDeadline={applyDeadline} />}
      <main className="flex-1">{children}</main>
      {!isAdmin && footer}
    </>
  );
}

