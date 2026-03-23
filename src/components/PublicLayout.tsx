"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import type { ReactNode } from "react";

export function PublicLayout({
  children,
  footer,
  applyOpen,
  applyDeadline,
}: {
  children: ReactNode;
  footer: ReactNode;
  applyOpen: boolean;
  applyDeadline: string;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar applyOpen={applyOpen} applyDeadline={applyDeadline} />}
      <main className="flex-1">{children}</main>
      {!isAdmin && footer}
    </>
  );
}

