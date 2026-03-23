"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import type { ReactNode } from "react";

export function PublicLayout({
  children,
  footer,
  applyDeadline,
}: {
  children: ReactNode;
  footer: ReactNode;
  applyDeadline: string;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar applyDeadline={applyDeadline} />}
      <main className="flex-1">{children}</main>
      {!isAdmin && footer}
    </>
  );
}

