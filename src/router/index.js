import { createRouter, createWebHistory } from "vue-router";
import DiagramCanvas from "../views/DiagramCanvas.vue";
import HellowWord from "../views/HellowWord.vue";
import ToolbarView from "../views/ToolbarView.vue";
import ShapeSidebarView from "../views/ShapeSidebarView.vue";
import FormatSidebarView from "../views/FormatSidebarView.vue";
import Cabinet from "../views/Cabinet.vue";
import CustomProperty from "../views/CustomProperty.vue";
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
  {
    path: "/shape-sidebar",
    component: ShapeSidebarView,
  },
  {
    path: "/format-sidebar",
    component: FormatSidebarView,
  },
  {
    path: "/cabinet",
    component: Cabinet,
  },
  {
    path: "/custom-property",
    component: CustomProperty,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
