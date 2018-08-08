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

  return await fetch(`${apiUrl}/api/parameter/${parameterType}`, { last_name: sei, first_name: mei });
};

export const requestUser = (sei: string, mei: string): ThunkAction<Promise<void>, {}, {}> => (
  async (dispatch, getState) => {
    const parameterType = 1;//getState().parameterType;
    const parameters = await fetchParameters(sei, mei, parameterType);

    dispatch(setUser({ sei: sei, mei: mei }));
    dispatch(setParameters(parameters));
  }
);

/*
export const fetchCommunities = (): ThunkAction<Promise<void>, {}, {}> =>
  async (dispatch) => {
    const { data: { communities } } = await (
      await PortalApi.community.listCommunities()
    ).json();

    dispatch(setCommunities(
      (communities as any[]).map((community) => new Community(community)),
    ));
  };
  */