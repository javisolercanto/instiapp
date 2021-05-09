<template>
  <section class="spinner__container">
    <section v-show="loading" class="spinner"></section>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
  name: "spinner",
})
export default class Spinner extends Vue {
  @Prop({ required: true, type: Boolean }) loading: boolean;

  constructor() {
    super();
  }

  @Watch("loading")
  onChange(loading: boolean, oldValue: boolean) {
    this.loading = loading;
  }
}
</script>

<style>
.loader,
.loader:before,
.loader:after {
  border-radius: 50%;
  width: 2.5em;
  height: 2.5em;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation: load7 1.8s infinite ease-in-out;
  animation: load7 1.8s infinite ease-in-out;
}

.spinner {
  display: flex;
  width: 40px;
  height: 40px;
}
.spinner:after {
  content: " ";
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid var(--primary-color);
  border-color: var(--primary-color) transparent var(--primary-color)
    transparent;
  animation: spinner 1.2s linear infinite;
}
@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>