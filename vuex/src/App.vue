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
  /* Red */
  /* --primary-color: #c23835;
  --primary-color-dark: #A12724; */

  /* Green */
  --primary-color: #35C25E;
  --primary-color-dark: #24A146;

  /* Blue */
  /* --primary-color: #35A2C2;
  --primary-color-dark: #247FA1; */

  --bg-color: #fff;
}

.shadow {
  box-shadow: 0px 0px 14px 1px rgba(0,0,0,0.72);

  transition: 0.3s all;
}

.shadow:hover {
  box-shadow: 0px 0px 20px 1px rgba(0,0,0,0.72);
}

.button {
  width: 100%;
  height: 50px;

  color: var(--primary-color);
  background-color: var(--primary-color);

  border-bottom: 3px var(--primary-color-dark) solid;
  border-radius: 5px;

  color: white !important;
  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: 0.3s all;
}

.button:hover {
  font-size: 1.1rem;
  background-color: var(--primary-color-dark);
}

a {
  color: var(--primary-color) !important;
}

button:focus,
input:focus {
  outline: 0;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input {
  height: 50px;
  width: 100%;

  color: black;
  background-color: #e5e5e5;

  border-bottom: 3px var(--primary-color) solid;
  border-radius: 5px;

  padding-left: 1.5rem;
  padding-right: 1rem;

  font-size: 1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: 0.3s all;
}

.input:focus {
  border-bottom: 3px var(--primary-color-dark) solid;
}

.container-error {
  height: fit-content;
  width: 250px;

  margin: 1.5rem;
  padding: 1rem;

  position: absolute;
  top: 0;
  right: 0;

  border-radius: 5px;

  line-height: 2rem;

  background-color: #c23834;
  color: white;
}

.container-error p {
  line-height: 1.5rem;
}

.container-error img {
  width: 30px;
  height: 30px;
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
