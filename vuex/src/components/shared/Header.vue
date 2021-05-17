<template>
  <div class="header shadow">
    <section class="header__pill  header__user">
      <span>IES L'ESTACIÓ</span>
    </section>
    <nav class="header__menu">
      <section @click="() => $router.push({ name: 'product' })" v-bind:class="$route.path.includes('product') ? 'header__menu__item  header__menu__item--current' : 'header__menu__item'">
        <v-icon color="#35c25e">mdi-shopping</v-icon>
        <span>Market</span>
      </section>
      <section @click="() => $router.push({ name: 'forum' })" v-bind:class="$route.path.includes('forum') ? 'header__menu__item  header__menu__item--current' : 'header__menu__item'">
        <v-icon color="#35c25e">mdi-forum</v-icon>
        <span>Forum</span>
      </section>
      <section @click="() => $router.push({ name: 'group' })" v-bind:class="$route.path.includes('group') ? 'header__menu__item  header__menu__item--current' : 'header__menu__item'">
        <v-icon color="#35c25e">mdi-account-multiple</v-icon>
        <span>Groups</span>
      </section>
      <section @click="() => $router.push({ name: 'route' })" v-bind:class="$route.path.includes('route') ? 'header__menu__item  header__menu__item--current' : 'header__menu__item'">
        <v-icon color="#35c25e">mdi-car</v-icon>
        <span>Routes</span>
      </section>
      <section @click="() => $router.push({ name: 'rental' })" v-bind:class="$route.path.includes('rental') ? 'header__menu__item  header__menu__item--current' : 'header__menu__item'">
        <v-icon color="#35c25e">mdi-home-city</v-icon>
        <span>Rentals</span>
      </section>
    </nav>
    <section @click="() => $router.push({ name: 'profile' })" class="header__pill  header__user">
      <img v-bind:src="$store.getters.currentUser.image">
      <span>{{$store.getters.currentUser.name}}</span>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import store, { storeTypes } from "../../store";
import { Route } from "vue-router";

@Component({
  name: "header",
})
export default class Header extends Vue {
  data = {
  };

  getProfileImage(image: string): string {
    return 'background-image: url("' + image + '")'; 
  }
}
</script>

<style>
.header {
  height: 60px;
  width: 100%;

  /* background-color: var(--primary-color); */
  background-color: white;

  /* margin-top: 1vh;
  margin-left: 1vh;
  margin-right: 1vh; */

  z-index: 2;

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

  color: var(--text-color);
  font-weight: bold;
}

.header__pill:hover {
  color: var(--primary-color);
  transition: 0.4s all;
}

.header__menu {
  width: 50%;

  color: var(--text-color);

  display: flex;
  align-items: center;
  justify-content: space-between;

  cursor: pointer;

  transition: 0.3s all;
}

.header__menu__item {
  height: 100%;

  display: flex;
  align-items: center;

  transition: 0.3s all;
}

.header__menu__item--current span {
  font-weight: bold;
  color: var(--primary-color);
}

.header__menu__item i {
  margin-right: 10px;
}

.header__menu__item span:hover {
  transition: 0.3s all;
  color: var(--primary-color);
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

@media (max-width: 600px) {
  .header__menu {
    height: 60px;

    flex-direction: column;
  }

  .header__logo {
    width: 100%;

    cursor: pointer;

    transition: 0.2s all;
  }

  .header__menu:hover {
    width: 75px;
    height: 400px;
  }

  .header__menu__submenu {
    margin-left: 0;
    margin-top: 100px;
    flex-direction: column;
  }

  .header__menu__submenu hr {
    height: 1px;
    width: 70%;
  }

  .header__menu__submenu section img {
    height: 100%;
    width: 70%;

    transition: height 0.3s linear;
  }
}

</style>
