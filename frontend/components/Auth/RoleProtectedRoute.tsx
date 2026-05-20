import { FC, ReactNode } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const RoleProtectedRoute: FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
  const router = useRouter();
  const { user } = useAuth();

  const userRoles = user?.roles?.map((r) => r.roleName) || [];

  const isAllowed = allowedRoles.some(role =>
    userRoles.includes(role)
  );

  if (!user || !isAllowed) {
    router.push("/");
    return null;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
