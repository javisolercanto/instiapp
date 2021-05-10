<template>
  <section class="preview  shadow">
    <section class="preview__image__container" v-bind:style="{backgroundImage: 'url('+product.image+')'}"></section>
    <span v-bind:style="{fontSize: product.price.toString().length > 1 ? 120/product.price.toString().length + 'px' : '80px'}"
      class="preview__price ">{{product.price}}€</span>
    
    <span v-bind:style="{fontSize: getNameSize()}" class="preview__name">{{product.name}}</span>

    <section>
      <v-icon color="#35c25e" small>mdi-calendar</v-icon>
      <span class="preview__date">{{getDate()}}</span>
      <button style="margin-top: 5px" class="button" @click="() => {
        $router.push({name: 'product-details', params: { id: product.id }})}">See more</button>
    </section>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import store, { storeTypes, Product } from "../../store";
import { Route } from "vue-router";

@Component({
  name: "productPreview",
})
export default class ProductPreview extends Vue {

@Prop({required: true, type: Object as () => Product}) readonly product: Product;

  constructor() {
    super();
  }

  getNameSize(): string {
    let size = 30;
    if (this.product.name.length > 20 && this.product.name.length <= 80)
      size = 800/this.product.name.length;

    if (this.product.name.length > 80) {
      size = 15;
    }

    return size + 'px';
  }

  getDate(): string {
    let date = new Date(this.product.updatedAt);
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
  }
}
</script>

<style>
.preview {
  height: 300px;
  width: 250px;

  border-radius: 7px;
  background-color: white;

  overflow: hidden;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 2vh;
  cursor: pointer;
}

.preview__image__container {
  position: absolute;
  top: 0;
  right: 0;

  height: 130px;
  width: 130px;

  overflow: hidden;

  background-size: cover;
  border-bottom-left-radius: 90%;
}

.preview__price {
  font-size: 50px;
  font-weight: bold;
  color: var(--primary-color);
}

.preview__name {
  color: #474747;
  font-weight: bold;
  font-size: 30px;
}

.preview__date {
  font-size: 12px;
  color: var(--primary-color);
}

.image-container {
  padding: 1rem;

  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;
}

.image-container img {
  max-width: 100%;
  max-height: 100%;
}

.info-container {
  color: white;
  background-color: var(--primary-color);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.image-container:hover {
  height: 250px;
  border-bottom: 3px solid var(--primary-color);
  cursor: pointer;
}

.image-container:hover img {
  max-width: 110%;
  max-height: 110%;
}

.image-container:hover ~ .info-container {
  display: none;
}

.title {
  width: 100%;

  padding-left: 1rem;

  font-weight: bold;
  font-size: 1.4rem;
}

.subtitle {
  width: 100%;

  padding-left: 1rem;

  font-weight: lighter;
  font-size: 0.8rem;
}

.price {
  width: 100%;
  padding-right: 1rem;
  text-align: right;

  font-weight: bold;
  font-size: 1.4rem;
}

.container {
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 0;

  background-color: crimson;
}
</style>