<template>
  <PageLayout />
</template>

<script>
import PageLayout from "@/components/PageLayout.vue";
export default {
  components: {
    PageLayout,
  },
};
</script>

<style lang="scss">
html,
body {
  min-height: 100%;
  height: 100%;
}
#app {
  height: 100%;
}
* {
  margin: 0;
  padding: 0;
}
</style>
