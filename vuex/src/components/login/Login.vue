<template>
  <section class="auth">
    <section class="auth_container  shadow">
      <img src="../../../assets/images/hat-green.svg" alt="logo">
      <!-- <span class="login__disclaimer  login__disclaimer--name">IES L'ESTACIÓ</span> -->
      <form @submit="checkForm" class="login__form" autocomplete="on">
        <section class="login__input__container">
          <input
            class="input"
            id="email"
            v-model="data.email"
            type="email"
            name="username"
            autocomplete="email"
            placeholder="Email"
            required
          />
          <input
            class="input"
            id="password"
            v-model="data.password"
            type="password"
            name="password"
            autocomplete="password"
            placeholder="Password"
            required
          />
          <section class="login__disclaimer__container">
            <a class="login__disclaimer  login__disclaimer--password" href="/#/recovery">Forgot password?</a>
          </section>
        </section>

        <button type="submit" class="button">Login</button>
        <section class="login__disclaimer__container">
          <a class="login__disclaimer  login__disclaimer--account" href="/#/register">You don't have an account?</a>
        </section>
      </form>

      <ErrorContainer @clear-errors="clearErrors" :errors="errors"/>

    </section>


  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ErrorContainer from "../shared/ErrorContainer.vue";
import store, { SetAuth, storeTypes } from "../../store";

@Component({
  name: "login",
  components: {
    ErrorContainer
  }
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
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
        code: undefined,
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

.auth {
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  /* background-image: url('../../../assets/images/pencil1.jpeg'); */
  background-size: cover;

  /* E6E5E8 */
  background-color: #E6E5E8;
  /* background-color: var(--primary-color); */
}

.auth_container {
  height: 50%;
  width: 30%;
  max-height: 500px;
  min-height: 500px;
  max-width: 400px;
  min-width: 300px;

  padding: 1rem 1.5rem 1rem 1.5rem;

  background-color: var(--bg-color);

  border-radius: 7px;

  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.auth img {
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
  align-items: center;
}

.login__disclaimer {
  text-decoration: none;
  font-weight: bold;

  transition: 0.3s all;
}

a.login__disclaimer, a.login__disclaimer:hover {
  text-decoration: none;
}

.login__disclaimer--name {
  font-family: Verdana;
}

.login__disclaimer--password {
  font-size: 0.9rem;
  margin-left: 0.5rem;
  color: var(--primary-color);

  text-align: left;
}

.login__disclaimer--password:hover {
  font-size: 1rem;
  color: var(--primary-color-dark);
}

.login__disclaimer--account {
  width: 100%;

  font-size: 0.9rem;
  color: var(--primary-color);

  text-align: center;
}

.login__disclaimer--account:hover {
  color: var(--primary-color-dark);
  font-size: 1em;
}

/* Responsive */

@media only screen and (max-width: 800px) {
  .login {
    background-size: contain;
    background-repeat: repeat-y;
  }

  .login__disclaimer--account:hover {
    font-size: 1.1em;
  }
}

</style>