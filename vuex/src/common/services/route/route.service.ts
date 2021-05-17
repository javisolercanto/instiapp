import Vue from "vue";
import { store } from "../../../store";
import ApiService from "../api.service";

const modelUrl = 'route';

const RouteService = {
    get(routeId) {
      return Vue.axios.get(`${modelUrl}/${routeId}`).catch(error => {
        throw new Error(`[RWV] Route ${error}`);
      });
    },

    getByAuthor() {
      return Vue.axios.get(`${modelUrl}/list/?${ApiService.filterToParams({owner: store.getters.currentUser.id})}`)
        .catch(error => {
        throw new Error(`[RWV] Route ${error}`);
      });
    },
  
    list(filters) {
      return Vue.axios.get(`${modelUrl}/list/?${ApiService.filterToParams(filters)}`).catch(error => {
        throw new Error(`[RWV] Route ${error}`);
      });
    },
  
    create(route) {
      return Vue.axios.post(`${modelUrl}`, route);
    },
  
    update(routeId, route) {
      return Vue.axios.put(`${modelUrl}/${routeId}`, route);
    },

    delete(routeId) {
      return Vue.axios.delete(`${modelUrl}/${routeId}`).catch(error => {
        throw new Error(`[RWV] Route ${error}`);
      });
    }
  };
  
export default RouteService;  