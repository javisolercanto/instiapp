<template>
  <section class="preview  shadow">
    <span v-bind:style="{fontSize: rental.price.toString().length > 1 ? 120/rental.price.toString().length + 'px' : '80px'}"
      class="preview__price ">{{rental.price}}€</span>
    
    <span v-bind:style="{fontSize: getNameSize(30, 'title')}" class="preview__name">{{rental.title}}</span>
    <p @click="openMap()">
      <v-icon color="#35c25e" small>mdi-map-marker</v-icon>
      <span v-bind:style="{fontSize: getNameSize(15, 'location', 'name')}" class="preview__location">{{rental.location.name}}</span>
      <br>
      <span v-bind:style="{fontSize: '12px'}" class="preview__location">
        ({{rental.location.latitude}}, {{rental.location.longitude}})
      </span>
    </p>

    <section>
      <v-icon color="#35c25e" small>mdi-calendar</v-icon>
      <span class="preview__date">{{getDate()}}</span>
      <button style="margin-top: 5px" class="button" @click="() => {
        $router.push({name: 'rental-details', params: { id: rental.id }})}">See more</button>
    </section>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import store, { storeTypes, Rental } from "../../store";
import { Route } from "vue-router";

@Component({
  name: "rentalPreview",
})
export default class RentalPreview extends Vue {

@Prop({required: true, type: Object as () => Rental}) readonly rental: Rental;

  constructor() {
    super();
  }

  getNameSize(originalSize, field, secondField): string {
    const attr = secondField ? this.rental[field][secondField] : this.rental[field];
    if (attr.length > 15 && attr.length <= 80)
      originalSize = 600/attr.length;

    if (attr.length > 80) {
      originalSize = 15;
    }

    return originalSize + 'px';
  }

  openMap() {
    window.open(`https://maps.google.com/?q=${this.rental.location.latitude},${this.rental.location.longitude}`)
  }

  getDate(): string {
    let date = new Date(this.rental.updatedAt);
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
  }
}
</script>

<style>
.preview {
  height: 300px;
  width: 250px;

  border-radius: 7px;
  background-color: white;

  overflow: hidden;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 2vh;
  cursor: pointer;
}

.preview__price {
  font-size: 50px;
  font-weight: bold;
  color: var(--primary-color);
}

.preview__name {
  color: #474747;
  font-weight: bold;
  font-size: 30px;
}

.preview__location {
  color: #8a8a8a;
  font-weight: bold;
  font-size: 10px;
}

.preview__date {
  font-size: 12px;
  color: var(--primary-color);
}
</style>