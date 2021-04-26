import { initialRootState, RootState } from "./root.models";
import { DefineMutationTree, DefineTypes } from "./store.helpers";

export interface RootMutations {
  toggleLoading: RootState["isLoading"];
  setCurrentUser: RootState["currentUser"];
  purgeCurrentUser: void;
}

const mutations: DefineMutationTree<RootMutations, RootState> = {
  toggleLoading(state, { payload }) {
    state.isLoading = payload;
  },
  setCurrentUser(state, { payload }) {
    state.currentUser = {
      id: payload.id,
      name: payload.name,
      username: payload.username,
      password: "",
      email: payload.email,
      image: payload.image,
      isAuthed: true,
      admin: payload.admin,
    }
  },
  purgeCurrentUser(state) {
    state.currentUser = {
      id: 0,
      name: "",
      username: "",
      password: "",
      email: "",
      image: "",
      isAuthed: false,
      admin: false,
    }
  },
};

export const rootMutationsTypes: DefineTypes<RootMutations> = {
  toggleLoading: payload => ({ type: "toggleLoading", payload }),
  setCurrentUser: payload => ({ type: "setCurrentUser", payload }),
  purgeCurrentUser: payload => ({ type: "purgeCurrentUser", payload })
};

export default mutations;
