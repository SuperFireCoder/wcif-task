export const isUserLoggedIn = (): boolean => {
  if (typeof window !== "undefined") {
    const session = localStorage.getItem("session");
    if (session) {
      const { timestamp } = JSON.parse(session);
      // Check if the session is still valid (3 hours)
      if (new Date().getTime() - timestamp < 3 * 60 * 60 * 1000) {
        return true;
      } else {
        localStorage.removeItem("session"); // Remove expired session
      }
    }
  }
  return false;
};
