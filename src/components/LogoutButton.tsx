"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  className?: string;
  iconOnly?: boolean;
}

export function LogoutButton({ className, iconOnly }: LogoutButtonProps) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className={className ?? "flex items-center gap-1.5 text-sm text-zinc-400 hover:text-red-400 transition-colors"}
    >
      <LogOut size={14} />
      {!iconOnly && "로그아웃"}
    </button>
  );
}
