import { loginSuccess, logout, selectAuthUser, selectIsAuthenticated } from "@/features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function useAuth() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectAuthUser);

  return {
    isAuthenticated,
    user,
    login: (email: string) => {
      const name = email.split("@")[0] ?? "User";
      dispatch(
        loginSuccess({
          user: { email, name: name.charAt(0).toUpperCase() + name.slice(1) },
          token: `mock_${Date.now()}`,
        }),
      );
    },
    logout: () => dispatch(logout()),
  };
}
