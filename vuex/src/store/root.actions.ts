import {
  RootState,
  SetAuth,
} from "./root.models";
import { DefineActionTree, DefineTypes } from "./store.helpers";
import { rootMutationsTypes } from "./root.mutations";

import ApiService from "../common/services/api.service";
import { destroyToken, saveToken } from "../common/jwt.service";

export interface RootActions {
  setAuth: SetAuth;
  autoAuth: void;
  purgeAuth: void;
}

const actions: DefineActionTree<RootActions, RootState> = {
  setAuth({ commit }, { payload }) {
    if (!payload.code) {
      ApiService.post("auth/login", payload)
        .then(({ data }) => {
          saveToken(data.accessToken);
          commit(rootMutationsTypes.setCurrentUser(data));
          payload.changeScreen();
        })
        .catch(err => {
          payload.showErrors(err.response.data.error);
        })
    } else {
      ApiService.post("auth/register", payload)
        .then(({ data }) => {
          saveToken(data.accessToken);
          commit(rootMutationsTypes.setCurrentUser(data));
          ApiService.setHeader();
          ApiService.put(`/code/asign/${payload.code?.join('')}`, {})
            .then(res => payload.changeScreen())
            .catch(err => payload.showErrors(err.response.data.error))
        })
        .catch(err => payload.showErrors(err.response.data.error))
    }
  },

  autoAuth({ commit }) {
    ApiService.setHeader();
    ApiService.get("auth/login")
      .then(({ data }) => {
        saveToken(data.accessToken);
        commit(rootMutationsTypes.setCurrentUser(data));
      })
      .catch(err => console.error(err));
  },

  purgeAuth({ commit }) {
    destroyToken();
    commit(rootMutationsTypes.purgeCurrentUser());
  },
};

export const rootActionsTypes: DefineTypes<RootActions> = {
  setAuth: payload => ({ type: "setAuth", payload }),
  purgeAuth: payload => ({ type: "purgeAuth", payload }),
  autoAuth: payload => ({ type: "autoAuth", payload }),
};

export default actions;
