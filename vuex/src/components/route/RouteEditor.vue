<template>
  <section class="editor">
    <form @submit="handleRoute" class="shadow  editor__form">
      <section class="input__wrapper">
        <label for="title">Title:</label>
        <input
          class="input"
          v-model="data.route.title"
          type="text"
          name="title"
          required
        />
      </section>
      <section class="input__wrapper">
        <label for="description">Description:</label>
        <input
          class="input"
          v-model="data.route.description"
          type="text"
          name="description"
          required
        />
      </section>
      <section class="triple__input__wrapper">
        <section style="width: 40%">
          <label for="name">Location:</label>
          <input class="input" v-model="data.route.locationId" list="location">
          <datalist name="location" id="location">
            <option v-bind:value="null">All locations</option>
            <option 
              v-for="location in data.locations"
              v-bind:key="location.id"
              v-bind:value="location.id">{{location.name}}
            </option>
          </datalist>
        </section>
        <section style="width: 20%">
          <label for="seats">Seats:</label>
          <input
            class="input"
            v-model="data.route.seats"
            type="number"
            name="seats"
            min="1"
            max="30"
            required
          />
        </section>
        <section style="width: 20%">
          <label for="price">Price €:</label>
          <input
            class="input"
            v-model="data.route.price"
            type="number"
            name="price"
            step="0.01"
            min="0"
            max="999"
            required
          />
        </section>
      </section>
      <section class="input__wrapper">
        <label for="date">Date:</label>
        <input
          class="input"
          v-model="data.routeDate"
          name="date"
          type="datetime-local"
          required
        />
      </section>
      <button type="submit" class="button">{{editMode ? 'Save' : 'Post'}} route</button>
    </form>

    <ErrorContainer @clear-errors="clearErrors" :errors="errors"/>

  </section>
</template>

<script lang="ts">
import Vue from "vue";

import Component from "vue-class-component";
import { Route } from "vue-router";
import ApiService from "../../common/services/api.service";
import store, { Location, Route as RouteModel } from "../../store";
import RouteService from "../../common/services/route/route.service";
import LocationService from "../../common/services/location/location.service";

import ErrorContainer from "../shared/ErrorContainer.vue";

@Component({
  name: "routeEditor",
  components: {
    ErrorContainer
  },
})
export default class RouteEditor extends Vue {
  constructor() {
    super();
  }

  data = {
    route: {} as RouteModel,
    routeDate: '' as string,
    locations: [] as Location[]
  };

  errors: string[] = [];
  editMode: boolean = false;

  beforeDestroy() {
    this.data.route = {} as RouteModel;
  }

  mounted() {
    LocationService.list()
      .then(res => this.data.locations = res.data.data)
      .catch(err => this.errors = err);
    
    if (this.$route.params.id) {
      RouteService.get(this.$route.params.id)
        .then((res) => {
          if (res.data) {
            this.editMode = true;
            this.data.route = res.data;
            this.data.routeDate = this.data.route.date.toString().substring(0, this.data.route.date.toString().length-8);
          }
        }
      );
    }
  }

  handleRoute(e) {
    e.preventDefault();

    this.data.route.date = new Date(this.data.routeDate);
    if (this.editMode) {
      RouteService.update(this.data.route.id, this.data.route)
        .then(res => {
          if (res.data)
            this.$router.push({name: 'route-details', params: { id: this.data.route.id.toString() }})
        })
        .catch(err => this.errors.push(err.response.data.error))

    } else {
      RouteService.create(this.data.route)
        .then(res => {
          if (res.data)
            this.$router.push({ name: "route", params: { id: res.data.id } });
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

.triple__input__wrapper {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.double__input__wrapper section {
  width: 45%;
}

.input__wrapper {
  width: 100%;
}

</style>