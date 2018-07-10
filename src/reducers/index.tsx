import { Action, Reducer } from "redux";
import { Record } from "immutable";

export interface User {
  sei: string;
  mei: string;
}

export interface UserAction {
  type: string;
  user: User;
}

export interface IState {
  user?: User;
}

export const RState = Record<IState>({
  user: null,
});

export class State extends RState {
}

const reducer: Reducer<State> = (
  state: State = new State(),
  action: Action,
) => {
  switch (action.type) {
    case "SET_USER":
      return (state: State, action: UserAction): State => (state.set("user", action.user))(state, action);

    default:
      return state;
  }
};

export default reducer;
