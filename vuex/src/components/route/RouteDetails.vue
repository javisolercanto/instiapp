<template>
  <section v-if="data.route.id" class="route">
    <section class="route__header">
      <section class="box  shadow  route__title">
        <v-icon color="#35c25e">mdi-circle-edit-outline</v-icon>
        <span>{{data.route.title}}</span>
      </section>
      <section @click="openMap()" class="box  shadow  route__location">
        <v-icon color="#35c25e">mdi-map-marker</v-icon>
        <span v-if="data.route.location">{{data.route.location.name}} ({{data.route.location.latitude}}, {{data.route.location.longitude}})</span>
        <span v-if="!data.route.location">No location available</span>
      </section>
    </section>
    <section v-if="!reducedView" class="box  shadow  route__toolbar">
      <v-icon color="#35c25e">mdi-eye</v-icon>
      <span>It may interest you</span>
    </section>
    <section class="box  shadow  route__route">
      <section class="route__data__container">
        <section class="route__map">
          <Map :lat="data.route.location.latitude" :long="data.route.location.longitude" />
        </section>
        <section class="route__data__wrapper">
          <span class="route__price">
            {{data.route.price}}€
          </span>
          <span class="route__author">
            <v-icon color="#35c25e">mdi-clock-outline</v-icon>
            {{getDate(data.route.date)}}
          </span>
          <span class="route__author">
            <v-icon color="#35c25e">mdi-at</v-icon>
            {{data.route.user.name}}
          </span>
          <span class="route__description">{{data.route.description}}</span>
        </section>
      </section>
      <section class="route__buttons">
        <button @click="sendContactMail()" class="button  contact__button">
          Contact
        </button>
        <button v-if="$store.getters.currentUser.id !== data.route.user.id" @click="sendShareMail()" class="button  action__button" 
          @mouseover="actionOnHover = true" 
          @mouseleave="actionOnHover = false">
            <v-icon v-bind:color="actionOnHover ? '#24a146' : '#35c25e'">mdi-share-variant</v-icon>
        </button>
        <button v-if="$store.getters.currentUser.id === data.route.user.id" @click="editRoute()" class="button  action__button" 
          @mouseover="actionOnHover = true" 
          @mouseleave="actionOnHover = false">
            <v-icon v-bind:color="actionOnHover ? '#24a146' : '#35c25e'">mdi-pencil</v-icon>
        </button>
        <button v-if="$store.getters.currentUser.id === data.route.user.id" @click="deleteRoute()" class="button  action__button  action__button--red" 
          @mouseover="removeOnHover = true" 
          @mouseleave="removeOnHover = false">
            <v-icon v-bind:color="removeOnHover ? '#a52d29' : '#f23934'">mdi-delete</v-icon>
        </button>
      </section>
    </section>
    <section v-if="!reducedView" class="box  shadow  route__list">
      <RoutePreview
        :route="route"
        v-for="route in data.similarRoutes"
        v-bind:key="route.id"
      />
    </section>

    <ErrorContainer @clear-errors="clearErrors()" :errors="errors" />

  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import RouteService from "../../common/services/route/route.service";
import FabTypeEnum from "../../common/services/FabTypesEnum";
import store, { storeTypes, Route, User } from "../../store"


import RoutePreview from "./RoutePreview.vue";
import Fab from "../shared/Fab.vue";
import Map from "../shared/Map.vue";
import ErrorContainer from "../shared/ErrorContainer.vue";


@Component({
  name: "routeDetails",
  components: {
    RoutePreview,
    Fab,
    Map,
    ErrorContainer
  },
})
export default class RouteDetails extends Vue {
  constructor() {
    super();
  }

  actionOnHover: boolean = false;
  removeOnHover: boolean = false;
  reducedView: boolean = false;
  FabTypeEnum: any = FabTypeEnum;
  errors: string[] = [];

  data = {
    route: {} as Route,
    similarRoutes: [] as Route[],
    currentUser: {} as User,
  };

  beforeDestroy() {
    this.data.route = {} as Route;
    this.data.currentUser = {} as User;
  }

  mounted() {
    this.data.currentUser = store.getters.currentUser;

    if (this.$route.params.id) {
      RouteService.get(this.$route.params.id).then((res) => {
        if (res.data) {
          this.data.route = res.data;
          console.log(this.data.currentUser);
          console.log(this.data.route);
          
          if (!this.reducedView) {
            this.listRoutes();
          }
        }
      });
    }

    window.addEventListener("resize", this.checkView);
    this.checkView();
  }

  checkView() {
    this.reducedView = screen.width <= 900;
    this.listRoutes();
  }

  listRoutes(): void {
    const filters = {
      location: this.data.route.location ? this.data.route.location.id : 2,
      page: 0,
      size: 1,
      order: "updatedAt",
      direction: "DESC"
    }

    RouteService.list(filters)
      .then(res => {
        this.data.similarRoutes = res.data.data;
      })
      .catch(err => this.errors.push(err.response.data.error));
  }

  openMap() {
    window.open(`https://maps.google.com/?q=${this.data.route.location.latitude},${this.data.route.location.longitude}`)
  }

  getDate(input): string {
    let date = new Date(input);
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} 
      ${date.getUTCHours().toString().length === 1
      ? '0'+date.getUTCHours().toString()
      : date.getUTCHours()}:${date.getMinutes().toString().length === 1
      ? '0'+date.getMinutes().toString()
      : date.getUTCMinutes()}`;
  }

  sendContactMail() {
    const subject = `I'm interested in your route: ${this.data.route.title}`;
    const body = `Hi, ${subject}. Could you please give me more information about it?`;

    window.open(`mailto:${this.data.route.user.email}?subject=${subject}&body=${body}`);
  }

  sendShareMail() {
    const subject = `Hey! This could interest you: ${this.data.route.title}`;
    const body = `Hi, ${subject}. How about to take a look?`;

    window.open(`mailto:?subject=${subject}&body=${body}`);
  } 

  editRoute() {
    this.$router.push({ name: "route-editor", params: {id: this.data.route.id.toString()} });
  }

  deleteRoute() {
    if (this.data.route) {
      RouteService.delete(this.data.route.id).then((res) => {
        this.$router.push({ path: "/app/route" });
      });
    }
  }

  clearErrors() {
    this.errors = [];
  }
}
</script>

<style>
.route {
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
    "route route list"
    "route route list";
}

.route__header {
  grid-area: header;

  display: flex;
  justify-content: start;
}

.route__title {
  grid-area: title;

  width: fit-content;
  font-weight: bold;

  padding: 0 2vh 0 2vh;
  font-size: 150%;

  display: flex;
  flex-direction: row;
  align-items: center;
}

.route__location {
  grid-area: location;

  width: fit-content;
  font-weight: bold;

  margin-left: 20px;
  padding: 0 2vh 0 2vh;
  font-size: 120%;

  display: flex;
  flex-direction: row;
  align-items: center;

  cursor: pointer;
}

.route__toolbar span,
.route__title span,
.route__location span {
  margin-left: 10px;
}

.route__toolbar {
  grid-area: toolbar;

  font-weight: bold;

  width: fit-content;
  padding: 0 2vh 0 2vh;
  font-size: 20px;

  display: flex;
  flex-direction: row;
  align-items: center;
}

.route__route {
  grid-area: route;

  height: 100%;
  padding: 3vh;

  display: flex;
  justify-content: center;
  align-self: center;
  flex-direction: column;
}

.route__data__container {
  height: 80%;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}

.route__data__wrapper {
  height: 100%;
  width: 50%;

  padding: 3vh;

  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
}

.route__map {
  height: 100%;
  width: 50%;

  display: grid;
  grid-template-rows: 100%;
}

.route__map iframe {
  min-width: 100%;
  height: 100%;
}

.route__buttons {
  height: 20%;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.route__img__wrapper {
  height: 100%;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.route__description {
  text-align: justify;
}

.route__date {
  margin-top: 20px;
  text-align: start;
  color: #5e5e5e;
  font-size: 14px;
}

.route__author {
  margin-top: 5px;
  margin-bottom: 10px;
  text-align: start;
  color: #5e5e5e;
}

.route__price {
  font-weight: bold;
  font-size: 6rem;

  color: var(--primary-color);
}

.route__route img {
  max-width: 50%;
  max-height: 50%;
}

.route__list {
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
  .route {
    width: 99%;


    grid-template-columns: 1fr 1fr 0;
    align-items: center;
  }
}

@media screen and (max-width: 500px) {
  .route__data__container {
    flex-direction: column;
  }

  .route__data__wrapper {
    justify-content: center;
  }
}

</style>