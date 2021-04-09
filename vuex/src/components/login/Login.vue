<template>
  <section class="login">
    <section class="login__container  shadow">
      <img src="../../../assets/images/hat-red.svg" alt="logo">
      <form @submit="checkForm" class="login__form">
        <section class="login__input__container">
          <input
            class="input"
            id="email"
            v-model="data.email"
            type="email"
            name="username"
            placeholder="Email"
            required
          />
          <input
            class="input"
            id="password"
            v-model="data.password"
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <a class="login__disclaimer  login__disclaimer--password" href="#">Forgot password?</a>
        </section>

        <section v-if="errors.length > 0" class="container-error">
          <b>Please, check this errors:</b>
          <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
        </section>

        <button type="submit" class="button">Login</button>
      </form>
    </section>

    <section class="login__disclaimer__container">
      <a class="login__disclaimer  login__disclaimer--account" href="#">You don't have an account?</a>
    </section>

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
    email: "",
    password: "",
  };

  errors: string[] = [];

  constructor() {
    super();

    this.errors = [];
  }

  checkForm(e): void {
    e.preventDefault();
    this.clearErrors(e);

    let user = {
      email: this.data.email,
      password: this.data.password,
    } as SetAuth;

    this.handleAuth(user);
    return;
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
        isLogin: true,
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

<style>

/* Login */

.login {
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-image: url('../../../assets/images/chairs.jpg');
  background-size: cover;

  background-color: var(--primary-color);
}

.login__container {
  height: 50%;
  width: 20%;
  min-height: 500px;
  min-width: 300px;

  padding: 1rem;

  /* background-color: var(--bg-color); */

  background-color: rgba(0, 0, 0, 0.452);

  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.login img {
  width: 100px;
  height: 100px;

  user-select: none;
}

/* Form */

.login__form {
  width: 100%;
  height: 70%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Inputs */

.login__input__container {
  width: 100%;
  height: 70%;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

/* Disclaimer */

.login__disclaimer__container {
  width: 100%;
  height: 1.2rem;

  margin-top: 1rem;

  display: flex;
  justify-content: center;
}

.login__disclaimer {
  text-decoration: none;
  font-weight: bold;

  transition: 0.3s all;
}

.login__disclaimer--password {
  font-size: 0.9rem;
  color: var(--primary-color);


  margin-left: 0.5rem;
}

.login__disclaimer--password:hover {
  color: var(--primary-color-dark);
}

.login__disclaimer--account {
  color: white;
}

.login__disclaimer--account:hover {
  font-size: 1.1em;
}

</style>