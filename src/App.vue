<template>
  <Tabs />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Tabs from "./components/Tabs.vue";

export default defineComponent({
  name: "App",
  data() {
    return {
      done: [] as any,
    };
  },
  methods: {
    addToCart: function (event: any, id: any) {
      // use event here as well as id
      console.log("In addToCart");
      console.log(id);
    },
  },
  components: {
    Tabs,
  },
  created() {
    this.$store.subscribe((mutation: any, state: any) => {
      if (mutation.payload.undoAction) {
        mutation.payload.view.history.push(mutation); 
      }
    });
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #cccccc;
}

* {
  user-select: none;
}

body {
  background-color: rgb(43, 43, 43);
  overflow: hidden;
  margin: 0;
  padding: 0;
}
.vue-pan-zoom-scene {
  height: 100%;
}
</style>
