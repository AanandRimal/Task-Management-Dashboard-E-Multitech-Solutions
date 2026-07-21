import { describe, expect, it } from "vitest";
import { authReducer, loginSuccess, logout } from "@/features/auth/auth.slice";

describe("auth.slice", () => {
  it("stores user on login and clears on logout", () => {
    let state = authReducer(undefined, { type: "init" });
    state = authReducer(
      state,
      loginSuccess({
        user: { email: "dev@example.com", name: "Dev" },
        token: "mock_token",
      }),
    );
    expect(state.token).toBe("mock_token");
    state = authReducer(state, logout());
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });
});
