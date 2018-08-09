import { Action, Reducer } from "redux";
import { Record } from "immutable";
import CybozuLabs from "models/CybozuLabs";

export interface User {
  sei: string;
  mei: string;
}

export interface UserAction {
  type: string;
  user: User;
}

/*
export interface IState {
  user: User | null;
}

export const RState = Record<IState>({
  user: null,
});
*/
export const RState = Record({
  user: {
    sei: "",
    mei: "",
  },
  parameterType: 8,
  parameters: [0, 0, 0, 0, 0, 0],
});

export class State extends RState {
}

const reducer: Reducer<State> = (
  state: State = new State(),
  action: Action,
) => {
  let parameters = [];

  switch (action.type) {
    case "SET_USER":
      return state.set("user", action.user);
    case "SET_PARAMETER_TYPE":
      return state.set("parameterType", action.parameterType);
    case "SET_PARAMETERS":
      return state.set("parameters", action.parameters);
    case "RESET_PARAMETERS":
      return state.set("parameterType", action.parameterType)
        .set("parameters", action.parameters);
    default:
      return state;
  }
};

export default reducer;
