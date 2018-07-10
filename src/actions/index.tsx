const setUser = (user: { sei: string, mei: string }) => ({
  type: "SET_USER",
  user: user,
});