import { Action } from "redux";
import { ThunkAction } from "redux-thunk";

export const setUser = (user: { sei: string, mei: string }): Action => ({
  type: "SET_USER",
  user,
});

export const setParameterType = (parameterType: number): Action => ({
  type: "SET_PARAMETER_TYPE",
  parameterType,
});

export const setParameters = (parameters: Array<number>): Action => ({
  type: "SET_PARAMETERS",
  parameters,
});

export const resetParameters = (parameterType: number, parameters: Array<number>): Action => ({
  type: "RESET_PARAMETERS",
  parameterType,
  parameters,
});

export const fetchParameters = async (sei: string, mei: string, parameterType: number) => {
  const apiUrl = "http://localhost:3000";

  return await fetch(
    `${apiUrl}/api/parameter`,
    {
      mode: "cors",
      method: "POST",
      headers: {
        //"Content-Type": "application/json",
        "Content-Type": "application/x-www-form-urlencoded;application/json;charset=utf-8",
        //"X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({ parameter_type: parameterType, last_name: sei, first_name: mei }),
      credentials: "include",
    },
  );
};

export const setDistanceSwitch = (distanceSwitch: boolean): Action => ({
  type: "SET_DISTANCE_SWITCH",
  distanceSwitch,
});

export const requestUser = (sei: string, mei: string): ThunkAction<Promise<void>, {}, {}> => (
  async (dispatch, getState) => {
    const parameterType = getState().parameterType;
    const response = await fetchParameters(sei, mei, parameterType);
    const parameters = await response.json();

    dispatch(setUser({ sei, mei }));
    dispatch(setParameters(parameters));
  }
);

export const requestParameterType = (parameterType): ThunkAction<Promise<void>, {}, {}> => (
  async (dispatch, getState) => {
    const user = getState().user;
    let parameters = [];

    if (user.sei || user.mei) {
      const response = await fetchParameters(user.sei, user.mei, parameterType);
      parameters = await response.json();
    } else {
      let parameterCount = 0;

      switch (parameterType) {
        case 4:
          parameterCount = 4;
          break;

        case 6:
          parameterCount = 8;
          break;

        case 8:
          parameterCount = 6;
          break;

        case 12:
          parameterCount = 20;
          break;

        case 20:
          parameterCount = 12;
          break;
      }

      for (let i = 0; i < parameterCount; i ++) {
        parameters.push(0);
      }
    }

    dispatch(resetParameters(
      parameterType,
      parameters,
    ));
  }
);
