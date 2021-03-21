<template>
  <div v-bind:class="data.isOwner ? 'msg-container  msg-container--owner' : 'msg-container'">
    <div v-bind:class="data.isOwner ? 'com-wrapper  com-wrapper--owner' : 'com-wrapper'">
      <div v-bind:class="data.isOwner ? 'com  com--owner' : 'com'">
        <div class="avatar-container">
          <img src="https://github.com/JavierSolerArtero99/DRF_VUEx/blob/master/Vuex/images/avatar.png?raw=true" alt="avatar">
        </div>
        <p>{{ comment.message }}</p>
      </div>
      <div v-bind:class="data.isOwner && 'actions-container'">
        <span>{{ comment.commentAuthor.username }}</span>
        <button @click="deleteComment(comment.id)" v-if="data.isOwner"></button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";
import store, { storeTypes, Product, Comment } from "../../store";
import { Route } from "vue-router";

@Component({
  name: "commentComponent",
})
export default class CommentComponent extends Vue {
  @Prop({ required: true, type: Object as () => Comment })
  readonly comment: Comment;

  constructor() {
    super();
  }

  mounted() {
    this.data.isOwner = store.getters.currentUser.id === this.comment.commentAuthor.id;
  }

  data = {
    currentUser: store.getters.currentUser,
    isOwner: false
  }

  @Emit("delete-comment")
  deleteComment(commentId) {
    return commentId;
  }
}
</script>

<style scoped>
.msg-container {
  width: 100%;
  height: fit-content;

  margin: 0;

  display: flex;
  justify-content: flex-start;
}

.msg-container--owner {
  justify-content: flex-end;
}

.com-wrapper {
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.com-wrapper--owner {
  align-items: flex-end;
}

.com-wrapper--owner {
  align-items: flex-end;
}

.com {
  width: fit-content;
  height: fit-content;

  max-width: 70%;

  padding: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;

  border-radius: 1rem;
  border-bottom-left-radius: 0;
  border: 3px solid #5136ff;

  display: flex;
  align-items: center;
}

.com p {
  margin-left: 1rem;

  order: 1;
}

.com--owner {
  border-radius: 1rem;
  border-bottom-right-radius: 0;
  border: 3px solid #ffad37;

  justify-content: flex-end;
}

.com--owner p {
  margin-left: 0;
  margin-right: 1rem;

  order: 0;
}

.avatar-container {
  width: 40px;
  height: 40px;

  border-radius: 50%;

  order: 1;
}

.avatar-container img {
  max-width: 40px;
  max-height: 40px;
}

.actions-container {
  width: 100%;

  display: flex;
  justify-content: flex-end;
}

button {
  height: 100%;
  width: 5%;

  background-image: url('https://github.com/JavierSolerArtero99/DRF_VUEx/blob/master/Vuex/images/remove.png?raw=true');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  background-origin: content-box;
}

button:focus {
  outline: none;
}
</style>