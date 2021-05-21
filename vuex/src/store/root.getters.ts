import { DefineGetterTree } from "./store.helpers";
import { RootState } from "./root.models";

export interface RootGetters {
  currentUser: RootState["currentUser"];
}

const getters: DefineGetterTree<RootGetters, RootState> = {
  currentUser: state => state.currentUser,
};

export default getters;
