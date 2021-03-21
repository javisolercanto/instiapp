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
  Products,
  Profile,
  EditProfile,
  ProductDetails,
  ProductEditor
} from "./components";
import ApiService from "./common/api.service";
import { getToken } from "./common/jwt.service";

Vue.use(VueRouter);

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
      children: [
        { path: "products", component: Products },
        { 
          path: "editor/", component: ProductEditor,
            beforeEnter: (to, from, next) => checkRoutePermissions('/login', 'isAuthed', to, from, next)
        },
        { 
          path: "editor/:slug", name: "editor", component: ProductEditor,
            beforeEnter: (to, from, next) => checkRoutePermissions('/login', 'isAuthed', to, from, next)
        },
        { 
          path: "products/:slug", name: "details", component: ProductDetails,
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
