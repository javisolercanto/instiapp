<template>
  <section class="editor">
    <form @submit="handleGroup" class="shadow  editor__form">
      <section class="input__wrapper">
        <label for="name">Name:</label>
        <input
          class="input"
          v-model="data.group.name"
          type="text"
          name="name"
          required
        />
      </section>
      <section class="input__wrapper">
        <label for="description">Description:</label>
        <input
          class="input"
          v-model="data.group.description"
          type="text"
          name="description"
          required
        />
      </section>
      <section class="triple__input__wrapper">
        <section style="width: 40%">
          <label for="name">Location:</label>
          <input class="input" v-model="data.group.locationId" list="location">
          <datalist name="location" id="location">
            <option v-bind:value="null">All locations</option>
            <option
              v-for="location in data.locations"
              v-bind:key="location.id"
              v-bind:value="location.id">{{location.name}}
            </option>
          </datalist>
        </section>
        <section style="width: 40%">
          <label for="price">Price €:</label>
          <input
            class="input"
            v-model="data.group.price"
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
        <section class="days__wrapper">
          <section class="day__container">
            <label for="mon">Mon</label>
            <input v-model="data.activeDays[0]" type="checkbox" name="mon" id="mon">
          </section>
          <section class="day__container">
            <label for="tue">Tue</label>
            <input v-model="data.activeDays[1]" type="checkbox" name="tue" id="tue">
          </section>
          <section class="day__container">
            <label for="wed">Wed</label>
            <input v-model="data.activeDays[2]" type="checkbox" name="wed" id="wed">
          </section>
          <section class="day__container">
            <label for="thu">Thu</label>
            <input v-model="data.activeDays[3]" type="checkbox" name="thu" id="thu">
          </section>
          <section class="day__container">
            <label for="fri">Fri</label>
            <input v-model="data.activeDays[4]" type="checkbox" name="fri" id="fri">
          </section>
        </section>
      </section>
      <button type="submit" class="button">{{editMode ? 'Save' : 'Post'}} group</button>
    </form>

    <ErrorContainer @clear-errors="clearErrors" :errors="errors"/>

  </section>
</template>

<script lang="ts">
import Vue from "vue";

import Component from "vue-class-component";
import { Route } from "vue-router";
import ApiService from "../../common/services/api.service";
import store, { Location, Group } from "../../store";
import GroupService from "../../common/services/group/group.service";
import LocationService from "../../common/services/location/location.service";

import ErrorContainer from "../shared/ErrorContainer.vue";

const BOOLEAN_TO_STRING = 0;
const STRING_TO_BOOLEAN = 1;

@Component({
  name: "groupEditor",
  components: {
    ErrorContainer
  },
})
export default class GroupEditor extends Vue {
  constructor() {
    super();
  }

  data = {
    group: {} as Group,
    activeDays: [false, false, false, false, false] as boolean[],
    locations: [] as Location[]
  };

  errors: string[] = [];
  editMode: boolean = false;

  beforeDestroy() {
    this.data.group = {} as Group;
  }

  mounted() {
    LocationService.list()
      .then(res => this.data.locations = res.data.data)
      .catch(err => this.errors = err);
    
    if (this.$route.params.id) {
      GroupService.get(this.$route.params.id)
        .then((res) => {
          if (res.data) {
            this.editMode = true;
            this.data.group = res.data;
            this.loadActiveDays(STRING_TO_BOOLEAN);
          }
        }
      );
    }
  }

  handleGroup(e) {
    e.preventDefault();

    this.loadActiveDays(BOOLEAN_TO_STRING);
    if (this.editMode) {
      GroupService.update(this.data.group.id, this.data.group)
        .then(res => {
          if (res.data)
            this.$router.push({name: 'group-details', params: { id: this.data.group.id.toString() }})
        })
        .catch(err => this.errors.push(err.response.data.error))

    } else {
      GroupService.create(this.data.group)
        .then(res => {
          if (res.data)
            this.$router.push({ name: "group", params: { id: res.data.id } });
        })
        .catch(err => this.errors.push(err.response.data.error))
    }
  }

  loadActiveDays(mode: number) {
    if (mode === STRING_TO_BOOLEAN) {
      this.data.activeDays = [];
      this.data.group.days.split('').map(day => this.data.activeDays.push(parseInt(day) === 1 ? true : false))
    }

    if (mode === BOOLEAN_TO_STRING) {
      this.data.group.days = '';
      this.data.activeDays.map(day => this.data.group.days += day ? '1' : '0');
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

.days__wrapper{
  width: 100%;
  
  display: flex;
  align-items: center;
  justify-content: space-between;
} 

.day__container {
  width: fit-content;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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