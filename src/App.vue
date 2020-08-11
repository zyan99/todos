<template>
  <div id="app" v-cloak>
    <Header></Header>
    <Todos></Todos>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "./components/header.vue";
import Todos from "./components/todos.vue";
import Footer from "./components/footer.vue";

export default {
  name: "App",
  components: {
    Header,
    Todos,
    Footer,
  },
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  /* 禁止文本选中 */
  user-select: none;
}
[v-cloak] {
  display: none;
}
#app {
  margin: 50px auto;
  width: 50%;
  // height: 300px;//不设置让内容撑开
  background-color: beige;
  border: 1px solid #ccc;
}
</style>
