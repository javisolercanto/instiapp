import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import { API_URL } from "../../config";
import { getToken } from "../../jwt.service";
import ApiService from "../api.service";

const modelUrl = 'category';

const CategoryService = {
    init() {
      Vue.use(VueAxios, axios);
      Vue.axios.defaults.baseURL = API_URL;
    },
  
    setHeader() {
      Vue.axios.defaults.headers.common["x-access-token"] = `${getToken()}`;
    },
  
    query(resource, params) {
      return Vue.axios.get(resource, params).catch(error => {
        throw new Error(`[RWV] ApiService ${error}`);
      });
    },

    get(categoryId) {
      return Vue.axios.get(`${modelUrl}/?${categoryId}`).catch(error => {
        throw new Error(`[RWV] Category ${error}`);
      });
    },
  
    list() {
      return Vue.axios.get(`${modelUrl}/find`).catch(error => {
        throw new Error(`[RWV] Category ${error}`);
      });
    },
  
    create(category) {
      return Vue.axios.post(`${modelUrl}`, category);
    },
  
    update(categoryId, category) {
      return Vue.axios.put(`${modelUrl}/${categoryId}/`, category);
    },
  
    edit(categoryId, category) {
      return Vue.axios.put(`${modelUrl}/${categoryId}`, category);
    },
  
    delete(categoryId) {
      return Vue.axios.delete(`${modelUrl}/${categoryId}`).catch(error => {
        throw new Error(`[RWV] Category ${error}`);
      });
    }
  };
  
export default CategoryService;  