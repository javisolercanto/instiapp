<template>
  <div class="login">
    <div class="container">
      <div class="container--left">
        <img src="../../../assets/images/hat.svg" alt="logo" />
      </div>
      <div class="container--right">
        <form @submit="checkForm" class="login__form">
        <div class="input__container">
          <div v-if="!this.isLoginMode">
            <label for="username">Username</label>
            <input
              @click="clearErrors"
              class="login__input"
              id="username"
              v-model="data.username"
              type="text"
              name="username"
              required
            />
          </div>
          <div>
            <label for="email">Email</label>
            <input
              class="login__input"
              id="email"
              v-model="data.email"
              type="email"
              name="username"
              required
            />
          </div>
          <div>
            <label for="password">Password</label>
            <input
              class="login__input"
              id="password"
              v-model="data.password"
              type="password"
              name="password"
              required
            />
          </div>
        </div>

        <div v-if="errors.length > 0" class="container-error">
          <b>Please, check this errors:</b>
          <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
        </div>

        <button type="submit" class="login__button">
          {{ this.isLoginMode ? "Login" : "Register" }}
        </button>
      </form>
      </div>
    </div>

    <!-- <button class="router-link" @click="changeMode">
      {{
        this.isLoginMode ? "You don't have an account?" : "Do you have an account yet?"
      }}
    </button> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import store, { SetAuth, storeTypes } from "../../store";

@Component({
  name: "login",
})
export default class Login extends Vue {
  data = {
    username: "",
    email: "",
    password: "",
  };

  errors: string[] = [];
  isLoginMode: boolean = true;
  logged: boolean = false;

  constructor() {
    super();

    this.errors = [];
  }

  changeMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  checkForm(e): void {
    e.preventDefault();
    this.clearErrors(e);

    if (this.isLoginMode) {
      let user = {
        email: this.data.email,
        password: this.data.password,
      } as SetAuth;

      this.handleAuth(user);
      return;
    }

    if (
      this.data.username.length >= 3 &&
      this.data.username.length <= 15 &&
      this.data.password.length >= 8 &&
      this.data.password.length <= 30
    ) {
      let user = {
        username: this.data.username,
        email: this.data.email,
        password: this.data.password,
      } as SetAuth;

      this.handleAuth(user);
      return;
    }

    if (this.data.username.length < 3 || this.data.username.length > 15)
      this.errors.push("Username must be at least 3 characters.");
    if (this.data.password.length < 8 || this.data.password.length > 30)
      this.errors.push("Password must be at least 8 characters.");

  }

  clearErrors(e): void {
    this.errors = [];
  }

  handleAuth(user: SetAuth): void {
    store.dispatch(
      storeTypes.root.actions!.setAuth({
        username: user.username,
        email: user.email,
        password: user.password,
        isLogin: this.isLoginMode,
        changeScreen: () => {
          this.$router.push({ path: "/" });
        },
        showErrors: this.showErrors,
      })
    );
  }

  showErrors(errorsToShow: string): void {
    this.errors.push(errorsToShow);
  }
}
</script>

<style scoped>
.login {
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-image: url('../../../assets/images/school.jpeg');

  background-size: cover;
}

.container {
  height: 70%;
  width: 70%;

  padding: 0;

  background-color: var(--primary-color);

  display: flex;
  flex-direction: row;
}

.container--left {
  width: 100%;
  height: 100%;

  padding: 0;
}

.container--right {
  width: 100%;
  height: 100%;

  padding: 0;
  
  background-color: var(--bg-color);
  border: 5px solid var(--primary-color);

  display: flex;
  flex-direction: column;
  align-items: center;
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

.login__form {
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-rows: 90% 10%;
}

.login__input {
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

.login__input:focus {
  border-bottom: 2px #5136ff solid;
}

.login__input::placeholder {
  color: white;
}

button:focus,
input:focus {
  outline: 0;
}

.login__button {
  color: var(--primary-color);
  border-top: 4px solid var(--primary-color);

  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: center;
}

.login__button:hover {
  background-color: #5136ff;
}
</style>