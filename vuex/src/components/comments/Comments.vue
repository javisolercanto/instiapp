<template>
  <div class="comments">
    <div class="container">
      <CommentComponent v-for="comment in data.comments" v-bind:key="comment.id" @delete-comment="deleteComment" :comment="comment"/>
    </div>
    <div class="comments-box">
      <textarea v-model="data.comment.message" cols="1" rows="3" placeholder="Text your comment"></textarea>
      <button @click="addComment"></button>
    </div>
    <div
      v-if="showSuccess"
      @click="() => (showSuccess = false)"
      class="container-success"
    >
      <b>Confirmed delete!</b>
      <p>Your comment has been deleted</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import store, { storeTypes, Product, Comment } from "../../store";
import { Route } from "vue-router";

import CommentComponent from "../comments/Comment.vue";
import ApiService from "../../common/api.service";

@Component({
  name: "comments",
  components: {
    CommentComponent
  }
})
export default class Comments extends Vue {

  @Prop({ required: true, type: String }) readonly productSlug: string;

  constructor() {
    super();
  }

  showSuccess: boolean = false;

  data = {
    comments: [] as Comment[],
    comment: {} as Comment,
    product: {} as Product,
    currentUser: store.getters.currentUser,
  }

  @Watch('productSlug')
  onChangeProduct(value: string, oldValue: string) {
    this.getComments(value);
  }

  mounted() {
    ApiService.get("products/" + this.productSlug).then((res) => {
        if (res.data) {
          this.data.product = res.data;
          if (this.data.product) this.getComments(this.productSlug);
        }
      });
  }

  getComments(slug: string) {
    ApiService.get("products/" + slug + "/comments").then((res) => {
      if (res.data) {
        this.data.comments = res.data;
      }
    });
  }

  addComment() {
    if (this.data.comment.message) ApiService.post("products/" + this.productSlug + "/comments", {
      comment: {
        message: this.data.comment.message,
        product: this.data.product,
        author: this.data.currentUser,
      }
    }).then((res) => {
      if (res.data) {
        this.getComments(this.productSlug);
      }
    });
  }

  deleteComment(commentId: number) {
    ApiService.delete("products/" + this.productSlug + "/comments/" + commentId).then((res) => {
        this.getComments(this.productSlug);
        this.showSuccess = true;
    });
  }
}
</script>

<style scoped>
.comments {
  height: 70%;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;

  overflow: hidden;

  padding: 0;
}

.container {
  height: 80%;
  width: 100%;

  overflow-x: hidden;
  overflow-y: scroll;
}

.comments-box {
  width: 40%;
  height: 17%;

  padding: 0.3rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comments-box textarea {
  width: 70%;
  height: 70%;

  padding: 0.3rem;
  
  resize: none;

  color: white;
  border: 3px solid #ffad37;
}

.comments-box button {
  width: 27%;
  height: 70%;

  background-image: url('https://github.com/JavierSolerArtero99/DRF_VUEx/blob/master/Vuex/images/send.png?raw=true');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  background-origin: content-box;

  border: 3px solid #5136ff;
}

.comments-box button:hover {
  background-color: #5136ff;
  background-image: url('https://github.com/JavierSolerArtero99/DRF_VUEx/blob/master/Vuex/images/sendgrey.png?raw=true');
}

.container-success {
  height: fit-content;
  width: 250px;

  margin: 1.5rem;
  padding: 1rem;

  position: absolute;
  top: 0;
  right: 0;

  border-radius: 0.3rem;

  line-height: 2rem;

  background-color: #31df75;
  color: white;
}

.container-success p {
  line-height: 1.5rem;
}

.container-success img {
  width: 30px;
  height: 30px;
}

button:focus, textarea:focus {
  outline: none;
}
</style>