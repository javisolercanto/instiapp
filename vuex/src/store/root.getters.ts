import { DefineGetterTree } from "./store.helpers";
import { RootState } from "./root.models";

export interface RootGetters {
  currentUser: RootState["currentUser"];
  errors: RootState["errors"];
}

const getters: DefineGetterTree<RootGetters, RootState> = {
  currentUser: state => state.currentUser,
  errors: state => state.errors
};

export default getters;
