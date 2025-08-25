export const auth = {
  // PUBLIC_INTERFACE
  isLoggedIn(): boolean {
    /** Returns if a token exists */
    return (
      typeof window !== "undefined" &&
      typeof localStorage !== "undefined" &&
      !!localStorage.getItem("auth_token")
    );
  },
};
