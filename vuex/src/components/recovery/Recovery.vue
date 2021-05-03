<template>
  <section class="auth">
    <section class="auth_container  shadow">
      <section class="recovery__disclaimer__container">
        <span class="login__disclaimer  login__disclaimer--name">Starting recovering your password</span>
        <p class="recovery__disclaimer--info">Insert your email and your personal code used at register process and you will recieve an email with the instructions to recover your password</p>
      </section>
      <form @submit="checkRecovery" class="recovery__form">
        <section class="recovery__container">
          <input
            class="input"
            v-model="data.email"
            placeholder="Insert your email"
            type="email"
            name="email"
            required
          />

          <Spinner :loading="data.isLoading" />

        </section>

        <button type="submit" class="button">Recover password</button>

        <section class="login__disclaimer__container">
          <a class="login__disclaimer  login__disclaimer--account" href="/#/login">Back to login</a>
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
import Spinner from "../shared/Spinner.vue";

import ApiService from "../../common/api.service";
import store, { SetAuth, storeTypes } from "../../store";

@Component({
  name: "recovery-password",
  components: {
    ErrorContainer,
    Spinner
  },
})
export default class Login extends Vue {
  data = {
    email: "",
    isLoading: false
  };

  errors: string[] = [];

  constructor() {
    super();

    this.errors = [];
  }

  checkRecovery(e): void {
    e.preventDefault();

    this.data.isLoading = true;
    ApiService.put(`/auth/recover`, { "email": this.data.email})
      .then(res => {
        if (res.data) {
          this.data.isLoading = false;
          this.$router.push({ path: '/login' });
        }
      })
      .catch(err => this.showErrors(err.response.data.error))
  }

  checkForm(e): void {
    e.preventDefault();
    this.clearErrors(e);

    let user = {
      email: this.data.email,
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

/* Form */

.recovery__form {
  width: 100%;
  height: 70%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Inputs */

.recovery__container {
  height: 80%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Spinner */

.spinner__container {
  width: 100%;
  height: 50px;

  margin-top: 30px;

  display: flex;
  justify-content: center;
  align-items: center;

}

/* Disclaimer */

.recovery__disclaimer__container {
  height: 30%;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}

.recovery__disclaimer__container--small {
  height: fit-content;
}

.recovery__disclaimer--info {
  text-align: justify;
}

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

</style>