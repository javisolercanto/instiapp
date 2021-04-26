<template>
  <section @click="clearErrors()" v-if="errors.length > 0" class="container-error">
    <b>Please, check this errors:</b>
    <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
  </section>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch} from "vue-property-decorator";

@Component({
  name: "errorContainer",
})
export default class ErrorContainer extends Vue {
  @Prop({ required: true, type: Array }) errors: string[];

  constructor() {
    super();
  }

  data = {
    errors: [] as string[],
  }

  @Watch("errors")
  onChangeOffset(value: string[], oldValue: string[]) {
    this.data.errors = value;
    setTimeout(this.clearErrors, 4000);
  }

  @Emit("clear-errors")
  clearErrors() {
    return [];
  }
}
</script>

<style scoped>
.container-error {
  height: fit-content;
  width: 250px;

  margin: 1.5rem;
  padding: 1rem;

  position: fixed;
  top: 0;
  right: 0;

  border-radius: 5px;

  line-height: 2rem;

  background-color: #c23834;
  color: white;

  cursor: pointer;
}

.container-error p {
  line-height: 1.5rem;
}

.container-error img {
  width: 30px;
  height: 30px;
}
</style>