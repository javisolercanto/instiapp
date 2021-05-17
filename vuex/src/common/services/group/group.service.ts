import Vue from "vue";
import store from "../../../store";
import ApiService from "../api.service";

const modelUrl = 'group';

const GroupService = {
    get(groupId) {
      return Vue.axios.get(`${modelUrl}/${groupId}`).catch(error => {
        throw new Error(`[RWV] Group ${error}`);
      });
    },

    getByAuthor() {
      return Vue.axios.get(`${modelUrl}/list/?${ApiService.filterToParams({owner: store.getters.currentUser.id})}`)
        .catch(error => {
        throw new Error(`[RWV] Group ${error}`);
      });
    },
  
    list(filters) {
      return Vue.axios.get(`${modelUrl}/list/?${ApiService.filterToParams(filters)}`).catch(error => {
        throw new Error(`[RWV] Group ${error}`);
      });
    },

    getNotifications(groupId) {
      return Vue.axios.get(`${modelUrl}/${groupId}/notifications`).catch(error => {
        throw new Error(`[RWV] Group ${error}`);
      });
    },

    sendRequest(groupId) {
      return Vue.axios.post(`${modelUrl}/${groupId}/request`);
    },

    acceptRequest(groupId, userId) {
      return Vue.axios.put(`${modelUrl}/${groupId}/accept/${userId}`);
    },

    denyRequest(groupId, userId) {
      return Vue.axios.delete(`${modelUrl}/${groupId}/deny/${userId}`);
    },

    removeUser(groupId, userId) {
      return Vue.axios.delete(`${modelUrl}/${groupId}/remove/${userId}`);
    },
  
    create(group) {
      return Vue.axios.post(`${modelUrl}`, group);
    },
  
    update(groupId, group) {
      return Vue.axios.put(`${modelUrl}/${groupId}`, group);
    },
  
    delete(groupId) {
      return Vue.axios.delete(`${modelUrl}/${groupId}`).catch(error => {
        throw new Error(`[RWV] Group ${error}`);
      });
    }
  };
  
export default GroupService;  