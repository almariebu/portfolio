"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { roles, type RoleId } from "@/lib/content";

type RoleContextValue = {
  role: RoleId | null;
  setRole: (role: RoleId | null) => void;
  selectRole: (role: RoleId) => void;
};

const RoleContext = createContext<RoleContextValue | null>(null);

function isRoleId(value: string | null): value is RoleId {
  return value !== null && (roles as string[]).includes(value);
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const role = useMemo(() => {
    const path = searchParams.get("path");
    return isRoleId(path) ? path : null;
  }, [searchParams]);

  const setRole = useCallback(
    (next: RoleId | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next) {
        params.set("path", next);
      } else {
        params.delete("path");
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const selectRole = useCallback(
    (next: RoleId) => {
      setRole(role === next ? null : next);
    },
    [role, setRole],
  );

  const value = useMemo(
    () => ({ role, setRole, selectRole }),
    [role, setRole, selectRole],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    throw new Error("useRole must be used within RoleProvider");
  }
  return ctx;
}
