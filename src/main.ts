import "./assets/main.css";
import "./index.css";
import "./assets/base.css";
import "./styles/index.scss";
import 'primeicons/primeicons.css';
//Vue
import router from "./router";
// PrimeVue Plugin
import PrimeVuePlugin from './plugins/primevue';
// Internal Components lugin
import InternalComponentsPlugin from './plugins/internal';
// Pinia
import { createPinia } from "pinia";
import App from "./App.vue";
import { createApp } from "vue";
import { useAuthStore } from "./stores/useAuthStore";

const app = createApp(App);
const pinia = createPinia();

// Pinia
app.use(pinia);

// PrimeVue
app.use(PrimeVuePlugin);

// Internal Components
app.use(InternalComponentsPlugin)

app.use(router);

// Listen for auth state changes
const authStore = useAuthStore();
authStore.listenForAuthChanges(); // Start listening for auth changes

app.mount("#app");
