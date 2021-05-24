
<template>
  <div
    @mouseup.capture.ctrl="dragMouseUp"
    @mousedown.capture.ctrl="dragMouseDown"
    @mousemove.capture.ctrl="dragMouseMove"
    class="wrapper-overview overview"
  >
    <!-- Ohne selector hat es nicht funktioniert, weil er dann passendes dom element findet -->
    <div class="canvas-wrapper"></div>
  </div>
</template>


<script lang="ts">
 

import { defineComponent } from "vue";
import Nodes from "./nodes.vue";
 import * as d3 from 'd3'; 

export default defineComponent({
  el: "#wrapper",
  name: "overview-view",
  components: {
    Nodes,
  },
  props: {
    overview: null,
  },
  data(): {
    dragStartX: number;
    dragStartY: number;
    mouseDownB: boolean;
    canvas: any;
    ease: any;
    duration: any;
    timeElapsed: any;
    interpolator: any;
    vOld: any;
    focus: any;
    cWidth: any;
    cHeight: any;
    nodeCount: any;
    colToCircle: any;
    zoomInfo: any;
    nextCol: number;
    colorCircle: any;
    nodes: any;
    root: any;
    diameter: any;
    radius: any;
    hiddenContext: any;
    context: any;
  } {
    return {
      dragStartX: 0,
      dragStartY: 0,
      mouseDownB: false,
      root: null,
      canvas: null,
      ease: d3.transition.ease("cubic-in-out"),
      duration: 2000,
      timeElapsed: 0,
      interpolator: null,
      vOld: null,
      focus: null,
      cWidth: null,
      cHeight: null,
      nodeCount: null,
      colToCircle: {},
      zoomInfo: {
        centerX: 600 / 2,
        centerY: 600 / 2,
        scale: 1,
      },
      nextCol: 1,
      colorCircle: d3.scale
        .ordinal()
        .domain([0, 1, 2, 3])
        .range(["#bfbfbf", "#838383", "#4c4c4c", "#1c1c1c"]),
      nodes: null,
      diameter: null,
      radius: null,
      hiddenContext: null,
      context: null,
    };
  },
  mounted() {
    d3.queue().defer(d3.json, "data.json").await(this.drawAll);
  },
  computed: {},
  methods: {
    drawAll: function (error: any, dataset: any) {
      //////////////////////////////////////////////////////////////
      ////////////////// Create Set-up variables  //////////////////
      //////////////////////////////////////////////////////////////

      var width = 600,
        height = 600;

      //////////////////////////////////////////////////////////////
      /////////////////////// Create SVG  ///////////////////////
      //////////////////////////////////////////////////////////////

      //Create the visible canvas and context
      this.canvas = d3
        .select(".canvas-wrapper")
        .append("canvas")
        .attr("id", "canvas")
        .attr("width", width)
        .attr("height", height);
      var context = this.canvas.node().getContext("2d");
      context.clearRect(0, 0, width, height);

      //Create a hidden canvas in which each circle will have a different color
      //We can use this to capture the clicked on circle
      var hiddenCanvas = d3
        .select(".canvas-wrapper")
        .append("canvas")
        .attr("id", "hiddenCanvas")
        .attr("width", width)
        .attr("height", height)
        .style("display", "none");
      this.hiddenContext = hiddenCanvas.node().getContext("2d");
      this.hiddenContext.clearRect(0, 0, width, height);

      //Create a custom element, that will not be attached to the DOM, to which we can bind the data
      var detachedContainer = document.createElement("custom");
      var dataContainer = d3.select(detachedContainer);

      //////////////////////////////////////////////////////////////
      /////////////////////// Create Scales  ///////////////////////
      //////////////////////////////////////////////////////////////

      (this.diameter = Math.min(width * 0.9, height * 0.9)),
        (this.radius = this.diameter / 2);

      //Dataset to swtich between color of a circle (in the hidden canvas) and the node data

      var pack = d3.layout
        .pack()
        .padding(1)
        .size([this.diameter, this.diameter])
        .value(function (d: any) {
          return d.size;
        })
        .sort(function (d: any) {
          return d.ID;
        });

      //////////////////////////////////////////////////////////////
      ////////////////// Create Circle Packing /////////////////////
      //////////////////////////////////////////////////////////////

      (this.nodes = pack.nodes(dataset)),
        (this.root = dataset),
        (this.focus = this.root);

      this.cWidth = this.canvas.attr("width");
      this.cHeight = this.canvas.attr("height");
      this.nodeCount = this.nodes.length;

      //Based on the generous help by Stephan Smola
      //http://bl.ocks.org/smoli/d7e4f9199c15d71258b5

      this.vOld = [this.focus.x, this.focus.y, this.focus.r * 2.05];

      //First zoom to get the circles to the right location
      this.zoomToCanvas(this.root);

      var thistInstance = this;

      var dt = 0;
      d3.timer(function (elapsed: any) {
        thistInstance.interpolateZoom(elapsed - dt);
        dt = elapsed;
        thistInstance.drawCanvas(thistInstance.context, false);
      });
    },
    getNodes() {
      return this.$props.overview.nodes;
    },

    keyDownCtrl: function (e: KeyboardEvent) {
      // e.preventDefault;
      // let cmd = e.code.toLowerCase();
      // if (cmd === "keyd") {
      //   this.$store.dispatch("selectAll", {
      //     viewKey: this.overview.key,
      //   });
      // }
    },
    dragMouseMove: function (e: MouseEvent) {
      // if (!this.mouseDownB) {
      //   return;
      // }
      // var xOffT = this.dragStartX - e.clientX;
      // var yOffT = this.dragStartY - e.clientY;
      // xOffT /= this.panZoomInstance.getTransform().scale;
      // yOffT /= this.panZoomInstance.getTransform().scale;
      // // console.log("check: "+xOffT+" - "+ yOffT);
      // if (Math.abs(xOffT) >= 1 || Math.abs(yOffT) >= 1) {
      //   this.$store.dispatch("moveSelectedOffset", {
      //     xOff: xOffT,
      //     yOff: yOffT,
      //     viewKey: this.overview.key,
      //   });
      //   //   console.log("fire");
      //   this.dragStartX = e.clientX;
      //   this.dragStartY = e.clientY;
      // }
    },
    dragMouseUp: function (e: MouseEvent) {
      // console.log("mouse dragMouseUp");
      // this.mouseDownB = false;
    },
    zoomToCanvas: function (focusNode: any) {
      this.focus = focusNode;
      var v = [this.focus.x, this.focus.y, this.focus.r * 2.05]; //The center and width of the new "viewport"

      this.interpolator = d3.interpolateZoom(this.vOld, v); //Create interpolation between current and new "viewport"

      this.duration = this.interpolator.duration; //Interpolation gives back a suggested duration
      this.timeElapsed = 0; //Set the time elapsed for the interpolateZoom function to 0
      this.vOld = v; //Save the "viewport" of the next state as the next "old" state
    }, //function zoomToCanvas
    genColor: function () {
      var ret = [];
      // via http://stackoverflow.com/a/15804183
      if (this.nextCol < 16777215) {
        ret.push(this.nextCol & 0xff); // R
        ret.push((this.nextCol & 0xff00) >> 8); // G
        ret.push((this.nextCol & 0xff0000) >> 16); // B

        this.nextCol += 10; // This is exagerated for this example and would ordinarily be 1.
      }
      var col = "rgb(" + ret.join(",") + ")";
      return col;
    }, //function genColor,
    //The draw function of the canvas that gets called on each frame
    drawCanvas: function (chosenContext: any, hidden: boolean) {
      //Clear canvas
      chosenContext.fillStyle = "#fff";
      chosenContext.rect(0, 0, this.cWidth, this.cHeight);
      chosenContext.fill();

      //Select our dummy nodes and draw the data to canvas.
      var node = null;
      // It's slightly faster than nodes.forEach()
      for (var i = 0; i < this.nodeCount; i++) {
        node = this.nodes[i];

        //If the hidden canvas was send into this function and it does not yet have a color, generate a unique one
        if (hidden) {
          if (node.color == null) {
            // If we have never drawn the node to the hidden canvas get a new color for it and put it in the dictionary.
            node.color = this.genColor();
            this.colToCircle[node.color] = node;
          } //if
          // On the hidden canvas each rectangle gets a unique color.
          chosenContext.fillStyle = node.color;
        } else {
          chosenContext.fillStyle = node.children
            ? this.colorCircle(node.depth)
            : "white";
        } //else

        //Draw each circle
        chosenContext.beginPath();
        chosenContext.arc(
          (node.x - this.zoomInfo.centerX) * this.zoomInfo.scale + 250,
          (node.y - this.zoomInfo.centerY) * this.zoomInfo.scale + 250,
          node.r * this.zoomInfo.scale,
          0,
          2 * Math.PI,
          true
        );
        chosenContext.fill();
      } //for i
    }, //function drawCanvas
    canvasMouseClick: function (e: MouseEvent) {
      // We actually only need to draw the hidden canvas when there is an interaction.
      // This sketch can draw it on each loop, but that is only for demonstration.
      this.drawCanvas(this.hiddenContext, true);

      //Figure out where the mouse click occurred.
      var mouseX = e.clientX;
      var mouseY = e.clientY;

      // Get the corresponding pixel color on the hidden canvas and look up the node in our map.
      // This will return that pixel's color
      var col = this.hiddenContext.getImageData(mouseX, mouseY, 1, 1).data;
      //Our map uses these rgb strings as keys to nodes.
      var colString = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")";
      var node = this.colToCircle[colString];

      if (node) {
        if (focus !== node) this.zoomToCanvas(node);
        else this.zoomToCanvas(this.root);
      } //if
    },
    interpolateZoom: function (dt: any) {
      if (this.interpolator) {
        this.timeElapsed += dt;
        var t = this.ease(this.timeElapsed / this.duration);

        this.zoomInfo.centerX = this.interpolator(t)[0];
        this.zoomInfo.centerY = this.interpolator(t)[1];
        this.zoomInfo.scale = this.diameter / this.interpolator(t)[2];

        if (this.timeElapsed >= this.duration) this.interpolator = null;
      } //if
    }, //function zoomToCanvas
    dragMouseDown: function (e: MouseEvent) {
      // console.log("mouse dragMouseDown");
      // this.mouseDownB = true;
      // this.dragStartX = e.clientX;
      // this.dragStartY = e.clientY;
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

.canvas-wrapper {
  width: 100%;
  height: 100%;
}

.wrapper-overview {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgb(53, 53, 53);
}
</style>
