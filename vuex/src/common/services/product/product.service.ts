import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import { API_URL } from "../../config";
import { getToken } from "../../jwt.service";
import ApiService from "../api.service";

const modelUrl = 'product';

const ProductService = {
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

    get(productId) {
      return Vue.axios.get(`${modelUrl}/${productId}`).catch(error => {
        throw new Error(`[RWV] Product ${error}`);
      });
    },
  
    list(filters) {
      return Vue.axios.get(`${modelUrl}/list/?${ApiService.filterToParams(filters)}`).catch(error => {
        throw new Error(`[RWV] Product ${error}`);
      });
    },
  
    create(product) {
      return Vue.axios.post(`${modelUrl}`, product);
    },
  
    update(productId, product) {
      return Vue.axios.put(`${modelUrl}/${productId}`, product);
    },
  
    edit(productId, product) {
      return Vue.axios.put(`${modelUrl}/${productId}`, product);
    },
  
    delete(productId) {
      return Vue.axios.delete(`${modelUrl}/${productId}`).catch(error => {
        throw new Error(`[RWV] Product ${error}`);
      });
    }
  };
  
export default ProductService;  