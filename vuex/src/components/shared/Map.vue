<template>
  <section>
    <iframe id="gmap_canvas"
      v-bind:src="`https://maps.google.com/maps?q=${lat},${long}&ie=UTF8&iwloc=&output=embed`" 
      frameborder="0" scrolling="yes" marginheight="0" marginwidth="0">
    </iframe>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
  name: "map",
})
export default class Map extends Vue {
  @Prop({ required: true, type: String }) lat: string;
  @Prop({ required: true, type: String }) long: string;

  constructor() {
    super();
  }

  @Watch("lat")
  onChangeLat(lat: string, oldValue: string) {
    this.lat = lat;
  }

  @Watch("long")
  onChangeLong(long: string, oldValue: string) {
    this.long = long;
  }

}
</script>

<style>
</style>