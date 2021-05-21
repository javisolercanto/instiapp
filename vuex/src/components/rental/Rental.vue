<template>
  <section class="market">
    <section class="market__searchbar shadow">
      <input
        v-model="data.filters.title"
        class="input"
        type="text"
        name="search"
        placeholder="Search"
        @keyup="listRentals()"
      />
    </section>
    <section class="market__filters shadow">
      <section class="market__filters__wrapper">
        <label for="location">Select location:</label>
        <select v-model="data.filters.location" @change="listRentals()" 
          class="input" name="location" id="location">
          <option disabled selected>Location</option>
          <option v-bind:value="null">All locations</option>
          <option 
            v-for="location in data.locations"
            v-bind:key="location.id"
            v-bind:value="location.id">{{location.name}} ({{location.latitude}},{{location.longitude}})
          </option>
        </select>
      </section>
      <section class="market__filters__wrapper">
        <label for="order">Order by:</label>
        <select v-model="data.selectedOrder" @change="listRentals()"
          class="input" name="order" id="order">
          <option disabled selected>Order by</option>
          <option v-bind:value="{order: 'price', direction: 'DESC'}">Price ↓</option>
          <option v-bind:value="{order: 'price', direction: 'ASC'}">Price ↑</option>
          <option v-bind:value="{order: 'updatedAt', direction: 'DESC'}">Release date ↓</option>
          <option v-bind:value="{order: 'updatedAt', direction: 'ASC'}">Release date ↑</option>
          <option v-bind:value="{order: 'name', direction: 'DESC'}">Alphabetical ↓</option>
          <option v-bind:value="{order: 'name', direction: 'ASC'}">Alphabetical ↑</option>
        </select>
      </section>
      <section class="market__filters__wrapper">
        <label class="market__filters__price__label" for="price">Max. Price: 
          <input 
            class="market__filters__price__input"
            type="number" min="0" max="999"
            v-model="data.filters.price"
            @keyup="listRentals()" />
        €</label>
        <input
          v-model="data.filters.price"
          class="slider"
          name="price"
          id="price"
          type="range"
          min="0"
          max="900"
          @change="listRentals()"
        />
      </section>
      <section class="market__filters__wrapper  market__filters__wrapper--horizontal">
        <label class="market__filters__price__label" for="price">Show my rentals:</label>
        <input
          v-model="data.ownerChecked"
          name="owner"
          id="owner"
          type="checkbox"
          @change="listRentals()"
        />
      </section>
    </section>
    <section ref="list" class="market__list">
      <RentalPreview
        :rental="rental"
        v-for="rental in data.rentals"
        v-bind:key="rental.id"
      />
    </section>
    <section class="market__pagination shadow">
      <Pagination :currentPage="data.currentPage" :totalPages="data.totalPages" @change-page="onChangePage($event)"/>
    </section>

    <Fab @click.native="$router.push({name: 'rental-creator'})" :type="FabTypeEnum.ADD" />
    <ErrorContainer @clear-errors="clearErrors" :errors="errors"/>

  </section>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import store, { storeTypes, Rental, Location, User } from "../../store";
import { Route } from "vue-router";
import FabTypeEnum from "../../common/services/FabTypesEnum";

import RentalPreview from "./RentalPreview.vue";
import Pagination from "../shared/Pagination.vue";
import Fab from "../shared/Fab.vue";
import ErrorContainer from "../shared/ErrorContainer.vue";

import RentalService from "../../common/services/rental/rental.service";
import LocationService from "../../common/services/location/location.service";

@Component({
  name: "rental",
  components: {
    RentalPreview,
    Pagination,
    Fab,
    ErrorContainer
  },
})
export default class Rentals extends Vue {
  data = {
    filters: {
      title: "",
      location: null,
      price: 900.0,
      owner: null as Number | null,
      page: 0,
      size: 3,
      order: "",
      direction: ""
    },
    ownerChecked: false,
    selectedOrder: {
      order: "updatedAt",
      direction: "DESC"
    },
    locations: [] as Location[],
    rentals: [] as Rental[],
    totalItems: 0 as number,
    currentPage: 0 as number,
    totalPages: 0 as number,
    currentUser: {} as User,
  };
  $refs: {
    list: HTMLElement;
  };
  FabTypeEnum: any = FabTypeEnum;
  errors: string[] = [];

  constructor() {
    super();
  }

  mounted() {
    window.addEventListener("resize", this.refreshRentalsSize);
    this.refreshRentalsSize();
    LocationService.list()
      .then(res => this.data.locations = res.data.data)
      .catch(err => this.errors.push(err.response.data.error))
  }

  beforeDestroy() {
    this.data.rentals = [];
    this.data.totalItems = 0;
  }

  refreshRentalsSize() {
    setTimeout(() => {
      let width = Math.floor(this.$refs.list.clientWidth / 250);
      let height = Math.floor(this.$refs.list.clientHeight / 300);
      this.data.filters.size =
        (width > 0 ? width : 1) * (height > 0 ? height : 1);
      this.listRentals();
    }, 200);
  }

  listRentals(): void {
    this.data.filters.order = this.data.selectedOrder.order;
    this.data.filters.direction = this.data.selectedOrder.direction;
    this.data.filters.owner = this.data.ownerChecked ? store.state.currentUser.id : null;

    RentalService.list(this.data.filters)
      .then(res => {
        this.data.rentals = res.data.data;
        this.data.totalItems = res.data.totalItems;
        this.data.currentPage = res.data.currentPage;
        this.data.totalPages = res.data.totalPages;
      })
      .catch(err => this.errors.push(err.response.data.error));
  }

  onChangePage(event) {
    if (event < 0 || event >= this.data.totalPages) {
      return;
    }

    this.data.filters.page = event;
    this.listRentals();
  }

  clearErrors(): void {
    this.errors = [];
  }
}
</script>

<style>
.market {
  height: 90%;
  width: 99%;

  margin: 1vh;
  padding: 2vh;

  display: grid;
  grid-template-columns: 270px auto auto auto;
  grid-template-rows: 70px auto 60px;
  gap: 3vh 3vh;
  grid-template-areas:
    "searchbar list list list"
    "filters list list list"
    "pagination pagination pagination pagination";
}

.market__searchbar {
  grid-area: searchbar;

  padding: 1vh 2vh 2vh 2vh;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 7px;

  background-color: white;
}

.market__filters {
  grid-area: filters;

  padding: 1vh 2vh 2vh 2vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  border-radius: 7px;

  background-color: white;
}

.market__filters__wrapper {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.market__filters__wrapper--horizontal {
  flex-direction: row;
  justify-content: start;
  align-items: center;
}

.market__filters__price__label {
  width: fit-content;
  margin-right: 10px;
}

.market__filters__price__input {
  width: 40px;
  font-size: 15px;
  border-bottom: 2px solid var(--primary-color);
}

.market__filters__wrapper label {
  font-size: 0.8rem;
  padding-left: 10px;
  padding-bottom: 5px;
  color: var(--text-color);
  font-weight: bold;
}

.market__controlpanel {
  grid-area: controlpanel;

  padding: 1vh 2vh 1vh 2vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border-radius: 7px;
}

.market__list {
  grid-area: list;

  overflow: hidden;

  padding: 0vh 0vh 0vh 0vh;

  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.market__pagination {
  grid-area: pagination;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 7px;
  background-color: white;
}

.rentals {
  height: 90%;
  width: 100%;

  padding: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.container {
  height: 80%;
  width: 100%;

  display: inline-grid;
  grid-template-columns: repeat(5, minmax(190px, 1fr));
  justify-items: center;
  align-items: center;

  overflow: hidden;
  padding: 0;
}
</style>