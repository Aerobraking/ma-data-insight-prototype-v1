
<template>
  <div class="tabs__header">
    <a
      v-for="(view, index) in getViewList"
      @click="selectTab(index)"
      :key="view.key"
      :class="{ tab__selected: index == getSelectedViewIndex }"
    >
      {{ view.name }}
    </a>
    <a @click="createTab()"> + </a>
  </div>
  <keep-alive>
    <div
      v-for="(view, index) in getViewList"
      @click="selectTab(index)"
      :key="view.key"
      v-show="view.isActive"
    >
      <workspace :workspace="view" v-if="view.type === 'workspace'">
      </workspace>
      <forceview :global="view" v-else> </forceview> 
    </div>
  </keep-alive>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import workspace from "./workspace.vue";
import globalview from "./globalview.vue";
import forceview from "./forceview.vue";

export default defineComponent({
  el: "#wrapper",
  name: "Tabs",
  components: {
    workspace,
    globalview,
    forceview,
  },
  data(): {} {
    return {
      selectedIndex: 0,
    };
  },
  computed: {
    getViewList() {
      return this.$store.getters.getViewList;
    },
    getSelectedViewIndex() {
      return this.$store.state.selectedViewIndex;
    },
  },
  methods: {
    createTab() {
      this.$store.dispatch("createTab");
    },
    selectTab(i: Number) {
      this.$store.state.selectedViewIndex = i;
      this.$store.getters.getViewList.forEach((entry: any, index: Number) => {
        entry.isActive = index === i;
      });
    },
    dragMouseMove: function (e: MouseEvent) {},

    beforeMouseDownHandler(e: any) {},
  },
});
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div.tabs__header {
  display: block;
  margin: 0 0 0 0px;
  padding: 0;
  z-index: 100;
  background-color: rgb(100, 100, 100);
  position: absolute;
  width: 100%;
}
div.tabs__header a {
  text-align: left;
  padding: 10px 15px 0px 15px;
  border-radius: 5px;
  margin: 5px 0 0 0;
  margin-right: 5px;
  cursor: pointer;
  float: left;
  background-color: rgb(100, 100, 100);
}
div.tabs__header a.tab__selected {
  color: lavender;
  border-radius: 5px 5px 0 0;
  border-bottom: 8px solid transparent;
  background-color: rgb(53, 53, 53);
}
.tab {
  display: inline-block;
  color: black;
  padding: 20px;
  min-width: 800px;
  border-radius: 10px;
  min-height: 400px;
}
</style>
