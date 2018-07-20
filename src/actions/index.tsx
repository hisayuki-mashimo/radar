import { Action } from "redux";

const setUser = (user: { sei: string, mei: string }): Action => ({
  type: "SET_USER",
  user,
});