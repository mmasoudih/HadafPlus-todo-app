/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
import { VueQueryPlugin } from "@tanstack/vue-query";

const app = createApp(App);

registerPlugins(app);

app.use(VueQueryPlugin);
app.mount("#app");
