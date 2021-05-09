import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import { API_URL } from "../config";
import { getToken } from "../jwt.service";

const ApiService = {
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

  get(resource) {
    return Vue.axios.get(`${resource}`).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },

  list(resource) {
    return Vue.axios.get(`${resource}`).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },

  post(resource, params) {
    return Vue.axios.post(`${resource}`, params, {headers: {}});
  },

  update(resource, slug, params) {
    return Vue.axios.put(`${resource}/${slug}/`, params);
  },

  put(resource, params) {
    return Vue.axios.put(`${resource}`, params);
  },

  delete(resource) {
    return Vue.axios.delete(resource).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },

  filterToParams(filters) {
    let params = '';
    for (let filter in filters) {
      if (filters[filter] || filters[filter] === 'page')
        params += (params.length > 0 ? '&' : '') + filter + '=' + filters[filter];
    }
    
    return params;
  }
};

export default ApiService;
