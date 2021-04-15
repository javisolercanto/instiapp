<template>
  <section class="auth">
    <section class="auth_container  shadow">
      <section v-if="step === 0" class="recovery__disclaimer__container">
        <span class="login__disclaimer  login__disclaimer--name">Starting recovering your password</span>
        <p class="recovery__disclaimer--info">Insert your email and you will recieve an email with the instructions to recover your password</p>
      </section>
      <form v-if="step === 0" @submit="checkrecovery" class="recovery__form">
        <section class="recovery__input__container">
          <input
            class="input"
            v-model="data.email"
            placeholder="Insert your email"
            type="email"
            name="email"
            required
          />
        </section>

        <section v-if="errors.length > 0" class="container-error">
          <b>Please, check this errors:</b>
          <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
        </section>

        <button type="submit" class="button">Recover your password</button>
        <section class="login__disclaimer__container">
          <a class="login__disclaimer  login__disclaimer--account" href="/#/login">Back to login</a>
        </section>
      </form>

    </section>


  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import store, { SetAuth, storeTypes } from "../../store";

@Component({
  name: "recovery-password",
})
export default class Login extends Vue {
  data = {
    email: "",
    password: "",
    recovery: ['A',0,0]
  };

  step: number = 0;

  errors: string[] = [];

  constructor() {
    super();

    this.errors = [];
  }

  checkrecovery(e): void {
    e.preventDefault();
    this.step = 1;
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

/* Form */

.recovery__form {
  width: 100%;
  height: 70%;
  
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Inputs */

.recovery__input__container {
  width: 100%;
  height: 70%;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
}

.login__form--big {
  height: 90%;
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