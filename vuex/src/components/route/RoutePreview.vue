<template>
  <section class="preview  shadow">
    <span v-bind:style="{fontSize: route.price.toString().length > 1 ? 120/route.price.toString().length + 'px' : '70px'}"
      class="preview__price">{{route.price}}€</span>
    
    <span v-bind:style="{fontSize: getNameSize(30, 'title')}" class="preview__name">{{route.title}}</span>

    <section class="route__data">
      <section v-if="route.location" @click="openMap()">
        <v-icon color="#35c25e" small>mdi-map-marker</v-icon>
        <span v-bind:style="{fontSize: getNameSize(15, 'location', 'name')}" class="preview__disclaimer">{{route.location.name}}</span>
        <br>
        <span v-bind:style="{fontSize: '12px'}" class="preview__disclaimer">
          ({{route.location.latitude}}, {{route.location.longitude}})
        </span>
      </section>

      <section>
        <v-icon color="#35c25e" small>mdi-clock-outline</v-icon>
        <span v-bind:style="{fontSize: '14px'}" class="preview__disclaimer">{{getDate(route.date)}}</span>
      </section>
      
      <section>
        <v-icon color="#35c25e" small>mdi-seat-recline-normal</v-icon>
        <span v-bind:style="{fontSize: '14px'}" class="preview__disclaimer">{{route.seats}}</span>
      </section>
    </section>

    <section>
      <button style="margin-top: 5px" class="button" @click="() => {
        $router.push({name: 'route-details', params: { id: route.id }})}">See more</button>
    </section>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import store, { storeTypes, Route as RouteModel } from "../../store";
import { Route } from "vue-router";

@Component({
  name: "routePreview",
})
export default class RoutePreview extends Vue {

@Prop({required: true, type: Object as () => RouteModel}) readonly route: RouteModel;

  constructor() {
    super();
  }

  getNameSize(originalSize, field, secondField): string {
    const attr = secondField ? this.route[field][secondField] : this.route[field];
    if (attr.length > 15 && attr.length <= 80)
      originalSize = 600/attr.length;

    if (attr.length > 80) {
      originalSize = 15;
    }

    return originalSize + 'px';
  }

  openMap() {
    window.open(`https://maps.google.com/?q=${this.route.location.latitude},${this.route.location.longitude}`)
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

.preview__disclaimer {
  color: #8a8a8a;
  font-weight: bold;
  font-size: 10px;
}

.route__data {
  width: 100%;
  height: 100px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
}

.route__data section {
  width: 100%;
}

.preview__date {
  font-weight: bold;
  color: var(--primary-color);
}

</style>