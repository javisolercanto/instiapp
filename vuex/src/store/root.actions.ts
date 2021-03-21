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

    if (payload.isLogin) {
      ApiService.post("users/login", { user: payload })
        .then(({ data }) => {
          saveToken(data.user.token);
          commit(rootMutationsTypes.setCurrentUser(data.user));
          payload.changeScreen();
        })
        .catch(err => {
          let errors = "";
          for (var i in err.response.data.user) {
            errors += `${i}: ${err.response.data.user[i]}`;
          }
          payload.showErrors(errors);
        })
        .finally(() => {
          commit(rootMutationsTypes.toggleLoading(false));
        });
    } else {
      ApiService.post("users/", { user: payload })
        .then(({ data }) => {
          saveToken(data.user.token);
          commit(rootMutationsTypes.setCurrentUser(data.user));
          payload.changeScreen();
        })
        .catch(err => {
          let errors = "";
          for (var i in err.response.data.user) {
            errors += `${i}: ${err.response.data.user[i]}`;
          }
          payload.showErrors(errors);
        })
        .finally(() => {
          commit(rootMutationsTypes.toggleLoading(true));
        });
    }
  },

  autoAuth({ commit }) {
    ApiService.setHeader();
    ApiService.get("user")
      .then(({ data }) => {
        saveToken(data.user.token);
        commit(rootMutationsTypes.setCurrentUser(data.user));
      })
      .catch(err => {
        console.log("ERROR IN ACTION");
        console.log(err);
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
