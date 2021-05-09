<template>
  <div class="pagination">
    <div class="pages">
      <img
        v-bind:class="currentPage===0 ? 'button-arrow  button-arrow--disabled' : 'button-arrow'"
        @click="changePage(currentPage-1)"
        src="../../../assets/images/left-arrow.svg" alt="left arrow">
      <button
        class="page"
        v-for="page in totalPages"
        v-bind:key="page"
        v-bind:class="page-1 === currentPage ? 'page--current' : 'page--stand'"
        @click="changePage(page-1)">
          {{ page }}
      </button>
      <img
        v-bind:class="currentPage+1===totalPages ? 'button-arrow  button-arrow--disabled' : 'button-arrow'"
        @click="changePage(currentPage+1)"
        src="../../../assets/images/right-arrow.svg" alt="right arrow">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch} from "vue-property-decorator";

@Component({
  name: "pagination",
})
export default class Pagination extends Vue {
  @Prop({ required: true, type: Number }) currentPage: number;
  @Prop({ required: true, type: Number }) totalPages: number;

  constructor() {
    super();
  }

  @Emit("change-page")
  changePage(page) {
    return page;
  }
}
</script>

<style>
.pagination {
  width: 100%;
  height: 100%;

  overflow: hidden;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-arrow {
  height: 70%;
  cursor: pointer;
}

.button-arrow--disabled {
  opacity: 0.5;
}

.pages {
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.page {
  height: 100%;
  width: fit-content;
  padding: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.page--current {
  font-size: 150%;
  color: var(--text-color);
  border-bottom: 5px solid var(--primary-color);
}

button:focus {
  outline: none;
}
</style>