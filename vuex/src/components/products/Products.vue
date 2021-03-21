<template>
  <div class="products">
    <div class="container">
      <ProductPreview
        v-for="product in data.products"
        v-bind:key="product.id"
        :product="product"
      />
    </div>
    <Pagination
      @change-page="listProducts"
      :limit="10"
      :offset="data.offset"
      :total="data.totalProducts"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import store, { storeTypes, Product } from "../../store";
import { Route } from "vue-router";

import ProductPreview from "./ProductPreview.vue";
import Pagination from "../shared/Pagination.vue";
import ApiService from "../../common/api.service";

const LIMIT: number = 10;

@Component({
  name: "products",
  components: {
    ProductPreview,
    Pagination,
  },
})
export default class Products extends Vue {
  data = {
    products: [] as Product[],
    totalProducts: 1 as number,
    offset: 1 as number,
  };

  constructor() {
    super();
  }

  mounted() {
    this.listProducts(1);
  }

  beforeDestroy() {
    this.data.products = [];
    this.data.totalProducts = 0;
    this.data.offset = LIMIT;
  }

  listProducts(value: number): void {
    value = value - 1;

    ApiService.list("products/?limit=10&offset=" + value*LIMIT).then(
      (res) => {
        if (res.data.results) {
          this.data.products = res.data.results;
          this.data.totalProducts = res.data.count;
          this.data.offset = value;
        }
      }
    );
  }
}
</script>

<style scoped>
.products {
  height: 90%;
  width: 100%;

  padding: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.container {
  height: 80%;
  width: 100%;

  display: inline-grid;
  grid-template-columns: repeat(5, minmax(190px, 1fr));
  justify-items: center;
  align-items: center;

  overflow: hidden;
  padding: 0;
}
</style>