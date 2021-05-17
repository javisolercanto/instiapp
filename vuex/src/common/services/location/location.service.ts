import Vue from "vue";

const modelUrl = 'location';

const LocationService = {
    get(locationId) {
      return Vue.axios.get(`${modelUrl}/?${locationId}`).catch(error => {
        throw new Error(`[RWV] Location ${error}`);
      });
    },
  
    list() {
      return Vue.axios.get(`${modelUrl}/find`).catch(error => {
        throw new Error(`[RWV] Location ${error}`);
      });
    },
  
    create(location) {
      return Vue.axios.post(`${modelUrl}`, location);
    },
  
    update(locationId, location) {
      return Vue.axios.put(`${modelUrl}/${locationId}/`, location);
    },
  
    delete(locationId) {
      return Vue.axios.delete(`${modelUrl}/${locationId}`).catch(error => {
        throw new Error(`[RWV] Location ${error}`);
      });
    }
  };
  
export default LocationService;  