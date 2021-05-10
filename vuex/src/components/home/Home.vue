<template>
  <div class="home">
    <Header />
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Route } from "vue-router";

import Component from "vue-class-component";
import Header from "../shared/Header.vue";
import Footer from "../shared/Footer.vue";

import { store, storeTypes } from "../../store";
import { getToken } from "../../common/jwt.service";

@Component({
  name: "home",
  components: {
    Header,
    Footer,
  },
})
export default class Home extends Vue {
  constructor() {
    super();
  }

  mounted() {
    if (getToken()) {
      store.dispatch(storeTypes.root.actions!.autoAuth()).then(() => {});
    }
  }
}
</script>

<style>

.home {
  /* background-image: url('../../../assets/images/paperwall.jpeg'); */
  background-repeat: repeat;
  background-size: cover;

  overflow: hidden;
}

.dashboard {
  width: 100%;
  height: 100%;

  position: relative;
  top: 0;
}

.welcome-container {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.welcome-container span {
  font-size: 3rem;
  font-weight: 700;
  color: #ffad37;
}

.highlight {
  color: #5136ff;
  font-weight: 900;
}

.welcome-container p {
  font-size: 1.5rem;
  color: white;
}

</style>