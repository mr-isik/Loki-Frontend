"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaces } from "@/features/workspace/hooks/useQueries";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function WorkspaceHandler({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: workspaces, isLoading } = useWorkspaces();

  useEffect(() => {
    if (pathname === "/create-workspace") return;

    if (!isLoading && workspaces && workspaces.length === 0) {
      router.push("/create-workspace");
    }
  }, [workspaces, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex-1 w-full flex flex-col">
        <div className="h-14 border-b px-4 flex items-center gap-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-32 ml-auto" />
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  if (
    pathname === "/create-workspace" ||
    (workspaces && workspaces.length > 0)
  ) {
    return <>{children}</>;
  }

  return null;
}
