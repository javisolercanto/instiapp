<template>
  <section class="fab  shadow" v-bind:class="getFabStyle()">
    <v-icon class="icon" color="#fff">{{getFabIcon()}}</v-icon>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import FabTypeEnum from "../../common/services/FabTypesEnum";

@Component({
  name: "fab",
})
export default class Fab extends Vue {
  @Prop({ required: true, type: Number }) type: number;

  constructor() {
    super();
  }

  @Watch("type")
  onChangeType(type: number, oldValue: number) {
    this.type = type;
  }

  getFabStyle() {
    switch (this.type) {
      case FabTypeEnum.EDIT:
        return 'fab--edit';
      case FabTypeEnum.DELETE:
        return 'fab--delete';
      case FabTypeEnum.OFF:
        return 'fab--off';
      default:
        return 'fab--add';
    }
  }

  getFabIcon() {
    switch (this.type) {
      case FabTypeEnum.EDIT:
        return 'mdi-pencil';
      case FabTypeEnum.DELETE:
        return 'mdi-delete';
      case FabTypeEnum.OFF:
        return 'mdi-power';
      default:
        return 'mdi-plus';
    }
  }
}
</script>

<style>
.fab {
  width: 50px;
  height: 50px;

  border-radius: 50%;

  position: absolute;
  right: 0;
  bottom: 0;
  margin: 3rem;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
}

.fab:hover .icon {
  transform: rotate(360deg);
}

.fab--add {
  background-color: var(--primary-color);
}

.fab--edit {
  background-color: #3B52FF;
}

.fab--off,
.fab--delete {
  background-color: var(--warn-color);
}

</style>