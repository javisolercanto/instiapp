import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import store, { storeTypes } from "./store";
import { vuetify } from "./core/plugins";
import { currency } from "./core/filters";
import {
  NotFound,
  Home,
  Login,
  Product,
  ProductDetails,
  ProductEditor,
  Profile,
  EditProfile,
  Register,
  Recovery
} from "./components";
import ApiService from "./common/services/api.service";
import { getToken } from "./common/jwt.service";

Vue.use(VueRouter);
// Vue.use(VueMaterial);

Vue.filter("currency", currency);

Vue.config.productionTip = false;

ApiService.init();

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes: [
    { path: "/", component: App, redirect: "/app" },
    {
      path: "/app",
      component: Home,
      beforeEnter: (to, from, next) => checkRoutePermissions('/login', 'isAuthed', to, from, next),
      children: [
        {
          path: "product", component: Product,
            beforeEnter: (to, from, next) => checkRoutePermissions('/login', 'isAuthed', to, from, next)
        },
        {
          path: "product/:id", name: "product-details", component: ProductDetails,
            beforeEnter: (to, from, next) => checkRoutePermissions('/login', 'isAuthed', to, from, next)
        },
        {
          path: "product-editor/", name: "product-creator", component: ProductEditor,
            beforeEnter: (to, from, next) => checkRoutePermissions('/login', 'isAuthed', to, from, next)
        },
        {
          path: "product-editor/:id", name: "product-editor", component: ProductEditor,
            beforeEnter: (to, from, next) => checkRoutePermissions('/login', 'isAuthed', to, from, next)
        },
        {
          path: 'profile', component: Profile, 
            beforeEnter: (to, from, next) => checkRoutePermissions('/login', 'isAuthed', to, from, next)
        },
        {
          path: "profile-edit", component: EditProfile,
            beforeEnter: (to, from, next) => checkRoutePermissions('/login', 'isAuthed', to, from, next)
        },
        {
          path: "panel-admin", component: EditProfile,
            beforeEnter: (to, from, next) => checkRoutePermissions('/', 'isAdmin', to, from, next)
        }
      ]
    },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/recovery", component: Recovery },
    { path: "/*", component: NotFound }
  ]
});

function checkRoutePermissions(failurePath: string, property: any, to, from, next): void {
  if (store.getters.currentUser[property])
    next();
  
  if (getToken()) 
    store.dispatch(storeTypes.root.actions!.autoAuth()).then(res => next(), err => next({ path: failurePath }));

  else next({ path: failurePath })
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
