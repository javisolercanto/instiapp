<template>
  <section class="preview  shadow">
    <span v-bind:style="{fontSize: group.price.toString().length > 1 ? 120/group.price.toString().length + 'px' : '70px'}"
      class="preview__price">{{group.price}}€</span>
    
    <span v-bind:style="{fontSize: getNameSize(30, 'name')}" class="preview__name">{{group.name}}</span>

    <section class="group__data">
      <section v-if="group.location" @click="openMap()">
        <v-icon color="#35c25e" small>mdi-map-marker</v-icon>
        <span v-bind:style="{fontSize: getNameSize(15, 'location', 'name')}" class="preview__disclaimer">{{group.location.name}}</span>
        <br>
        <span v-bind:style="{fontSize: '12px'}" class="preview__disclaimer">
          ({{group.location.latitude}}, {{group.location.longitude}})
        </span>
      </section>

      <section>
        <v-icon color="#35c25e" small>mdi-account-multiple</v-icon>
        <span v-bind:style="{fontSize: '14px'}" class="preview__disclaimer">{{group.belongs.length+1}}</span>
      </section>

      <section>
        <v-icon color="#35c25e" small>mdi-calendar</v-icon>
        <span v-bind:style="{fontSize: '14px'}" class="preview__disclaimer">{{getDays()}}</span>
      </section>
    </section>

    <section>
      <button style="margin-top: 5px" class="button" @click="() => {
        $router.push({name: 'group-details', params: { id: group.id }})}">See more</button>
    </section>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import store, { storeTypes, Group } from "../../store";
import { Route } from "vue-router";

@Component({
  name: "groupPreview",
})
export default class GroupPreview extends Vue {

@Prop({required: true, type: Object as () => Group}) readonly group: Group;

  constructor() {
    super();
  }

  getNameSize(originalSize, field, secondField): string {
    const attr = secondField ? this.group[field][secondField] : this.group[field];
    if (attr.length > 15 && attr.length <= 80)
      originalSize = 600/attr.length;

    if (attr.length > 80) {
      originalSize = 15;
    }

    return originalSize + 'px';
  }

  openMap() {
    window.open(`https://maps.google.com/?q=${this.group.location.latitude},${this.group.location.longitude}`)
  }

  getDays(): string {
    let days = '';
    this.group.days.split('').map((day, index) => {
      if (parseInt(day) === 1) {
        switch (index) {
          case 0: days += 'Mon '; break;
          case 1: days += 'Tue '; break;
          case 2: days += 'Wed '; break;
          case 3: days += 'Thu '; break;
          case 4: days += 'Fri'; break;
        }
      }
    });
    return days;
  }

  getDate(): string {
    let date = new Date(this.group.updatedAt);
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

.preview__disclaimer {
  color: #8a8a8a;
  font-weight: bold;
  font-size: 10px;
}

.group__data {
  width: 100%;
  height: 100px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
}

.group__data section {
  width: 100%;
}

.preview__date {
  font-weight: bold;
  color: var(--primary-color);
}

</style>