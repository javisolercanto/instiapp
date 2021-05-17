import Vue from "vue";
import store from "../../../store";
import ApiService from "../api.service";

const modelUrl = 'rental';

const RentalService = {
    get(rentalId) {
      return Vue.axios.get(`${modelUrl}/${rentalId}`).catch(error => {
        throw new Error(`[RWV] Rental ${error}`);
      });
    },

    getByAuthor() {
      return Vue.axios.get(`${modelUrl}/list/?${ApiService.filterToParams({owner: store.getters.currentUser.id})}`)
        .catch(error => {
        throw new Error(`[RWV] Rental ${error}`);
      });
    },
  
    list(filters) {
      return Vue.axios.get(`${modelUrl}/list/?${ApiService.filterToParams(filters)}`).catch(error => {
        throw new Error(`[RWV] Rental ${error}`);
      });
    },
  
    create(rental) {
      return Vue.axios.post(`${modelUrl}`, rental);
    },
  
    update(rentalId, rental) {
      return Vue.axios.put(`${modelUrl}/${rentalId}`, rental);
    },
  
    delete(rentalId) {
      return Vue.axios.delete(`${modelUrl}/${rentalId}`).catch(error => {
        throw new Error(`[RWV] Rental ${error}`);
      });
    }
  };
  
export default RentalService;  