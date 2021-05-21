<template>
  <section @click="clearMessage()" v-if="message.length > 0" class="container-success">
    <b>Success!</b>
    <p>{{ message }}</p>
  </section>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch} from "vue-property-decorator";

@Component({
  name: "successContainer",
})
export default class SuccessContainer extends Vue {
  @Prop({ required: true, type: String }) message: string;

  constructor() {
    super();
  }

  data = {
    message: '' as string
  }

  @Watch("message")
  onChangeMessage(value: string, oldValue: string) {
    this.data.message = value;
    setTimeout(this.clearMessage, 4000);
  }

  @Emit("clear-message")
  clearMessage() {
    return [];
  }
}
</script>

<style scoped>
.container-success {
  height: fit-content;
  width: 250px;

  margin: 1.5rem;
  padding: 1rem;

  position: fixed;
  top: 0;
  right: 0;

  border-radius: 5px;

  line-height: 2rem;

  background-color: var(--primary-color);
  color: white;

  cursor: pointer;
}

.container-success p {
  line-height: 1.5rem;
}
</style>