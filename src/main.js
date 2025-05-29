import { createApp } from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue3-loading-overlay';
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import {createPinia} from 'pinia';
import App from './App.vue';
import router from './router';
import { currency } from './methods/filters';

const pinia = createPinia();
const app = createApp(App);
app.config.globalProperties.$filters = {
  currency,
};
app.use(pinia);
app.use(router);
app.use(VueAxios, axios);
app.component('Loading', Loading);
app.mount('#app');

const token = document.cookie.replace(
  /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
  '$1'
);
axios.defaults.headers.common.Authorization = token;
