<template>
  <div class="footer">
    <span>Javier Soler Artero & Cantó ©</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import store from "../../store";

export default Vue.extend({
  name: "Footer",
  computed: {
  }
});
</script>

<style scoped>
.footer {
  width: 100%;
  height: 6vh;

  position: absolute;
  bottom: 0;

  background-color: #222222;
  /* background:linear-gradient(90deg, #ee0979 0%,#ff6a00 100% ); */
  
  color: white;
  font-size: 2vh;

  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
