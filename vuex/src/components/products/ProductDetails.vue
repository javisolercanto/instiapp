<template>
  <div v-if="data.product.id" class="product">
    <div class="container">
      <div v-show="!this.commentsView" class="container--product">
        <div class="image-container">
          <img v-bind:src="data.product.image" alt="image" />
        </div>
        <div class="info-container">
          <span class="price"
            >{{ data.product.price }} <span class="price-sufix">€</span></span
          >
          <h2 class="title">{{ data.product.title }}</h2>
          <span class="subtitle">{{ data.product.author.username }}</span>

          <p class="description">{{ data.product.description }}</p>

          <div
            v-if="showSuccess"
            @click="() => (showSuccess = false)"
            class="container-success"
          >
            <b>Confirmed deal!</b>
            <p>Thanks for your bought: {{ data.product.title }}</p>
          </div>

          <div class="buttons-container">
            <button class="buy" @click="buyProduct">Buy</button>
            <button
              v-if="data.product.author.id !== data.currentUser.id"
              v-bind:class="data.isLiked ? 'icon  liked' : 'icon icon--blue'"
              @click="handleLike"
            ></button>
            <button
              v-if="data.product.author.id === data.currentUser.id"
              class="icon icon--red"
              @click="remove"
            ></button>
            <button
              v-if="data.product.author.id !== data.currentUser.id"
              class="icon icon--orange"
            ></button>
            <button
              v-if="data.product.author.id === data.currentUser.id"
              class="icon icon--edit"
              @click="
                () =>
                  $router.push({
                    name: 'editor',
                    params: { slug: data.product.slug },
                  })"
            ></button>
          </div>
        </div>
      </div>
      <Comments v-show="this.commentsView" :productSlug="data.product.slug" />
      <button
        @click="
          () => {
            this.commentsView = !this.commentsView;
          }"
        class="button--comments"
      >
        {{ this.commentsView ? "Hide comments" : "Show comments" }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ApiService from "../../common/api.service";
import store, { storeTypes, Product, User } from "../../store"

import Comments from "../comments/Comments.vue";

@Component({
  name: "productPreview",
  components: {
    Comments,
  },
})
export default class ProductPreview extends Vue {
  constructor() {
    super();
  }

  commentsView: boolean = false;
  showSuccess: boolean = false;

  data = {
    product: {} as Product | null,
    currentUser: {} as User | null,
    isLiked: false
  };

  beforeDestroy() {
    this.data.product = null;
    this.data.currentUser = null;
  }

  mounted() {
    this.data.currentUser = store.getters.currentUser;

    if (this.$route.params.slug) {
      ApiService.get("products/" + this.$route.params.slug).then((res) => {
        if (res.data) {
          this.data.product = res.data;
          if (this.data.product)
          ApiService.get(`/products/${this.data.product.slug}/like`).then(
            (data) => {
              this.data.isLiked = true;
            },
            (err) => {
              this.data.isLiked = false;
            }
          );
        }
      });
    }
  }

  handleLike() {
    if (this.data.product && store.getters.currentUser) {
      if (!this.data.isLiked) {
        ApiService.post(`/products/${this.data.product.slug}/like`, {}).then(
          (data) => {
            this.data.isLiked = true;
          }
        );
      } else {
        ApiService.delete(`/products/${this.data.product.slug}/like`).then(
          (data) => {
            this.data.isLiked = false;
          }
        );
      }
    }
  }

  buyProduct() {
    if (this.data.product) ApiService.post(`/products/buy/${this.data.product.slug}`, {}).then(
      (data) => {
        this.showSuccess = true
      }
    );
  }

  remove() {
    if (this.data.product) {
      ApiService.delete("products/" + this.$route.params.slug).then((res) => {
        this.$router.push({ path: "/app/products" });
      });
    }
  }
}
</script>

<style scoped>
.product {
  height: 90%;
  width: 100%;

  overflow: hidden;

  padding: 0;
}

.container {
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  color: white;

  padding: 0;
}

.container--product {
  height: 70%;
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;

  color: white;

  padding: 0;
}

.button--comments {
  height: 10%;
  width: 30%;

  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;

  background-color: #5136ff;

  color: white;
  font-weight: bold;

  padding: 0;

  transition: 0.3s all;
}

.button--comments:hover {
  background-color: transparent;
  border: 2px solid #5136ff;

  color: #5136ff;
}

.button--comments:disabled {
  opacity: 0.5;
}

.button--comments:disabled:hover {
  opacity: 0.5;
  background-color: #5136ff;
  color: white;
}

.info-container {
  width: 50%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  width: 100%;
  font-size: 3rem;
  font-weight: bold;

  color: #5136ff;
}

.subtitle {
  width: 100%;
  padding-left: 0.3rem;
  font-style: italic;
}

.price {
  width: 100%;
  font-size: 2.2rem;
  font-weight: bold;
  color: #ffad37;
}

.price-sufix {
  color: #ffad37;
}

.description {
  width: 100%;

  margin-top: 2rem;
}

.buttons-container {
  width: 100%;
  height: 45px;

  margin-top: 4rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.buttons-container button {
  font-size: 1rem;
  font-weight: bold;
}

.buy {
  width: 40%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #ffad37;

  transition: 0.3s all;
}

.buy:hover {
  background-color: transparent;
  border: 2px solid #ffad37;
  color: #ffad37;
}

.icon {
  width: 25%;
  height: 100%;

  padding: 0.2rem;

  display: flex;
  justify-content: center;
  align-items: center;

  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  background-origin: content-box;

  transition: 0.3s all;
}

.icon--blue {
  border: 2px solid #5136ff;

  background-image: url("https://github.com/JavierSolerArtero99/DRF_VUEx/blob/master/Vuex/images/heartoutline.png?raw=true");
}

.icon--blue:hover {
  background-color: #5136ff;

  background-image: url("https://github.com/JavierSolerArtero99/DRF_VUEx/blob/master/Vuex/images/heartgrey.png?raw=true");
}

.liked {
  background-color: #5136ff;
  background-image: url("https://github.com/JavierSolerArtero99/DRF_VUEx/blob/master/Vuex/images/heartgreyfill.png?raw=true");
}

.icon--orange {
  border: 2px solid #ffad37;

  background-image: url("https://github.com/JavierSolerArtero99/DRF_VUEx/blob/master/Vuex/images/shareorange.png?raw=true");
}

.icon--orange:hover {
  background-color: #ffad37;

  background-image: url("https://github.com/JavierSolerArtero99/DRF_VUEx/blob/master/Vuex/images/sharegrey.png?raw=true");
}

.icon--red {
  border: 2px solid #c23834;

  background-image: url("https://github.com/JavierSolerArtero99/DRF_VUEx/blob/master/Vuex/images/remove.png?raw=true");
}

.icon--red:hover {
  background-color: #c23834;

  background-image: url("https://github.com/JavierSolerArtero99/DRF_VUEx/blob/master/Vuex/images/removenegative.png?raw=true");
}

.icon--red:disabled,
.icon--red:disabled:hover {
  opacity: 0.5;
  border: 2px solid #c23834;
  background-color: transparent;
  background-image: url("https://github.com/JavierSolerArtero99/DRF_VUEx/blob/master/Vuex/images/remove.png?raw=true");
}

.icon--edit {
  border: 2px solid #5136ff;

  background-image: url("https://github.com/JavierSolerArtero99/DRF_VUEx/blob/master/Vuex/images/edit.png?raw=true");
}

.icon--edit:hover {
  background-color: #5136ff;

  background-image: url("https://github.com/JavierSolerArtero99/DRF_VUEx/blob/master/Vuex/images/editgrey.png?raw=true");
}

.icon img {
  max-height: 80%;
  max-width: 80%;
}

.buy span {
  color: white;
  margin-left: 1rem;
}

.image-container {
  width: 50%;
  height: fit-content;

  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;
}

.image-container img {
  max-width: 50%;
  max-height: 50%;
}

.container-success {
  height: fit-content;
  width: 250px;

  margin: 1.5rem;
  padding: 1rem;

  position: absolute;
  top: 0;
  right: 0;

  border-radius: 0.3rem;

  line-height: 2rem;

  background-color: #31df75;
  color: white;
}

.container-success p {
  line-height: 1.5rem;
}

.container-success img {
  width: 30px;
  height: 30px;
}

button:focus {
  outline: none;
}
</style>