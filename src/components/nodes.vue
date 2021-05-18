<script lang="ts">
import { defineComponent } from "vue";
import NodeEntry from "./node.vue";

export default defineComponent({
  name: "Nodes",
  components: {
    NodeEntry,
  },
  props: {
    files: Array,
    viewKey: Number,
  },
  methods: {
    test() {
      this.$props.files;
    },
  },
});
</script>

<template>
  <node-entry
    v-for="file in files"
    :key="file.key"
    :file="file"
    :viewKey="viewKey"
    class="mydiv select"
  >
  </node-entry>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#drag {
  width: 200px;
  height: 200px;
  background-color: blueviolet;
  position: absolute;
}
</style>
