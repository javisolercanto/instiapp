import Vue from "vue";
import ApiService from "../api.service";
import store from "../../../store";

const modelUrl = 'product';

const ProductService = {
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

    getByAuthor() {
      return Vue.axios.get(`${modelUrl}/list/?${ApiService.filterToParams({owner: store.getters.currentUser.id})}`)
        .catch(error => {
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
  
    delete(productId) {
      return Vue.axios.delete(`${modelUrl}/${productId}`).catch(error => {
        throw new Error(`[RWV] Product ${error}`);
      });
    }
  };
  
export default ProductService;  