import { FC, ReactNode, useEffect } from "react";
import { useRouter  } from "next/navigation";
import useAuth from "@/hooks/useAuth";

interface AuthGuardProps {
  children: ReactNode;
  redirectIfAuthenticated?: boolean;
  redirectPath?: string;
}

const AuthGuard: FC<AuthGuardProps> = ({ children, redirectIfAuthenticated = false, redirectPath = "/" }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect logged-in users
    if (redirectIfAuthenticated && user) {
      router.replace(redirectPath);
    }

    // Redirect unauthenticated users
    if (!redirectIfAuthenticated && !user) {
      router.replace("/login");
    }
  }, [user, redirectIfAuthenticated, redirectPath, router]);

  if (redirectIfAuthenticated && user) return null;

  if (!redirectIfAuthenticated && !user) return null;

  return <>{children}</>;
};

export default AuthGuard;
