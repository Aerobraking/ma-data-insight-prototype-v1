
<template>
  <div
    @mouseup.capture.ctrl="dragMouseUp"
    @mousedown.capture.ctrl="dragMouseDown"
    @mousemove.capture.ctrl="dragMouseMove"
    class="wrapper-overview overview"
  >
    <!-- Ohne selector hat es nicht funktioniert, weil er dann passendes dom element findet -->
    <panZoom
      @init="panHappen"
      :options="{
        minZoom: 0.08,
        maxZoom: 6,
        bounds: false,
        initialZoom: 0.5,
        beforeWheel: beforeWheelHandler,
        beforeMouseDown: beforeMouseDownHandler,
      }"
      selector=".zoomable"
    >
      <div class="zoomable zoomPanel-overview">
        <Nodes :files="workspace.nodes"></Nodes>
      </div>
    </panZoom>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import Nodes from "./nodes.vue";

export default defineComponent({
  el: "#wrapper",
  name: "overview-view",
  components: {
    Nodes,
  },
  props: {
    workspace: null,
  },
  data(): {
    dragStartX: number;
    dragStartY: number;
    mouseDownB: boolean;
    panZoomInstance: any;
  } {
    return {
      dragStartX: 0,
      dragStartY: 0,
      mouseDownB: false,
      panZoomInstance: null,
    };
  },
  computed: {},
  methods: {
    getNodes() {
      return this.$props.workspace.nodes;
    },
    panHappen: function (p: any, id: String) {
      p.setTransformOrigin(null);
      this.panZoomInstance = p;
    },
    keyDownCtrl: function (e: KeyboardEvent) {
      e.preventDefault;
      let cmd = e.code.toLowerCase();
      if (cmd === "keyd") {
        this.$store.dispatch("selectAll", {
          viewKey: this.workspace.key,
        });
      }
    },
    dragMouseMove: function (e: MouseEvent) {
      if (!this.mouseDownB) {
        return;
      }

      var xOffT = this.dragStartX - e.clientX;
      var yOffT = this.dragStartY - e.clientY;

      xOffT /= this.panZoomInstance.getTransform().scale;
      yOffT /= this.panZoomInstance.getTransform().scale;

      // console.log("check: "+xOffT+" - "+ yOffT);
      if (Math.abs(xOffT) >= 1 || Math.abs(yOffT) >= 1) {
        this.$store.dispatch("moveSelectedOffset", {
          xOff: xOffT,
          yOff: yOffT,
          viewKey: this.workspace.key,
        });
        //   console.log("fire");
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
      }
    },
    dragMouseUp: function (e: MouseEvent) {
      console.log("mouse dragMouseUp");
      this.mouseDownB = false;
    },
    dragMouseDown: function (e: MouseEvent) {
      console.log("mouse dragMouseDown");
      this.mouseDownB = true;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
    },
    beforeWheelHandler(e: any) {
      var shouldIgnore: boolean = !e.altKey;
      return shouldIgnore;
    },
    beforeMouseDownHandler(e: any) {
      var shouldIgnore: boolean = !e.altKey;
      return shouldIgnore;
    },
  },
});
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.zoomPanel-overview {
  width: 800px;
  height: 800px;
  left: 300px;
  top: 300px;
}

.wrapper-overview {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgb(53, 53, 53);
}
</style>
