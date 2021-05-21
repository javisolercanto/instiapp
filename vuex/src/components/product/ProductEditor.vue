<template>
  <section class="editor">
    <form @submit="handleProduct" class="shadow  editor__form">
      <section class="input__wrapper">
        <label for="name">Name:</label>
        <input
          class="input"
          v-model="data.product.name"
          type="text"
          name="name"
          required
        />
      </section>
      <section class="input__wrapper">
        <label for="name">Description:</label>
        <input
          class="input"
          v-model="data.product.description"
          type="text"
          name="description"
          required
        />
      </section>
      <section class="input__wrapper">
        <label for="name">Price €:</label>
        <input
          class="input"
          v-model="data.product.price"
          type="number"
          name="price"
          step="0.01"
          min="0"
          max="999"
          required
        />
      </section>
      <section class="input__wrapper">
        <label for="name">Image:</label>
        <input
          class="input"
          v-model="data.product.image"
          type="url"
          name="image"
          required
        />
      </section>
      <section class="input__wrapper">
        <label for="name">Category:</label>
        <select v-model="data.product.categoryId" class="input" name="category" id="category">
          <option disabled selected>Category</option>
          <option v-bind:value="null">All categories</option>
          <option 
            v-for="category in data.categories"
            v-bind:key="category.id"
            v-bind:value="category.id">{{category.name}}
          </option>
        </select>
      </section>
      <button type="submit" class="button">{{editMode ? 'Save' : 'Post'}} product</button>
    </form>

    <ErrorContainer @clear-errors="clearErrors" :errors="errors"/>

  </section>
</template>

<script lang="ts">
import Vue from "vue";

import Component from "vue-class-component";
import { Route } from "vue-router";
import ApiService from "../../common/services/api.service";
import store, { Category, Product } from "../../../../vuex/src/store";
import ProductService from "../../common/services/product/product.service";
import CategoryService from "../../common/services/category/category.service";

import ErrorContainer from "../shared/ErrorContainer.vue";

@Component({
  name: "productEditor",
  components: {
    ErrorContainer
  },
})
export default class ProductEditor extends Vue {
  constructor() {
    super();
  }

  data = {
    product: {
      image: "https://i.ibb.co/dpNjfS7/default-image.png",
    } as Product,
    categories: [] as Category[]
  };

  errors: string[] = [];
  editMode: boolean = false;

  beforeDestroy() {
    this.data.product = {} as Product;
  }

  mounted() {
    CategoryService.list()
      .then(res => this.data.categories = res.data.data)
      .catch(err => this.errors = err);
    
    if (this.$route.params.id) {
      ProductService.get(this.$route.params.id)
        .then((res) => {
          if (res.data) {
            this.editMode = true;
            this.data.product = res.data;
          }
        }
      );
    }
  }

  handleProduct(e) {
    e.preventDefault();

    if (this.editMode) {
      ProductService.update(this.data.product.id, this.data.product)
        .then(res => {
          if (res.data)
            this.$router.push({name: 'product-details', params: { id: this.data.product.id.toString() }})
        })
        .catch(err => this.errors.push(err.response.data.error))

    } else {
      ProductService.create(this.data.product)
        .then(res => {
          if (res.data)
            this.$router.push({ name: "product", params: { id: res.data.id } });
        })
        .catch(err => this.errors.push(err.response.data.error))
    }
  }

  clearErrors(e) {
    this.errors = [];
  }
}
</script>

<style>
.editor {
  height: 90%;
  width: 99%;

  overflow: hidden;
  color: var(--text-color);

  margin: 1vh;
  padding: 2vh;

  display: flex;
  justify-content: center;
  align-items: center;
}

.editor__form {
  height: 50%;
  width: 30%;
  max-height: 500px;
  min-height: 500px;
  max-width: 400px;
  min-width: 300px;

  padding: 1rem 1.5rem 1rem 1.5rem;

  background-color: var(--bg-color);

  border-radius: 7px;

  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.input__wrapper {
  width: 100%;
}

</style>