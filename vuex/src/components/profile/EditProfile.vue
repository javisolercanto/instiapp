<template>
  <div class="editProfile">
    <div class="container">
      <img
        src="https://github.com/JavierSolerArtero99/DRF_VUEx/blob/master/Vuex/images/avatar.png?raw=true"
        alt="profile picture"
      />

      <form @submit="checkForm" class="editProfile__form">
        <div class="input__container">
          <div>
            <label for="username">Username</label>
            <input
              class="editProfile__input"
              id="username"
              v-model="data.currentUser.username"
              type="text"
              name="username"
              required
            />
          </div>
          <div>
            <label for="email">Email</label>
            <input
              class="editProfile__input"
              id="email"
              v-model="data.currentUser.email"
              type="email"
              name="email"
              required
            />
          </div>
          <!-- <div>
            <label for="password">Password</label>
            <input
              class="editProfile__input"
              id="password"
              v-model="data.currentUser.password"
              type="password"
              name="password"
              required
            />
          </div> -->
          <div>
            <label for="bio">Bio</label>
            <input
              class="editProfile__input"
              id="bio"
              v-model="data.currentUser.bio"
              type="text"
              name="bio"
              required
            />
          </div>
        </div>

        <div v-if="errors.length > 0" class="container-error">
          <b>Please, check this errors:</b>
          <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
        </div>

        <button type="submit" class="editProfile__button">
          Update profile
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import store, { storeTypes, User } from "../../store";
import { Route } from "vue-router";
import ApiService from "../../common/api.service";

@Component({
  name: "editProfile",
})
export default class EditProfile extends Vue {
  data = {
    currentUser: {} as User | null,
  };

  errors: string[];

  constructor() {
    super();

    this.errors = [];
  }

  beforeDestroy() {
    this.data.currentUser = null;
  }

  mounted() {
    this.data.currentUser = store.getters.currentUser;
  }

  checkForm(e) {
    this.errors = [];

    if (!this.data.currentUser) {
      this.errors.push("An error has ocurred during the update");
      e.preventDeafult();
      return;
    }

    ApiService.put("profiles/"+ this.data.currentUser.username, {
      profile: this.data.currentUser,
    })
      .then((data) => {
        console.log(data);
        
      })
      .catch((err) => {
        this.errors.push("An error has ocurred during the update");
        e.preventDefault();
        return false;
      });

    e.preventDefault();
  }
}
</script>

<style scoped>
.editProfile {
  height: 90%;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-size: cover;

  background-color: #222222;
}

.container {
  height: 70%;
  width: 30%;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 0;
}

.input__container {
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.router-link {
  margin-top: 2rem;
  color: white;
}

h1 {
  background: #5136ff;
  text-align: center;
  color: white;
}

img {
  width: 100px;
  height: 100px;
}

label {
  color: white;
  padding-left: 1rem;
}

.container-error {
  height: fit-content;
  width: 250px;

  margin: 1.5rem;
  padding: 1rem;

  position: absolute;
  top: 0;
  right: 0;

  border-radius: 0.3rem;

  line-height: 2rem;

  background-color: #c23834;
  color: white;
}

.container-error p {
  line-height: 1.5rem;
}

.container-error img {
  width: 30px;
  height: 30px;
}

.editProfile__form {
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-rows: 90% 10%;
}

.editProfile__input {
  height: 3rem;
  width: 100%;

  color: white;

  border-bottom: 2px #ffad37 solid;

  padding-left: 1.5rem;
  padding-right: 1rem;

  font-size: 1.2rem;

  display: flex;
  align-items: center;
  justify-content: center;
}

.editProfile__input:focus {
  border-bottom: 2px #5136ff solid;
}

.editProfile__input::placeholder {
  color: white;
}

button:focus,
input:focus {
  outline: 0;
}

.editProfile__button {
  background-color: #ffad37;
  color: white;

  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: center;
}

.editProfile__button:hover {
  background-color: #5136ff;
}
</style>