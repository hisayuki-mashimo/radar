import { Action } from "redux";
import { ThunkAction } from "redux-thunk";

export const setUser = (user: { sei: string, mei: string }): Action => ({
  type: "SET_USER",
  user,
});

export const setParameters = (parameters: Array<number>): Action => ({
  type: "SET_PARAMETERS",
  parameters,
});

export const fetchParameters = async (sei: string, mei: string, parameterType: number) => {
  const apiUrl = "http://localhost:3000";

  console.log(JSON.stringify({ parameter_type: parameterType, last_name: sei, first_name: mei }));
  return await fetch(
    //`${apiUrl}/api/parameter/${parameterType}`,
    `${apiUrl}/api/parameter`,
    {
      mode: "cors",
      method: "POST",
      //method: "GET",
      headers: {
        //"Content-Type": "application/json",
        //"X-Requested-With": "XMLHttpRequest",
        "content-type": 'application/json',
        //"x-requested-with": "XMLHttpRequest",
      },
      //body: JSON.stringify({ last_name: sei, first_name: mei }),
      body: JSON.stringify({ parameter_type: parameterType, last_name: sei, first_name: mei }),
      credentials: "include",
    },
  );
};

export const requestUser = (sei: string, mei: string): ThunkAction<Promise<void>, {}, {}> => (
  async (dispatch, getState) => {
    const parameterType = 1;//getState().parameterType;
    const response = await fetchParameters(sei, mei, parameterType);
    const parameters = await response.json();

    dispatch(setUser({ sei, mei }));
    dispatch(setParameters(parameters));
  }
);
