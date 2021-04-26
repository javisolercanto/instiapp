import {
  RootState,
  SetAuth,
  ToggleLoading,
  ListProducts
} from "./root.models";
import { DefineActionTree, DefineTypes } from "./store.helpers";
import { rootMutationsTypes } from "./root.mutations";

import ApiService from "../common/api.service";
import { destroyToken, saveToken } from "../common/jwt.service";

export interface RootActions {
  toggleLoading: ToggleLoading;
  setAuth: SetAuth;
  autoAuth: void;
  purgeAuth: void;
  listProducts: ListProducts;
}

const actions: DefineActionTree<RootActions, RootState> = {
  toggleLoading({ commit }) {
    commit(rootMutationsTypes.toggleLoading(!this.getters.isLoading));
  },

  setAuth({ commit }, { payload }) {
    commit(rootMutationsTypes.toggleLoading(true));

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
        .finally(() => {
          commit(rootMutationsTypes.toggleLoading(false));
        });
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
        .finally(() => {
          commit(rootMutationsTypes.toggleLoading(true));
        });
    }
  },

  autoAuth({ commit }) {
    ApiService.setHeader();
    ApiService.get("auth/login")
      .then(({ data }) => {
        saveToken(data.accessToken);
        commit(rootMutationsTypes.setCurrentUser(data));
      })
      .catch(err => {
        console.log(err.response.data.error);
      });
  },

  purgeAuth({ commit }) {
    destroyToken();
    commit(rootMutationsTypes.purgeCurrentUser());
  },

  listProducts({ commit }, { payload }) {

  }
};

export const rootActionsTypes: DefineTypes<RootActions> = {
  toggleLoading: payload => ({ type: "toggleLoading", payload }),
  setAuth: payload => ({ type: "setAuth", payload }),
  purgeAuth: payload => ({ type: "purgeAuth", payload }),
  autoAuth: payload => ({ type: "autoAuth", payload }),
  listProducts: payload => ({ type: "listProducts", payload })
};

export default actions;
