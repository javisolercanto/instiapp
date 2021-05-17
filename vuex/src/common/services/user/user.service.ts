import Vue from "vue";
import { store } from "../../../store";
import ApiService from "../api.service";

const modelUrl = 'user';

const UserService = {
    get(userId) {
      return Vue.axios.get(`${modelUrl}/${userId}`).catch(error => {
        throw new Error(`[RWV] User ${error}`);
      });
    },

    getByAuthor() {
      return Vue.axios.get(`${modelUrl}/list/?${ApiService.filterToParams({owner: store.getters.currentUser.id})}`)
        .catch(error => {
        throw new Error(`[RWV] User ${error}`);
      });
    },
  
    list(filters) {
      return Vue.axios.get(`${modelUrl}/list/?${ApiService.filterToParams(filters)}`).catch(error => {
        throw new Error(`[RWV] User ${error}`);
      });
    },
  
    create(user) {
      return Vue.axios.post(`${modelUrl}`, user);
    },
  
    update(user) {
      return Vue.axios.put(`${modelUrl}`, user);
    },

    delete(userId) {
      return Vue.axios.delete(`${modelUrl}/${userId}`).catch(error => {
        throw new Error(`[RWV] User ${error}`);
      });
    }
  };
  
export default UserService;  