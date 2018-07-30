import { Action, Reducer } from "redux";
import { Record } from "immutable";
import CybozuLabs from "models/CybozuLabs";

const getParameterCount = (parameterType) => {
  switch (parameterType) {
    case 4:
      return 4;

    case 8:
      return 6;

    case 20:
      return 12;
  }
};

const makeParameters = (parameterType, user) => {
  const parameterCount = getParameterCount(parameterType);

  const { sei, mei } = user;
  const parameters = [];

  if (!sei && !mei) {
    for (let n = 0; n < parameterCount; n++) {
      parameters.push(0);
    }

    return parameters;
  }

  const md5String = CybozuLabs.MD5.calc(sei + '+=+' + mei);
  const strings = md5String.split('');

  for (let i = 0; i < parameterCount; i++) {
    let integer = 1;

    for (let j = 0; j < 2; j++) {
      let n = (i * 2) + j;

      switch (j) {
        case 0:
          switch (true) {
            case (strings[n].match(/[0-9]/) !== null): var unit_integer = parseInt(strings[n]); break;
            case (strings[n].match(/[a-b]/) !== null): var unit_integer = 0; break; // weight: 2
            case (strings[n].match(/[c-d]/) !== null): var unit_integer = 1; break; // weight: 2
            case (strings[n].match(/[e-g]/) !== null): var unit_integer = 2; break; // weight: 3
            case (strings[n].match(/[h-j]/) !== null): var unit_integer = 3; break; // weight: 3
            case (strings[n].match(/[k-m]/) !== null): var unit_integer = 4; break; // weight: 3
            case (strings[n].match(/[n-p]/) !== null): var unit_integer = 5; break; // weight: 3
            case (strings[n].match(/[q-s]/) !== null): var unit_integer = 6; break; // weight: 3
            case (strings[n].match(/[t-v]/) !== null): var unit_integer = 7; break; // weight: 3
            case (strings[n].match(/[w-x]/) !== null): var unit_integer = 8; break; // weight: 2
            case (strings[n].match(/[y-z]/) !== null): var unit_integer = 9; break; // weight: 2
          }

          var coefficient = 1;
          break;

        case 1:
          switch (true) {
            case (strings[n].match(/[0-9]/) !== null): var unit_integer = parseInt(strings[n]); break;
            case (strings[n].match(/a/) !== null): var unit_integer = 0; break; // weight: 1
            case (strings[n].match(/b/) !== null): var unit_integer = 1; break; // weight: 1
            case (strings[n].match(/[c-d]/) !== null): var unit_integer = 2; break; // weight: 2
            case (strings[n].match(/[e-h]/) !== null): var unit_integer = 3; break; // weight: 4
            case (strings[n].match(/[i-m]/) !== null): var unit_integer = 4; break; // weight: 5
            case (strings[n].match(/[n-r]/) !== null): var unit_integer = 5; break; // weight: 5
            case (strings[n].match(/[s-v]/) !== null): var unit_integer = 6; break; // weight: 4
            case (strings[n].match(/[w-x]/) !== null): var unit_integer = 7; break; // weight: 2
            case (strings[n].match(/y/) !== null): var unit_integer = 8; break; // weight: 1
            case (strings[n].match(/z/) !== null): var unit_integer = 9; break; // weight: 1
          }

          var coefficient = 10;
          break;
      }

      integer += unit_integer * coefficient;
    }

    parameters[i] = integer;
  }

  return parameters;
};

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
      parameters = makeParameters(state.parameterType, action.user);

      return state.set("user", action.user)
        .set("parameters", parameters);

    case "SET_PARAMETER_TYPE":
      parameters = makeParameters(action.parameterType, state.user);

      return state.set("parameterType", action.parameterType)
        .set("parameters", parameters);

    default:
      return state;
  }
};

export default reducer;
