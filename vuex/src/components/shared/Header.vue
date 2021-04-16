<template>
  <div class="header">
    <div class="header__pill  header__menu  shadow">
      <img class="header__logo" src="../../../assets/images/homeISO.svg" alt="site logo">
      <div class="header__menu__submenu">
        <hr>
        <img src="../../../assets/images/off-road.svg" alt="site logo">
        <img src="../../../assets/images/dictionary.svg" alt="site logo">
        <img src="../../../assets/images/bag.svg" alt="site logo">
        <img src="../../../assets/images/bed.svg" alt="site logo">
      </div>
    </div>
    <section class="header__pill  header__user  shadow">
      <!-- <div class="header__user__imgwrapper"
        v-bind:style="{ 'backgroundImage': 'url(' + data.image + ')' }"></div> -->
      <img src="../../../assets/images/woman.svg" alt="profile picture">
      <span>{{data.name}}</span>
    </section>
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
    name: 'Marina Medina González-Conde',
    image: 'https://cdn4.iconfinder.com/data/icons/circle-avatars-1/128/034_girl_avatar_profile_woman-2-512.png',
    currentUser: store.getters.currentUser,
  };

  getProfileImage(image: string): string {
    return 'background-image: url("' + image + '")'; 
  }

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

<style>
.header {
  height: 60px;
  width: 100%;

  /* margin-top: 1vh;
  margin-left: 1vh;
  margin-right: 1vh; */

  position: absolute;
  top: 0;
  left: 10px;
  right: 10px;

  z-index: 2;

  background-color: var(--primary-color);

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header__logo {
  height: 70%;

  cursor: pointer;

  transition: 0.2s all;
}

.header__pill {
  height: 100%;

  padding-top: 1vh;
  padding-bottom: 1vh;
  padding-left: 3vh;
  padding-right: 3vh;

  display: flex;
  align-items: center;

  cursor: pointer;

  transition: 0.2s all;
  color: black;

  background-color: var(--bg-color);
  border-radius: 30px;
}

.header__menu {
  width: 75px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  transition: 0.3s all;
}

.header__menu:hover {
  width: 400px;
}

.header__menu__submenu {
  margin-left: 30px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;

  visibility: hidden;
  opacity: 0;

  transition: visibility 0s, opacity 0.5s linear;
}

.header__menu__submenu hr {
  height: 70%;
  width: 1px;

  border: 1px solid #e5e5e5;
}

.header__menu__submenu img {
  height: 70%;
  width: 100%;

  transition: height 0.3s linear;
}

.header__menu__submenu img:hover {
  height: 100%;
}

.header__menu:hover > .header__menu__submenu {
  width: 100%;
  height: 100%;

  opacity: 1;
  visibility: visible;
}

.header__user {
  width: fit-content;

  transition: visibility 0s, opacity 0.5s linear;
}

.header__user img {
  height: 70%;
  margin-right: 20px;
}

.header__user span {
}

.header__user__imgwrapper {
  min-width: 40px;
  min-height: 40px;
  max-width: 40px;
  max-height: 40px;
  width: 40px;
  height: 40px;

  margin-right: 20px;
  border-radius: 50%;

  background-size: cover;
}

</style>
