import { createRouter, createWebHistory } from "vue-router";
import DiagramCanvas from "../views/DiagramCanvas.vue";
import HellowWord from "../views/HellowWord.vue";
import ToolbarView from "../views/ToolbarView.vue";
const routes = [
  {
    path: "/",
    component: DiagramCanvas,
  },
  {
    path: "/hello-word",
    component: HellowWord,
  },
  {
    path: "/toolbar",
    component: ToolbarView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
