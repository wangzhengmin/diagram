<template>
  <div class="w-container">
    <aside class="w-aside">
      <ul>
        <li class="w-aside_nav" v-for="(nav, index) in navs" :key="index">
          <router-link :to="nav.path">{{ nav.title }}</router-link>
        </li>
      </ul>
    </aside>
    <div class="w-body">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      navs: [
        { title: "hello word", path: "/hello-word" },
        { title: "mxgraph画布", path: "/" },
      ],
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.w-container {
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  width: 100%;
  .w-aside {
    flex: 0 0 240px;
    border-right: 1px solid #999;
    .w-aside_nav {
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-bottom: 1px solid #999;
    }
  }
  .w-body {
    padding: 20px;
  }
}
</style>
