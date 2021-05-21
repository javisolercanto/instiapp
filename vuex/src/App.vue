<template>
  <div style="height: 100%">
    <router-view style="height: 100%" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",
});
</script>

<style>
:root {
  /* Green */
  --primary-color: #35c25e;
  --primary-color-dark: #24a146;

  --warn-color: #f23934;
  --warn-color-dark: #a52d29;
  --success-color: #29EE62;
  --success-color-dark: #32CC5E;
  --text-color: #474747;
  --bg-color: #fff;
}

.shadow {
  box-shadow: 0px 0px 14px -3px rgba(0, 0, 0, 0.72);

  transition: 0.3s all;
}

.shadow:hover {
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.72);
}

.box {
  border-radius: 7px;
  background-color: white;
}

.button {
  width: 100%;
  height: 50px;

  color: var(--primary-color) !important;
  /* background-color: var(--primary-color); */

  border: 2px var(--primary-color) solid;
  border-radius: 5px;

  /* color: white !important; */
  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: 0.3s all;
}

.button:disabled:hover,
.button:disabled {
  opacity: 0.6;
  cursor: default;
  border: 2px var(--primary-color) solid;
  color: var(--primary-color) !important;
  background-color: transparent;
  font-size: 1rem;
}

.button--actived,
.button:hover {
  font-size: 1.1rem;
  background-color: var(--primary-color);
  color: white !important;
}

button a {
  text-decoration: none;
}

a {
  color: var(--primary-color) !important;
}

select:focus,
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
  /* background-color: #e5e5e5; */

  border-bottom: 2px var(--primary-color) solid;
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
  border-bottom: 2px var(--primary-color) solid;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 25px;
  background: #d3d3d3;
  outline: none;
  -webkit-transition: .2s;
  transition: opacity .2s;
  border-radius: 5px;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  background: var(--primary-color);
  cursor: pointer;
  border-radius: 5px;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  background: var(--primary-color);
  cursor: pointer;
  border-radius: 5px;
}

#app {
  width: 100%;
  height: 100%;
  min-height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
