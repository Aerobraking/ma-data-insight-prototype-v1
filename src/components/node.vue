<template>
  <div
    @click.prevent="clickStart"
    :style="{
      //     transform: 'translate(' + getX() + 'px, ' + getY() + 'px' + ')',
      //  transform: '-webkit-translate3d(' + getX() + 'px, ' + getY() + 'px' + ', 0)',
      transform: 'translate3d(' + getX() + 'px, ' + getY() + 'px' + ', 0)',
    }"
    v-bind:class="['mydiv, selectable', { selected: file.isSelected }]"
  >
    <p>{{ file.name }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "NodeEntry",
  data() {
    return {};
  },
  props: {
    file: {
      type: null,
    },
    viewKey: Number,
  },
  methods: {
    clickStart(e: MouseEvent) {
      this.$store.dispatch("setIsSelected", {
        name: this.file.key,
        add: e.ctrlKey,
        viewKey: this.viewKey,
      });
    },

    getX() {
      // console.log("getXX");
      return (
        this.file.x - (this.file.isSelected ? this.$store.state.dragOffsetX : 0)
      );
    },
    getY() {
      return (
        this.file.y - (this.file.isSelected ? this.$store.state.dragOffsetY : 0)
      );
    },
  },
  computed: {},
  created() {},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.mydiv {
  will-change: transform;
  backface-visibility: hidden;
  perspective: 1000;

  position: absolute;
  height: 100px;
  width: 100px;
  background-color: #f1f1f1;
  border: 1px solid #15141a;
  text-align: center;
  color: rgba(61, 61, 61, 0.911);
}

.mydiv.selected {
  border: 4px solid rgba(197, 41, 41, 0.911);
  // box-shadow: 0 0 4px 4px rgb(223, 73, 73);
  transition: none;
}
</style>
