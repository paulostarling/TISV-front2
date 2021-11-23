import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { BootstrapVue } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import VueSession from 'vue-session';
import Sidebar from './template/Sidebar';
import Navbar from './template/Navbar';
import money from 'v-money'
import VueTheMask from 'vue-the-mask';

Vue.use(money)
Vue.use(VueTheMask);
Vue.use(BootstrapVue);
Vue.use(VueSession)
Vue.config.productionTip = false;
Vue.prototype.$apiHost = 'http://localhost:5000/';
Vue.prototype.$apiHeader = {'Content-Type': 'application/json'};

Vue.component('app-sidebar',Sidebar);
Vue.component('app-navbar',Navbar);

new Vue({
    router,
    render: h => h(App)
}).$mount("#app");
