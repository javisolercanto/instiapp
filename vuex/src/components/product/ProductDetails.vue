<template>
  <section v-if="data.product.id" class="product">
    <section class="product__header">
      <section class="box  shadow  product__title">
        <v-icon color="#35c25e">mdi-circle-edit-outline</v-icon>
        <span>{{data.product.name}}</span>
      </section>
      <section class="box  shadow  product__category">
        <v-icon color="#35c25e">mdi-school</v-icon>
        <span>{{data.product.category.name}}</span>
      </section>
    </section>
    <section v-if="!reducedView" class="box  shadow  product__toolbar">
      <v-icon color="#35c25e">mdi-eye</v-icon>
      <span>It may interest you</span>
    </section>
    <section class="box  shadow  product__product">
      <section class="product__data__container">
        <section class="product__img__wrapper">
          <img class="shadow box" v-bind:src="data.product.image" v-bind:alt="data.product.name">
          <span class="product__date">
            <v-icon color="#35c25e">mdi-calendar</v-icon>
            {{getDate()}}
          </span>
        </section>
        <section class="product__data__wrapper">
          <span class="product__price">
            {{data.product.price}}€
          </span>
          <span class="product__author">
            <v-icon color="#35c25e">mdi-at</v-icon>
            {{data.product.user.name}}
          </span>
          <span class="product__description">{{data.product.description}}</span>
        </section>
      </section>
      <section class="product__buttons">
        <button @click="sendContactMail()" class="button  contact__button">
          Contact
        </button>
        <button v-if="$store.getters.currentUser.id !== data.product.user.id" @click="sendShareMail()" class="button  action__button" 
          @mouseover="actionOnHover = true" 
          @mouseleave="actionOnHover = false">
            <v-icon v-bind:color="actionOnHover ? '#24a146' : '#35c25e'">mdi-share-variant</v-icon>
        </button>
        <button v-if="$store.getters.currentUser.id === data.product.user.id" @click="editProduct()" class="button  action__button" 
          @mouseover="actionOnHover = true" 
          @mouseleave="actionOnHover = false">
            <v-icon v-bind:color="actionOnHover ? '#24a146' : '#35c25e'">mdi-pencil</v-icon>
        </button>
        <button v-if="$store.getters.currentUser.id === data.product.user.id" @click="deleteProduct()" class="button  action__button  action__button--red" 
          @mouseover="removeOnHover = true" 
          @mouseleave="removeOnHover = false">
            <v-icon v-bind:color="removeOnHover ? '#a52d29' : '#c23834'">mdi-delete</v-icon>
        </button>
      </section>
    </section>
    <section v-if="!reducedView" class="box  shadow  product__list">
      <ProductPreview
        :product="product"
        v-for="product in data.similarProducts"
        v-bind:key="product.id"
      />
    </section>

    <ErrorContainer @clear-errors="clearErrors()" :errors="errors" />

  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ProductService from "../../common/services/product/product.service";
import FabTypeEnum from "../../common/services/FabTypesEnum";
import store, { storeTypes, Product, User } from "../../store"


import ProductPreview from "./ProductPreview.vue";
import Fab from "../shared/Fab.vue";
import ErrorContainer from "../shared/ErrorContainer.vue";


@Component({
  name: "productDetails",
  components: {
    ProductPreview,
    Fab,
    ErrorContainer
  },
})
export default class ProductDetails extends Vue {
  constructor() {
    super();
  }

  actionOnHover: boolean = false;
  removeOnHover: boolean = false;
  reducedView: boolean = false;
  FabTypeEnum: any = FabTypeEnum;
  errors: string[] = [];

  data = {
    product: {} as Product,
    similarProducts: [] as Product[],
    currentUser: {} as User,
  };

  beforeDestroy() {
    this.data.product = {} as Product;
    this.data.currentUser= {} as User;
  }

  mounted() {
    this.data.currentUser = store.getters.currentUser;

    if (this.$route.params.id) {
      ProductService.get(this.$route.params.id).then((res) => {
        if (res.data) {
          this.data.product = res.data;
          console.log(this.data.currentUser);
          console.log(this.data.product);
          
          if (!this.reducedView) {
            this.listProducts();
          }
        }
      });
    }

    window.addEventListener("resize", this.checkView);
    this.checkView();
  }

  checkView() {
    this.reducedView = screen.width <= 900;
    this.listProducts();
  }

  listProducts(): void {
    const filters = {
      category: this.data.product.category ? this.data.product.category.id : 2,
      page: 0,
      size: 1,
      order: "updatedAt",
      direction: "DESC"
    }

    ProductService.list(filters)
      .then(res => {
        this.data.similarProducts = res.data.data;
      })
      .catch(err => this.errors.push(err.response.data.error));
  }

  getDate(): string {
    let date = new Date(this.data.product.updatedAt);
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
  }

  sendContactMail() {
    const subject = `I'm interested in your product: ${this.data.product.name}`;
    const body = `Hi, ${subject}. Could you please give me more information about it?`;

    window.open(`mailto:${this.data.product.user.email}?subject=${subject}&body=${body}`);
  }

  sendShareMail() {
    const subject = `Hey! This could interest you: ${this.data.product.name}`;
    const body = `Hi, ${subject}. How about to take a look?`;

    window.open(`mailto:?subject=${subject}&body=${body}`);
  } 

  editProduct() {
    this.$router.push({ name: "product-editor", params: {id: this.data.product.id.toString()} });
  } 

  deleteProduct() {
    if (this.data.product) {
      ProductService.delete(this.data.product.id).then((res) => {
        this.$router.push({ path: "/app/product" });
      });
    }
  }

  clearErrors() {
    this.errors = [];
  }
}
</script>

<style>
.product {
  height: 90%;
  width: 99%;

  overflow: hidden;
  color: var(--text-color);

  margin: 1vh;
  padding: 2vh;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 70px auto auto;
  gap: 3vh 3vh;
  grid-template-areas:
    "header header toolbar"
    "product product list"
    "product product list";
}

.product__header {
  grid-area: header;

  display: flex;
  justify-content: start;
}

.product__title {
  grid-area: title;

  width: fit-content;
  font-weight: bold;

  padding: 0 2vh 0 2vh;
  font-size: 150%;

  display: flex;
  flex-direction: row;
  align-items: center;
}

.product__category {
  grid-area: category;

  width: fit-content;
  font-weight: bold;

  margin-left: 20px;
  padding: 0 2vh 0 2vh;
  font-size: 120%;

  display: flex;
  flex-direction: row;
  align-items: center;
}

.product__toolbar span,
.product__title span,
.product__category span {
  margin-left: 10px;
}

.product__toolbar {
  grid-area: toolbar;

  font-weight: bold;

  width: fit-content;
  padding: 0 2vh 0 2vh;
  font-size: 20px;

  display: flex;
  flex-direction: row;
  align-items: center;
}

.product__product {
  grid-area: product;

  height: 100%;
  padding: 3vh;

  display: flex;
  justify-content: center;
  align-self: center;
  flex-direction: column;
}

.product__data__container {
  height: 80%;

  display: flex;
  align-items: center;
  justify-content: center;
}

.product__buttons {
  height: 20%;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product__img__wrapper {
  height: 100%;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.product__data__wrapper {
  height: 100%;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
}

.product__description {
  text-align: justify;
}

.product__date {
  margin-top: 20px;
  text-align: start;
  color: #5e5e5e;
  font-size: 14px;
}

.product__author {
  margin-top: 5px;
  margin-bottom: 10px;
  text-align: start;
  color: #5e5e5e;
}

.product__price {
  font-weight: bold;
  font-size: 6rem;

  color: var(--primary-color);
}

.product__product img {
  max-width: 50%;
  max-height: 50%;
}

.product__list {
  grid-area: list;

  display: flex;
  justify-content: center;
  align-items: center;
}

.action__button {
  margin-left: 20px;
  width: 30% !important;
  border-color: transparent !important;
}

.action__button:hover {
  background-color: transparent !important;
}

@media screen and (max-width: 900px) {
  .product {
    width: 99%;


    grid-template-columns: 1fr 1fr 0;
    align-items: center;
  }
}

@media screen and (max-width: 500px) {
  .product__data__container {
    flex-direction: column;
  }

  .product__data__wrapper {
    justify-content: center;
  }
}

</style>