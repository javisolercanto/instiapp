<template>
  <section class="editor">
    <form @submit="handleRental" class="shadow  editor__form">
      <section class="input__wrapper">
        <label for="title">Title:</label>
        <input
          class="input"
          v-model="data.rental.title"
          type="text"
          name="title"
          required
        />
      </section>
      <section class="input__wrapper">
        <label for="name">Description:</label>
        <input
          class="input"
          v-model="data.rental.description"
          type="text"
          name="description"
          required
        />
      </section>
      <section class="input__wrapper">
        <label for="name">Price €:</label>
        <input
          class="input"
          v-model="data.rental.price"
          type="number"
          name="price"
          step="0.01"
          min="0"
          max="999"
          required
        />
      </section>
      <section class="input__wrapper">
        <label for="name">Location:</label>
        <input class="input" v-model="data.rental.locationId" list="location">
        <datalist name="location" id="location">
          <option v-bind:value="null">All locations</option>
          <option 
            v-for="location in data.locations"
            v-bind:key="location.id"
            v-bind:value="location.id">{{location.name}}
          </option>
        </datalist>
      </section>
      <button type="submit" class="button">{{editMode ? 'Save' : 'Post'}} rental</button>
    </form>

    <ErrorContainer @clear-errors="clearErrors" :errors="errors"/>

  </section>
</template>

<script lang="ts">
import Vue from "vue";

import Component from "vue-class-component";
import { Route } from "vue-router";
import ApiService from "../../common/services/api.service";
import store, { Location, Rental } from "../../store";
import RentalService from "../../common/services/rental/rental.service";
import LocationService from "../../common/services/location/location.service";

import ErrorContainer from "../shared/ErrorContainer.vue";

@Component({
  name: "rentalEditor",
  components: {
    ErrorContainer
  },
})
export default class RentalEditor extends Vue {
  constructor() {
    super();
  }

  data = {
    rental: {} as Rental,
    locations: [] as Location[]
  };

  errors: string[] = [];
  editMode: boolean = false;

  beforeDestroy() {
    this.data.rental = {} as Rental;
  }

  mounted() {
    LocationService.list()
      .then(res => this.data.locations = res.data.data)
      .catch(err => this.errors = err);
    
    if (this.$route.params.id) {
      RentalService.get(this.$route.params.id)
        .then((res) => {
          if (res.data) {
            this.editMode = true;
            this.data.rental = res.data;
          }
        }
      );
    }
  }

  handleRental(e) {
    e.preventDefault();

    if (this.editMode) {
      RentalService.update(this.data.rental.id, this.data.rental)
        .then(res => {
          if (res.data)
            this.$router.push({name: 'rental-details', params: { id: this.data.rental.id.toString() }})
        })
        .catch(err => this.errors.push(err.response.data.error))

    } else {
      RentalService.create(this.data.rental)
        .then(res => {
          if (res.data)
            this.$router.push({ name: "rental", params: { id: res.data.id } });
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