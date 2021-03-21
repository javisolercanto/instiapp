<template>
  <div class="container">
    <form @submit="handleProduct" class="create__form">
      <div class="input__container">
        <div>
          <label for="name">Name</label>
          <input
            :disabled="editMode"
            @click="cleanErrors"
            class="create__input"
            id="name"
            v-model="data.product.title"
            type="text"
            name="name"
            required
          />
        </div>
        <div>
          <label for="description">Description</label>
          <input
            @click="cleanErrors"
            class="create__input"
            id="description"
            v-model="data.product.description"
            type="text"
            name="description"
            required
          />
        </div>
        <div>
          <label for="image">Image</label>
          <input
            @click="cleanErrors"
            class="create__input"
            id="image"
            v-model="data.product.image"
            type="text"
            name="image"
            required
          />
        </div>
        <div>
          <label for="price">Price</label>
          <input
            @click="cleanErrors"
            class="create__input"
            id="price"
            v-model="data.product.price"
            type="number"
            name="price"
            required
          />
        </div>
      </div>

      <div v-if="errors.length > 0" class="container-error">
        <b>Please, check this errors:</b>
        <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
      </div>
      <button class="login__button">
        {{ editMode ? "Edit product" : "Create product" }}
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import Component from "vue-class-component";
import { Route } from "vue-router";
import ApiService from "../../../../vuex/src/common/api.service";
import store, { Product } from "../../../../vuex/src/store";

@Component({
  name: "createProduct",
  components: {},
})
export default class CreateProduct extends Vue {
  constructor() {
    super();
  }

  data = {
    product: {
      title: "",
      description: "",
      image:
        "https://github.com/JavierSolerArtero99/DRF_VUEx/blob/master/Vuex/images/shirt.png?raw=true",
      price: 0,
    } as Product | null,
  };

  errors: string[] = [];
  editMode: boolean = false;

  beforeDestroy() {
    this.data.product = null;
  }

  mounted() {
    if (this.$route.params.slug) {
      ApiService.get("products/" + this.$route.params.slug).then((res) => {
        if (res.data) {
          this.editMode = true;
          this.data.product = res.data;
        }
      });
    }
  }

  handleProduct(e) {
    if (!this.editMode && this.data.product) {
      this.data.product.slug = this.data.product.title;
      this.data.product.author = store.getters.currentUser;

      ApiService.post("products/", { product: this.data.product })
        .then((data) => {
          this.$router.push({
            name: "details",
            params: { slug: data.data.slug },
          });
        })
        .catch((err) => {
          if (!err.response.data.includes("duplicate key value")) {
            for (var i in err.response.data) {
              this.errors.push(`${i}: ${err.response.data[i][0]}`);
            }
          } else {
            if (this.data.product)
              this.errors.push(
                `There is a product with name: ${this.data.product.title}`
              );
          }
        });
    } else if (this.data.product)
      ApiService.update("products/", this.$route.params.slug, {
        product: this.data.product,
      })
        .then((data) => {
          this.$router.push({
            name: "details",
            params: { slug: data.data.slug },
          });
        })
        .catch((err) => {
          console.log(err);
        });

    e.preventDefault();
  }

  cleanErrors(e) {
    this.errors = [];
  }
}
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-size: cover;

  background-color: #222222;
}

.container {
  height: 70%;
  width: 30%;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 0;
}

.input__container {
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.router-link {
  margin-top: 2rem;
  color: white;
}

h1 {
  background: #5136ff;
  text-align: center;
  color: white;
}

img {
  width: 100px;
  height: 100px;
}

label {
  color: white;
  padding-left: 1rem;
}

.container-error {
  height: fit-content;
  width: 250px;

  margin: 1.5rem;
  padding: 1rem;

  position: absolute;
  top: 0;
  right: 0;

  border-radius: 0.3rem;

  line-height: 2rem;

  background-color: #c23834;
  color: white;
}

.container-error p {
  line-height: 1.5rem;
}

.container-error img {
  width: 30px;
  height: 30px;
}

.create__form {
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-rows: 90% 10%;
}

.create__input {
  height: 3rem;
  width: 100%;

  color: white;

  border-bottom: 2px #ffad37 solid;

  padding-left: 1.5rem;
  padding-right: 1rem;

  font-size: 1.2rem;

  display: flex;
  align-items: center;
  justify-content: center;
}

.create__input:focus {
  border-bottom: 2px #5136ff solid;
}

.create__input::placeholder {
  color: white;
}

.create__textarea {
  height: 7rem;
  width: 100%;

  color: white;

  border-bottom: 2px #ffad37 solid;

  padding-left: 1.5rem;
  padding-right: 1rem;

  font-size: 1.2rem;

  display: flex;
  align-items: center;
  justify-content: center;
}

.create__textarea:focus {
  border-bottom: 2px #5136ff solid;
}

.create__textarea::placeholder {
  color: white;
}

button:focus,
input:focus {
  outline: 0;
}

.login__button {
  background-color: #ffad37;
  color: white;

  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: center;
}

.login__button:hover {
  background-color: #5136ff;
}
</style>