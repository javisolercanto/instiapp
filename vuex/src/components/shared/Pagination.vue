<template>
  <div class="pagination">
    <button class="button-focus" :disabled="data.currentOffset===1" @click="changePage(data.currentOffset-1)">Previous</button>
    <div class="pages">
      <button
        class="page"
        v-for="page in data.totalPages"
        v-bind:key="page"
        v-bind:class="page === data.currentOffset ? 'page--current' : 'page--stand'"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
    </div>
    <button class="button-focus" :disabled="data.currentOffset>=data.totalPages" @click="changePage(data.currentOffset+1)">Next</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch} from "vue-property-decorator";

@Component({
  name: "pagination",
})
export default class Pagination extends Vue {
  @Prop({ required: true, type: Number }) readonly limit: number;
  @Prop({ required: true, type: Number }) offset: number;
  @Prop({ required: true, type: Number }) total: number;

  constructor() {
    super();
  }

  data = {
    totalPages: 0,
    currentOffset: 0
  }

  @Watch("offset")
  onChangeOffset(value: number, oldValue: number) {
    this.data.currentOffset = value === 0 ? 1 : value + 1;
  }

  @Watch("total")
  refreshPagination(value: number, oldValue: number) {
    this.data.totalPages = Math.ceil(value / this.limit);
  }

  @Emit("change-page")
  changePage(offset) {
    return offset;
  }
}
</script>

<style scoped>
.pagination {
  width: 79%;
  height: 10%;

  overflow: hidden;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding-top: 1rem;
}

.button-focus {
  height: 100%;
  width: 10%;

  color: white;

  background-color: #ffad37;
}

button:disabled {
  opacity: 0.5;
}

.pages {
  width: 80%;
  height: 100%;

  display: flex;
  justify-content: space-evenly;
  align-items: center;

  color: white;
}

.page {
  height: 100%;
  width: 100%;

  margin: .2rem;
}

.page--stand {
  border: 2px solid #ffad37;
}

.page--stand:hover {
  border: 2px solid #ffad37;
  background-color: #ffad37;
}

.page--current {
  background-color: #5136ff;
}

button:focus {
  outline: none;
}
</style>