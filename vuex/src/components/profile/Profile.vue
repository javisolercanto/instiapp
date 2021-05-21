<template>
  <section class="profile">
    <section class="profile__data__container">
      <section class="profile__data__container__image">
        <img class="shadow" v-bind:src="data.newImage.image"
          v-bind:alt="data.currentUser.name">
        <input class="input" type="text" v-model="data.newImage.image" 
          @change="() => {data.newImage.image = data.newImage.image + '?t='}">
      </section>
      <form class="box  shadow  profile__data__container__info" @submit="handleProfile">
        <h3>Personal information</h3>
        <span>
          <v-icon color="#35c25e">mdi-at</v-icon>
          <input class="input" type="text" v-model="data.currentUser.username">
        </span>
        <span>
          <v-icon color="#35c25e">mdi-account</v-icon>
          <input class="input" type="text" v-model="data.currentUser.name">
        </span>
        <span>
          <v-icon color="#35c25e">mdi-email</v-icon>
          <input class="input" type="email" v-model="data.currentUser.email">
        </span>
        <span>
          <v-icon color="#35c25e">mdi-key-variant</v-icon>
          <input placeholder="New password" class="input" type="password" v-model="data.newPassword.password">
        </span>
        <button class="button">Save changes</button>
      </form>
    </section>
    <section class="box  shadow  profile__stats__container">
      <section class="profile__stats__container__buttons">
        <button @click="loadStats(PRODUCTS_STATS)" class="button" 
          v-bind:class="productsActive ? 'button  button--actived' : 'button'"
          @mouseover="productsOnHover = true" 
          @mouseleave="productsOnHover = false">
            <v-icon v-bind:color="productsActive || productsOnHover ? '#fff' : '#35c25e'">mdi-shopping</v-icon>
        </button>
        <button @click="loadStats(ROUTES_STATS)" class="button" 
          v-bind:class="routesActive ? 'button  button--actived' : 'button'"
          @mouseover="routesOnHover = true" 
          @mouseleave="routesOnHover = false">
            <v-icon v-bind:color="routesActive || routesOnHover ? '#fff' : '#35c25e'">mdi-car</v-icon>
        </button>
        <button @click="loadStats(GROUPS_STATS)" class="button" 
          v-bind:class="groupsActive ? 'button  button--actived' : 'button'"
          @mouseover="groupsOnHover = true" 
          @mouseleave="groupsOnHover = false">
            <v-icon v-bind:color="groupsActive || groupsOnHover ? '#fff' : '#35c25e'">mdi-account-multiple</v-icon>
        </button>
        <button @click="loadStats()" class="button" 
          v-bind:class="postsActive ? 'button  button--actived' : 'button'"
          @mouseover="postsOnHover = true" 
          @mouseleave="postsOnHover = false">
            <v-icon v-bind:color="postsActive || postsOnHover ? '#fff' : '#35c25e'">mdi-forum</v-icon>
        </button>
        <button @click="loadStats(RENTALS_STATS)" class="button" 
          v-bind:class="rentalsActive ? 'button  button--actived' : 'button'"
          @mouseover="rentalsOnHover = true" 
          @mouseleave="rentalsOnHover = false">
            <v-icon v-bind:color="rentalsActive || rentalsOnHover ? '#fff' : '#35c25e'">mdi-home-city</v-icon>
        </button>
      </section>
      <section class="profile__stats__container__list">
        <section v-if="productsActive">
          <section class="list__item" v-for="product in data.products" v-bind:key="product.id">
            <section class="item__data">
              <span>{{product.name}}</span>
              <v-icon @click="() => $router.push({name: 'product-details', params: {id: product.id}})" 
                color="#35c25e">mdi-eye</v-icon>
            </section>
            <hr class="list__separator">
          </section>
          <Spinner :loading="isLoadingStats" />
          <section v-if="data.products.length === 0 && !isLoadingStats" class="noparticipants">
            <span>You didn't post a product yet...</span>
            <button class="button" @click="() => $router.push({name: 'product-editor'})">Post a product</button>
          </section>
        </section>
        <section v-if="routesActive">
          <section class="list__item" v-for="route in data.routes" v-bind:key="route.id">
            <section class="item__data">
              <span>{{route.title}}</span>
              <v-icon @click="() => $router.push({name: 'route-details', params: {id: route.id}})" 
                color="#35c25e">mdi-eye</v-icon>
            </section>
            <hr class="list__separator">
          </section>
          <Spinner :loading="isLoadingStats" />
          <section v-if="data.routes.length === 0 && !isLoadingStats" class="noparticipants">
            <span>You didn't post a route yet...</span>
            <button class="button" @click="() => $router.push({name: 'route-editor'})">Post a route</button>
          </section>
        </section>
        <section v-if="groupsActive">
          <section class="list__item" v-for="group in data.groups" v-bind:key="group.id">
            <section class="item__data">
              <span>{{group.name}}</span>
              <v-icon @click="() => $router.push({name: 'group-details', params: {id: group.id}})" 
                color="#35c25e">mdi-eye</v-icon>
            </section>
            <hr class="list__separator">
          </section>
          <Spinner :loading="isLoadingStats" />
          <section v-if="data.groups.length === 0 && !isLoadingStats" class="noparticipants">
            <span>You didn't post a group yet...</span>
            <button class="button" @click="() => $router.push({name: 'group-editor'})">Post a group</button>
          </section>
        </section>
        <!-- forum -->
        <section v-if="rentalsActive">
          <section class="list__item" v-for="rental in data.rentals" v-bind:key="rental.id">
            <section class="item__data">
              <span>{{rental.title}}</span>
              <v-icon @click="() => $router.push({name: 'rental-details', params: {id: rental.id}})" 
                color="#35c25e">mdi-eye</v-icon>
            </section>
            <hr class="list__separator">
          </section>
          <Spinner :loading="isLoadingStats" />
          <section v-if="data.rentals.length === 0 && !isLoadingStats" class="noparticipants">
            <span>You didn't post a rental yet...</span>
            <button class="button" @click="() => $router.push({name: 'rental-editor'})">Post a rental</button>
          </section>
        </section>
      </section>
    </section>
    
    <Fab @click.native="handleAuth()" :type="FabTypeEnum.OFF" />
    <ErrorContainer @clear-errors="clearErrors()" :errors="errors" />
    <SuccessContainer @clear-message="clearMessage()" :message="message" />

  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import store, { Group, Product, Rental, storeTypes, User } from "../../store";
import { Route } from "vue-router";
import { Watch } from "vue-property-decorator";
import Spinner from "../shared/Spinner.vue";
import ErrorContainer from "../shared/ErrorContainer.vue";
import SuccessContainer from "../shared/SuccessContainer.vue";
import Fab from "../shared/Fab.vue";
import FabTypeEnum from "../../common/services/FabTypesEnum";
import ProductService from "../../common/services/product/product.service";
import RentalService from "../../common/services/rental/rental.service";
import GroupService from "../../common/services/group/group.service";
import RouteService from "../../common/services/route/route.service";
import UserService from "../../common/services/user/user.service";

@Component({
  name: "profile",
  components: {
    ErrorContainer,
    SuccessContainer,
    Fab,
    Spinner
  }
})
export default class Profile extends Vue {
  
  productsOnHover: boolean = false;
  productsActive: boolean = true;
  routesOnHover: boolean = false;
  routesActive: boolean = false;
  groupsActive: boolean = false;
  groupsOnHover: boolean = false;
  postsActive: boolean = false;
  postsOnHover: boolean = false;
  rentalsActive: boolean = false;
  rentalsOnHover: boolean = false;

  PRODUCTS_STATS: number = 0;
  ROUTES_STATS: number = 1;
  GROUPS_STATS: number = 2;
  RENTALS_STATS: number = 3;

  isLoadingStats: boolean = true;
  errors: string[] = [];
  message: string = '';
  FabTypeEnum = FabTypeEnum as any;
  
  data = {
    newPassword: { password: '' },
    newImage: { image: '' },
    currentUser: {} as User,
    products: [] as Product[],
    rentals: [] as Rental[],
    routes: [] as Route[],
    groups: [] as Group[],
  };

  constructor() {
    super();
  }

  @Watch('$store.getters.currentUser')
  onLoadUser(value: User, oldValue: any) {
    if (value) {
      this.data.currentUser = {...value}
    }
  }

  @Watch('data.currentUser')
  onSetUser(value: User, oldValue: any) {
    if (!this.data.newImage.image) {
      this.data.newImage.image = value.image
    }
  }

  mounted() {
    setTimeout(this.loadStats, 1000);
  }

  handleProfile(e) {
    e.preventDefault();

    UserService.update({...this.data.currentUser, ...this.data.newPassword, ...this.data.newImage})
      .then(res => this.message = 'Profile updated successfully')
      .catch(err => this.errors.push(err.response.data.error))
  }
  
  handleAuth() {
    if (this.data.currentUser.isAuthed) {
      store
        .dispatch(storeTypes.root.actions!.purgeAuth())
        .then((res) => this.$router.push({ path: "/login" }));
    } else {
      this.$router.push({ path: "/login" });
    }
  }
  
  async loadStats(stat: number) {
    this.isLoadingStats = true;
    this.productsActive = false;
    this.groupsActive = false;
    this.routesActive = false;
    this.rentalsActive = false;

    switch(stat) {
      case this.ROUTES_STATS: {
        this.routesActive = true;
        await RouteService.getByAuthor()
          .then(res => this.data.routes = res.data.data)
          .catch(err => this.errors.push(err.response.data.error))
        break;
      }
      case this.GROUPS_STATS: {
        this.groupsActive = true;
        await GroupService.getByAuthor()
          .then(res => this.data.groups = res.data.data)
          .catch(err => this.errors.push(err.response.data.error))
        break;
      }
      case this.RENTALS_STATS: {
        this.rentalsActive = true;
        await RentalService.getByAuthor()
          .then(res => this.data.rentals = res.data.data)
          .catch(err => this.errors.push(err.response.data.error))
        break;
      }
      case this.PRODUCTS_STATS:
      default:
        this.productsActive = true;
        await ProductService.getByAuthor()
          .then(res => this.data.products = res.data.data)
          .catch(err => this.errors.push(err.response.data.error))
    }

    this.isLoadingStats = false;
  }

  clearErrors() {
    this.errors = [];
  }

  clearMessage() {
    this.message = '';
  }
}
</script>

<style scoped>
.profile {
  height: 90%;
  width: 99%;

  display: flex;
  align-items: center;
  justify-content: center;
}

.profile__data__container {
  width: 60%;
  height: 100%;

  display: flex;
  justify-content: space-around;
  align-items: center;
}

.profile__data__container__image {
  height: 100%;
  width: 50%;

  padding: 3vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.profile__data__container__image img {
  max-width: 100%;
  max-height: 100%;

  margin-bottom: 20px;
}

.profile__data__container__info {
  height: 400px;
  width: 50%;

  padding: 3vh;

  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  flex-direction: column;
}

.profile__data__container__info span {
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
}

.profile__data__container__info i {
  margin-right: 10px;
}

.profile__stats__container {
  width: 40%;
  height: 600px;

  margin: 2vh;
  padding: 3vh;
}

.profile__stats__container__buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.profile__stats__container__buttons button {
  width: 15%;
}

</style>
