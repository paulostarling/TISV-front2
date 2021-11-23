import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Produtos from "../views/Produtos.vue";
import Login from "../views/Login.vue";
import Users from "../views/Users.vue";
import PedidoCreate from "../views/PedidoCreate.vue";
import PedidoGeral from "../views/PedidoGeral.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/login", name: "Login", component: Login },
  { path: "/usuarios", name: "Usuarios", component: Users },
  { path: "/produtos", name: "Produtos", component: Produtos },
  { path: "/criar_pedido", name: "Pedido Create", component: PedidoCreate },
  { path: "/consultar_pedido", name: "Pedido Geral", component: PedidoGeral },
  { path: '*', redirect: '/' }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to,from,next) => {
  console.log(to.path);
  if (to.path != '/login' && !Vue.prototype.$session.exists()) {
    return next({
      path: '/login'
    });
  }

  next()
})

export default router;
