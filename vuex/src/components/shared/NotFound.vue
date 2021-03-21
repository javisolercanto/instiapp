<template>
  <div class="not-found">
    <img src="https://github.com/JavierSolerArtero99/DRF_VUEx/blob/master/Vuex/images/404.png?raw=true" alt="404 error">

    <h2><strong>Error</strong> 404</h2>
    <span>The page you were looking for is no longer here</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import store from "../../store";

export default Vue.extend({
  name: "NotFound",
  computed: {
  },
  mounted() {
  },
});
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  color: white;
}

h2 {
  font-size: 1.5rem;
}

strong {
  color: #5136ff;
}

img {
  width: 120px;
  height: 120px;
}

</style>
