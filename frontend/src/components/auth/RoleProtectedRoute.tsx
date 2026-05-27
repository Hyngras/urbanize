"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { DemandRole } from "@/types/user";
import { Spinner, Center } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
  allowedRoles: DemandRole[];
  redirectTo?: string;
}

export function RoleProtectedRoute({ children, allowedRoles, redirectTo }: Props) {
  const { user, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      const defaultRedirect = user.role === "gestor" ? "/gestor" : "/dashboard";
      router.push(redirectTo || defaultRedirect);
    }
  }, [user, loading, allowedRoles, redirectTo, router]);

  if (loading || !user) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
