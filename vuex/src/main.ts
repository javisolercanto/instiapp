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
  Rental,
  RentalDetails,
  RentalEditor,
  Route,
  RouteDetails,
  RouteEditor,
  Group,
  GroupDetails,
  GroupEditor,
  Profile,
  Register,
  Recovery
} from "./components";
import ApiService from "./common/services/api.service";
import { getToken } from "./common/jwt.service";

Vue.use(VueRouter);
Vue.filter("currency", currency);

Vue.config.productionTip = false;

ApiService.init();

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes: [
    { path: "/", name: 'root', component: App, redirect: "/app" },
    {
      path: "/app",
      component: Home,
      redirect: "/app/product",
      children: [
        {
          path: "product", name: 'product', component: Product,
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
          path: "rental", name: 'rental', component: Rental,
            beforeEnter: (to, from, next) => checkRoutePermissions('/login', 'isAuthed', to, from, next)
        },
        {
          path: "rental/:id", name: "rental-details", component: RentalDetails,
            beforeEnter: (to, from, next) => checkRoutePermissions('/login', 'isAuthed', to, from, next)
        },
        {
          path: "rental-editor/", name: "rental-creator", component: RentalEditor,
            beforeEnter: (to, from, next) => checkRoutePermissions('/login', 'isAuthed', to, from, next)
        },
        {
          path: "rental-editor/:id", name: "rental-editor", component: RentalEditor,
            beforeEnter: (to, from, next) => checkRoutePermissions('/login', 'isAuthed', to, from, next)
        },
        {
          path: "route", name: 'route', component: Route,
            beforeEnter: (to, from, next) => checkRoutePermissions('/login', 'isAuthed', to, from, next)
        },
        {
          path: "route/:id", name: "route-details", component: RouteDetails,
            beforeEnter: (to, from, next) => checkRoutePermissions('/login', 'isAuthed', to, from, next)
        },
        {
          path: "route-editor/", name: "route-creator", component: RouteEditor,
            beforeEnter: (to, from, next) => checkRoutePermissions('/login', 'isAuthed', to, from, next)
        },
        {
          path: "route-editor/:id", name: "route-editor", component: RouteEditor,
            beforeEnter: (to, from, next) => checkRoutePermissions('/login', 'isAuthed', to, from, next)
        },
        {
          path: "group", name: 'group', component: Group,
            beforeEnter: (to, from, next) => checkRoutePermissions('/login', 'isAuthed', to, from, next)
        },
        {
          path: "group/:id", name: "group-details", component: GroupDetails,
            beforeEnter: (to, from, next) => checkRoutePermissions('/login', 'isAuthed', to, from, next)
        },
        {
          path: "group-editor/", name: "group-creator", component: GroupEditor,
            beforeEnter: (to, from, next) => checkRoutePermissions('/login', 'isAuthed', to, from, next)
        },
        {
          path: "group-editor/:id", name: "group-editor", component: GroupEditor,
            beforeEnter: (to, from, next) => checkRoutePermissions('/login', 'isAuthed', to, from, next)
        },
        {
          path: 'profile', name: 'profile', component: Profile, 
            beforeEnter: (to, from, next) => checkRoutePermissions('/login', 'isAuthed', to, from, next)
        },
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
    store.dispatch(storeTypes.root.actions!.autoAuth())
      .then(res => next(), err => next({ path: failurePath }))
      .catch(err => storeTypes.root.actions!.purgeAuth())

  else next({ path: failurePath })
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
