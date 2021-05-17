import Vue from "vue";

const modelUrl = 'category';

const CategoryService = {
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
  
    delete(categoryId) {
      return Vue.axios.delete(`${modelUrl}/${categoryId}`).catch(error => {
        throw new Error(`[RWV] Category ${error}`);
      });
    }
  };
  
export default CategoryService;  