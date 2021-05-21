<template>
  <div class="not-found">

    <v-icon color="#35c25e" x-large>mdi-alert</v-icon>

    <h2><strong>Error</strong> 404</h2>
    <span>The page you were looking for is no longer here</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "NotFound",
});
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  color: var(--text-color);
}

h2 {
  font-size: 1.5rem;
}

strong {
  color: var(--primary-color);
}

img {
  width: 120px;
  height: 120px;
}

</style>
