<template>
  <div class="header">
    <div class="container--info">
      <img class="logo" src="../../../assets/images/hat.svg" alt="site logo">
    </div>

    <hr>

    <div class="container--links">
      <router-link to="/">Home</router-link>
      <router-link to="/app/products">Marketplace</router-link>
      <router-link to="/app/editor">Rentals</router-link>
      <router-link to="/app/editor">Forum</router-link>
      <router-link to="/app/editor">Routes</router-link>
    </div>

    <hr>

    <div class="container--buttons">
      <button
        v-if="this.$store.getters.currentUser.isAuthed && !this.$store.getters.currentUser.isAdmin"
        @click="
          () => {
            $router.push({ path: '/app/profile' });
          }"
        class="button button-profile"
      >
        {{ this.$store.getters.currentUser.username }}
      </button>
      <button
        v-if="this.$store.getters.currentUser.isAdmin"
        @click="
          () => {
            $router.push({ path: '/app/panel-admin' });
          }"
        class="button button-admin"
      >
        Panel admin
      </button>
      <!-- <img v-if="!this.$store.getters.currentUser.isAuthed" class="logo" style="padding: 1.5vh" src="../../../assets/images/user.svg" alt="login">Login -->
      <!-- <button @click="handleAuth" class="button button-login">
        {{ this.$store.getters.currentUser.isAuthed ? "Logout" : "Login" }}
      </button> -->
      <img class="logo" src="../../../assets/images/hat.svg" alt="site logo">
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import store, { storeTypes } from "../../store";
import { Route } from "vue-router";

@Component({
  name: "appHeader",
})
export default class Header extends Vue {
  data = {
    currentUser: store.getters.currentUser,
  };

  handleAuth() {
    if (this.$store.getters.currentUser.isAuthed) {
      store
        .dispatch(storeTypes.root.actions!.purgeAuth())
        .then((res) => this.$router.push({ path: "/login" }));
    } else {
      this.$router.push({ path: "/login" });
    }
  }
}
</script>

<style scoped>
.header {
  width: 100%;
  height: 9vh;

  position: relative;
  top: 0;

  background-color: #005792;

  color: white;
  font-size: 2vh;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

a {
  color: white !important;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
  text-decoration-color: white;
}

hr {
  height: 50%;
}

.logo {
  height: 100%;
  cursor: pointer;
}

.container--info {
  height: 100%;
  width: 30%;

  vertical-align: center;
  text-align: center;

  padding: 1vh;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: 0.2s all;
}

.container--info:hover {
  background-color: #00426F;
}

.container--buttons {
  height: 100%;
  width: 30%;

  vertical-align: center;
  text-align: center;

  padding: 1vh;

  display: flex;
  align-items: center;
  justify-content: center;
}

.container--links {
  height: 100%;
  width: 100%;

  font-size: 1.2em;

  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.container--links a {
  margin-left: 1vh;
  margin-right: 1vh;
}

.button {
  width: 15vh;
  height: 100%;

  padding: 1vh;
}

.button:focus {
  outline: 0;
}

.button-login {
}

.button-profile {
  background-color: #5136ff;
}

.button-admin {
  color: black;
  background-color: #ccd2db;
}
</style>
