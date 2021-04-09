<template>
  <section class="login">
    <section class="container  shadow">
      <img src="../../../assets/images/hat.svg" alt="logo">
      <form @submit="checkForm" class="login__form">
        <section class="input__container">
          <section v-if="!this.isLoginMode">
            <input
              @click="clearErrors"
              class="login__input"
              id="username"
              v-model="data.username"
              type="text"
              name="username"
              placeholder="Username"
              required
            />
          </section>
          <section>
            <input
              class="login__input"
              id="email"
              v-model="data.email"
              type="email"
              name="username"
              placeholder="Email"
              required
            />
          </section>
          <section>
            <input
              class="login__input"
              id="password"
              v-model="data.password"
              type="password"
              name="password"
              placeholder="Password"
              required
            />
          </section>
        </section>

        <section v-if="errors.length > 0" class="container-error">
          <b>Please, check this errors:</b>
          <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
        </section>

        <section class="button__container">
          <button type="submit" class="button  login__button">
            {{ this.isLoginMode ? "Login" : "Register" }}
          </button>
          <button type="button" class="button  register__button"  @click="changeMode">
            {{ !this.isLoginMode ? "Login" : "Register" }}
          </button>
        </section>
      </form>
      <!-- <section class="disclaimer__container">
        <span class="login__disclaimer">Forgot <a class="login__link" href="">password?</a></span>
      </section> -->
    </section>

    <!-- <button class="router-link" @click="changeMode">
      {{
        this.isLoginMode ? "You don't have an account?" : "Do you have an account yet?"
      }}
    </button> -->
  </section>
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

  /* background-image: url('../../../assets/images/school2.jpg'); */
  background-color: #c23834;

  background-size: cover;
}

.container {
  height: 50%;
  width: 20%;
  min-height: 500px;
  min-width: 300px;

  padding: 1rem;

  background-color: var(--bg-color);

  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.register-button {
  width: 30px;
  height: 30px;

  position: absolute;
  top: 0;
  right: 0;

  padding: 0;
  margin: 0;
  
  background-color: var(--primary-color-dark);
}

.register-image {
  width: 100%; 
  height: auto; 
}

.input__container {
  width: 100%;
  height: 70%;

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

  user-select: none;
}

label {
  color: black;
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

  border-radius: 5px;

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
  height: 70%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.login__input {
  height: 50px;
  width: 100%;

  color: black;
  background-color: #e5e5e5;

  border-bottom: 3px var(--primary-color) solid;
  border-radius: 5px;

  padding-left: 1.5rem;
  padding-right: 1rem;

  font-size: 1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: 0.3s all;
}

.login__input:focus {
  border-bottom: 3px var(--primary-color-dark) solid;
}


button:focus,
input:focus {
  outline: 0;
}

.disclaimer__container {
  width: 100%;
  height: fit-content;

  display: flex;
  justify-content: center;
}

.login__disclaimer {
  color: black;
}

.login__link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: bold;

  transition: 0.3s all;
}

.login__link:hover {
  color: var(--primary-color-dark);
}

.button__container {
  width: 100%;
  height: fit-content;

  display: flex;
  justify-content: space-between;
}

.button {
  width: 100%;
  height: 50px;

  color: var(--primary-color);
  background-color: var(--primary-color);

  border-bottom: 3px var(--primary-color-dark) solid;
  border-radius: 5px;

  color: white;
  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: 0.3s all;
}

.login__button {
  width: 68%;
}

.register__button {
  width: 30%;
}

.login__button:hover, .register__button:hover{
  background-color: var(--primary-color-dark);
}
</style>