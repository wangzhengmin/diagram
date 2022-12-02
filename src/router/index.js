import { createRouter, createWebHistory } from "vue-router";
import DiagramCanvas from "../views/DiagramCanvas.vue";
import HellowWord from "../views/HellowWord.vue";
const routes = [
  {
    path: "/",
    component: DiagramCanvas,
  },
  {
    path: "/hello-word",
    component: HellowWord,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
