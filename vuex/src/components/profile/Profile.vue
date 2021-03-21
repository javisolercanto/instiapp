<template>
  <div class="profile">
    <div class="container">
      <div class="header">
        <img
          @click="
            () => {
              $router.push({ path: '/app/profile-edit' });
            }
          "
          class="picture"
          src="https://github.com/JavierSolerArtero99/DRF_VUEx/blob/master/Vuex/images/avatar.png?raw=true"
          alt="profile picture"
        />
        <span class="username">{{ data.currentUser.username }}</span>
        <span class="email">{{ data.currentUser.email }}</span>

        <cite>{{ data.currentUser.bio }}</cite>
      </div>

      <div class="dashboard">
        <div class="dashboard-card">
          <img
            src="https://github.com/JavierSolerArtero99/DRF_VUEx/blob/master/Vuex/images/upload.png?raw=true"
            alt="uploads"
          />
          <span>{{ data.productCount }}</span>
        </div>
        <div class="dashboard-card">
          <img
            src="https://github.com/JavierSolerArtero99/DRF_VUEx/blob/master/Vuex/images/fire.png?raw=true"
            alt="karma"
          />
          <span>{{ data.karma }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import store, { storeTypes, User } from "../../store";
import { Route } from "vue-router";
import ApiService from "../../common/api.service";

@Component({
  name: "profile",
})
export default class Profile extends Vue {
  data = {
    currentUser: {} as User,
    karma: 0 as number,
    productCount: 0 as number,
  };

  constructor() {
    super();
  }

  mounted() {
    this.data.currentUser = store.getters.currentUser;
    // console.log(store.getters.currentUser);
    ApiService.get("profileKarma")
      .then((data) => {
        this.data.karma = data.data.karma;
      })
      .catch((err) => {
        this.data.karma = 0;
      });

    ApiService.get("productsByUser")
      .then((data) => {
        this.data.productCount = data.data.length
      })
      .catch((err) => {
        this.data.productCount = 0
      });
  }
}
</script>

<style scoped>
.profile {
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-size: cover;

  background-color: #222222;
}

.container {
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 0;

  color: white;
  font-size: 1.3rem;
}

.header {
  height: 40%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.header cite {
  margin-top: 0.5rem;
}

.dashboard {
  width: 100%;
  height: 40%;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;

  margin-top: 1rem;
}

.dashboard-card {
  width: 45%;
  height: 70%;

  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard-card img {
  width: 80px;
  height: 80px;
}

.dashboard-card span {
  font-size: 3rem;
  margin-left: 3rem;
}

.username {
  margin-top: 1rem;
}

.email {
  font-size: 0.8rem;
}

.picture {
  width: 150px;
  height: 150px;
}

.picture:hover {
  content: url("https://github.com/JavierSolerArtero99/DRF_VUEx/blob/master/Vuex/images/edit.png?raw=true");
  cursor: pointer;

  width: 140px;
  height: 140px;

  margin: 1rem;

  transition: 1s all;
}

cite {
  font-size: 1rem;
  text-align: center;
}
</style>
