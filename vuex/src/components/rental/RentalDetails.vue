<template>
  <section v-if="data.rental.id" class="rental">
    <section class="rental__header">
      <section class="box  shadow  rental__title">
        <v-icon color="#35c25e">mdi-circle-edit-outline</v-icon>
        <span>{{data.rental.title}}</span>
      </section>
      <section @click="openMap()" class="box  shadow  rental__location">
        <v-icon color="#35c25e">mdi-map-marker</v-icon>
        <span>{{data.rental.location.name}} ({{data.rental.location.latitude}}, {{data.rental.location.longitude}})</span>
      </section>
    </section>
    <section v-if="!reducedView" class="box  shadow  rental__toolbar">
      <v-icon color="#35c25e">mdi-eye</v-icon>
      <span>It may interest you</span>
    </section>
    <section class="box  shadow  rental__rental">
      <section class="rental__data__container">
        <section class="rental__map">
          <Map :lat="data.rental.location.latitude" :long="data.rental.location.longitude" />
        </section>
        <section class="rental__data__wrapper">
          <span class="rental__price">
            {{data.rental.price}}€
          </span>
          <span class="rental__author">
            <v-icon color="#35c25e">mdi-at</v-icon>
            {{data.rental.user.name}} (@{{data.rental.user.username}})
          </span>
          <span class="rental__description">{{data.rental.description}}</span>
        </section>
      </section>
      <section class="rental__buttons">
        <button @click="sendContactMail()" class="button  contact__button">
          Contact
        </button>
        <button v-if="$store.getters.currentUser.id !== data.rental.user.id" @click="sendShareMail()" class="button  action__button" 
          @mouseover="actionOnHover = true" 
          @mouseleave="actionOnHover = false">
            <v-icon v-bind:color="actionOnHover ? '#24a146' : '#35c25e'">mdi-share-variant</v-icon>
        </button>
        <button v-if="$store.getters.currentUser.id === data.rental.user.id" @click="editRental()" class="button  action__button" 
          @mouseover="actionOnHover = true" 
          @mouseleave="actionOnHover = false">
            <v-icon v-bind:color="actionOnHover ? '#24a146' : '#35c25e'">mdi-pencil</v-icon>
        </button>
        <button v-if="$store.getters.currentUser.id === data.rental.user.id" @click="deleteRental()" class="button  action__button  action__button--red" 
          @mouseover="removeOnHover = true" 
          @mouseleave="removeOnHover = false">
            <v-icon v-bind:color="removeOnHover ? '#a52d29' : '#f23934'">mdi-delete</v-icon>
        </button>
      </section>
    </section>
    <section v-if="!reducedView" class="box  shadow  rental__list">
      <RentalPreview
        :rental="rental"
        v-for="rental in data.similarRentals"
        v-bind:key="rental.id"
      />
    </section>

    <ErrorContainer @clear-errors="clearErrors()" :errors="errors" />

  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import RentalService from "../../common/services/rental/rental.service";
import FabTypeEnum from "../../common/services/FabTypesEnum";
import store, { storeTypes, Rental, User } from "../../store"


import RentalPreview from "./RentalPreview.vue";
import Fab from "../shared/Fab.vue";
import Map from "../shared/Map.vue";
import ErrorContainer from "../shared/ErrorContainer.vue";


@Component({
  name: "rentalDetails",
  components: {
    RentalPreview,
    Map,
    Fab,
    ErrorContainer
  },
})
export default class RentalDetails extends Vue {
  constructor() {
    super();
  }

  actionOnHover: boolean = false;
  removeOnHover: boolean = false;
  reducedView: boolean = false;
  FabTypeEnum: any = FabTypeEnum;
  errors: string[] = [];

  data = {
    rental: {} as Rental,
    similarRentals: [] as Rental[],
    currentUser: {} as User,
  };

  beforeDestroy() {
    this.data.rental = {} as Rental;
    this.data.currentUser = {} as User;
  }

  mounted() {
    this.data.currentUser = store.getters.currentUser;

    if (this.$route.params.id) {
      RentalService.get(this.$route.params.id).then((res) => {
        if (res.data) {
          this.data.rental = res.data;
          console.log(this.data.currentUser);
          console.log(this.data.rental);
          
          if (!this.reducedView) {
            this.listRentals();
          }
        }
      });
    }

    window.addEventListener("resize", this.checkView);
    this.checkView();
  }

  checkView() {
    this.reducedView = screen.width <= 900;
    this.listRentals();
  }

  listRentals(): void {
    const filters = {
      location: this.data.rental.location ? this.data.rental.location.id : 2,
      page: 0,
      size: 1,
      order: "updatedAt",
      direction: "DESC"
    }

    RentalService.list(filters)
      .then(res => {
        this.data.similarRentals = res.data.data;
      })
      .catch(err => this.errors.push(err.response.data.error));
  }

  openMap() {
    window.open(`https://maps.google.com/?q=${this.data.rental.location.latitude},${this.data.rental.location.longitude}`)
  }

  getDate(): string {
    let date = new Date(this.data.rental.updatedAt);
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
  }

  sendContactMail() {
    const subject = `I'm interested in your rental: ${this.data.rental.title}`;
    const body = `Hi, ${subject}. Could you please give me more information about it?`;

    window.open(`mailto:${this.data.rental.user.email}?subject=${subject}&body=${body}`);
  }

  sendShareMail() {
    const subject = `Hey! This could interest you: ${this.data.rental.title}`;
    const body = `Hi, ${subject}. How about to take a look?`;

    window.open(`mailto:?subject=${subject}&body=${body}`);
  } 

  editRental() {
    this.$router.push({ name: "rental-editor", params: {id: this.data.rental.id.toString()} });
  }

  deleteRental() {
    if (this.data.rental) {
      RentalService.delete(this.data.rental.id).then((res) => {
        this.$router.push({ path: "/app/rental" });
      });
    }
  }

  clearErrors() {
    this.errors = [];
  }
}
</script>

<style>
.rental {
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
    "rental rental list"
    "rental rental list";
}

.rental__header {
  grid-area: header;

  display: flex;
  justify-content: start;
}

.rental__title {
  grid-area: title;

  width: fit-content;
  font-weight: bold;

  padding: 0 2vh 0 2vh;
  font-size: 150%;

  display: flex;
  flex-direction: row;
  align-items: center;
}

.rental__location {
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

.rental__toolbar span,
.rental__title span,
.rental__location span {
  margin-left: 10px;
}

.rental__toolbar {
  grid-area: toolbar;

  font-weight: bold;

  width: fit-content;
  padding: 0 2vh 0 2vh;
  font-size: 20px;

  display: flex;
  flex-direction: row;
  align-items: center;
}

.rental__rental {
  grid-area: rental;

  height: 100%;
  padding: 3vh;

  display: flex;
  justify-content: center;
  align-self: center;
  flex-direction: column;
}

.rental__data__container {
  height: 100%;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
}

.rental__buttons {
  height: 20%;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rental__data__wrapper {
  height: 100%;
  width: 50%;

  padding: 3vh;

  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
}

.rental__map {
  height: 100%;
  width: 50%;

  display: grid;
  grid-template-rows: 100%;
}

.rental__map iframe {
  min-width: 100%;
  height: 100%;
}

.rental__description {
  text-align: justify;
}

.rental__date {
  margin-top: 20px;
  text-align: start;
  color: #5e5e5e;
  font-size: 14px;
}

.rental__author {
  margin-top: 5px;
  margin-bottom: 10px;
  text-align: start;
  color: #5e5e5e;
}

.rental__price {
  font-weight: bold;
  font-size: 6rem;

  color: var(--primary-color);
}

.rental__rental img {
  max-width: 50%;
  max-height: 50%;
}

.rental__list {
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
  .rental {
    width: 99%;


    grid-template-columns: 1fr 1fr 0;
    align-items: center;
  }
}

@media screen and (max-width: 500px) {
  .rental__data__container {
    flex-direction: column;
  }

  .rental__data__wrapper {
    justify-content: center;
  }
}

</style>