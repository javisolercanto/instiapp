<template>
  <div style="height: 100%">
    <router-view style="height: 100%" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import store, { storeTypes } from "./store";
import { RootState } from "./store/root.models";
import { Loader, Header, Footer } from "./components";

export default Vue.extend({
  name: "App",
  components: { Loader , Header, Footer },
  created() {
    this.reloadProducts();
  },
  methods: {
    reloadProducts() {
    }
  }
});
</script>

<style>
:root {
  --primary-color: #005792;
  --primary-color-dark: #00426F;

  --bg-color: #e5e5e5;
}

#app{
  width: 100%;
  height: 100%;
  min-height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
