<template>
  <section class="auth">
    <section class="auth_container  shadow">
      <section v-if="step === 0" class="code__disclaimer__container">
        <span class="login__disclaimer  login__disclaimer--name">Insert your code</span>
        <p class="code__disclaimer--info">Insert your personal and non-transferable code in order to start your registration</p>
      </section>
      <section v-if="step === 1" class="code__disclaimer__container  code__disclaimer__container--small">
        <span class="login__disclaimer  login__disclaimer--name">Insert your personal data</span>
      </section>
      <form v-if="step === 0" @submit="checkCode" class="code__form">
        <section class="code__input__container">
          <input
            class="input  code__input"
            v-model="data.code[0]"
            type="text"
            name="code0"
            maxlength="1"
            required
          />
          <input
            class="input  code__input"
            v-model="data.code[1]"
            type="text"
            name="code1"
            maxlength="1"
            required
          />
          <input
            class="input  code__input"
            v-model="data.code[2]"
            type="text"
            name="code2"
            maxlength="1"
            required
          />
        </section>

        <button type="submit" class="button">Next</button>
        <section class="login__disclaimer__container">
          <a class="login__disclaimer  login__disclaimer--account" href="#">You don't have a code?</a>
        </section>
      </form>

      <form v-if="step === 1" @submit="checkForm" class="login__form  login__form--big" autocomplete="on">
        <section class="login__input__container">
          <input
            class="input"
            id="name"
            v-model="data.user.name"
            type="text"
            autocomplete="name"
            name="name"
            placeholder="Name"
            required
          />
          <input
            class="input"
            id="username"
            v-model="data.user.username"
            type="text"
            autocomplete="username"
            name="username"
            placeholder="Username"
            required
          />
          <input
            class="input"
            id="email"
            v-model="data.user.email"
            type="email"
            autocomplete="email"
            name="email"
            placeholder="Email"
            required
          />
          <input
            class="input"
            id="password"
            v-model="data.user.password"
            type="password"
            autocomplete="new-password"
            name="password"
            placeholder="Password"
            required
          />
        </section>

        <button type="submit" class="button">Register</button>
        <section class="login__disclaimer__container">
          <a class="login__disclaimer  login__disclaimer--account" href="/#/login">Do you have an account yet?</a>
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
import ApiService from "../../common/api.service";
import store, { SetAuth, storeTypes } from "../../store";

@Component({
  name: "login",
  components: {
    ErrorContainer,
  },
})
export default class Login extends Vue {
  data = {
    user: {} as SetAuth,
    code: ['A',0,0] as string[]
  };

  step: number = 0;

  errors: string[] = [];

  constructor() {
    super();

    this.errors = [];
  }

  checkCode(e): void {
    e.preventDefault();
    ApiService.get(`/code/${this.data.code.join('')}`)
      .then(res => this.step = 1)
      .catch(err => this.showErrors(`Code ${this.data.code.join('')} not found`))
  }

  checkForm(e): void {
    e.preventDefault();
    this.clearErrors();

    this.handleAuth(this.data.user);

    return;
  }

  clearErrors(): void {
    this.errors = [];
  }

  handleAuth(user: SetAuth): void {
    store.dispatch(
      storeTypes.root.actions!.setAuth({
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
        code: this.data.code,
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

.code__form {
  width: 100%;
  height: 70%;
  
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Inputs */

.code__input__container {
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

input.code__input {
  height: 35%;
  width: 20%;

  font-size: 2rem;
  text-align: center;

  margin: 0;
  padding: 0;
}

/* Disclaimer */

.code__disclaimer__container {
  height: 30%;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}

.code__disclaimer__container--small {
  height: fit-content;
}

.code__disclaimer--info {
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