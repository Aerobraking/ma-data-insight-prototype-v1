
<template>
  <div
    @keypress.capture.ctrl.stop="keyDownCtrl"
    @mouseup.capture.ctrl="dragMouseUp"
    @mousedown.capture.ctrl="dragMouseDown"
    @mousemove.capture.ctrl.exact="dragMouseMove"
    @click.exact="canvasMouseClick"
    class="wrapper-globalview"
  ></div>
</template>

<script lang="ts">
const data1: any = {
  name: "Root",
  children: [
    {
      name: "Child 1",
      children: [
        { name: "Architects, except naval", ID: "1.2.2.1", size: 178 },
        {
          name: "Surveyors, cartographers, and photogrammetrists",
          ID: "1.2.2.2",
          size: 41,
        },
        { name: "Aerospace engineers", ID: "1.2.2.3", size: 147 },
        { name: "Agricultural engineers", ID: "1.2.2.4", size: 4 },
        { name: "Biomedical engineers", ID: "1.2.2.5", size: 14 },
        { name: "Chemical engineers", ID: "1.2.2.6", size: 79 },
        { name: "Civil engineers", ID: "1.2.2.7", size: 349 },
        { name: "Computer hardware engineers", ID: "1.2.2.8", size: 84 },
        {
          name: "Electrical and electronics engineers",
          ID: "1.2.2.9",
          size: 271,
        },
        { name: "Environmental engineers", ID: "1.2.2.10", size: 42 },
        {
          name: "Industrial engineers, including health and safety",
          ID: "1.2.2.11",
          size: 194,
        },
        {
          name: "Marine engineers and naval architects",
          ID: "1.2.2.12",
          size: 9,
        },
        { name: "Materials engineers", ID: "1.2.2.13", size: 35 },
        { name: "Mechanical engineers", ID: "1.2.2.14", size: 303 },
        {
          name:
            "Mining and geological engineers, including mining safety engineers",
          ID: "1.2.2.15",
          size: 15,
        },
        { name: "Nuclear engineers", ID: "1.2.2.16", size: 5 },
        { name: "Petroleum engineers", ID: "1.2.2.17", size: 37 },
        { name: "Engineers, all other", ID: "1.2.2.18", size: 406 },
        { name: "Drafters", ID: "1.2.2.19", size: 138 },
        {
          name: "Engineering technicians, except drafters",
          ID: "1.2.2.20",
          size: 369,
        },
        { name: "Surveying and mapping technicians", ID: "1.2.2.21", size: 77 },
      ],
    },
    {
      name: "Child 2",
      children: [
        { name: "Architects, except naval", ID: "1.2.2.1", size: 178 },
        {
          name: "Surveyors, cartographers, and photogrammetrists",
          ID: "1.2.2.2",
          size: 41,
        },
        { name: "Aerospace engineers", ID: "1.2.2.3", size: 147 },
        { name: "Agricultural engineers", ID: "1.2.2.4", size: 4 },
        { name: "Biomedical engineers", ID: "1.2.2.5", size: 14 },
        { name: "Chemical engineers", ID: "1.2.2.6", size: 79 },
        { name: "Civil engineers", ID: "1.2.2.7", size: 349 },
        { name: "Computer hardware engineers", ID: "1.2.2.8", size: 84 },
        {
          name: "Electrical and electronics engineers",
          ID: "1.2.2.9",
          size: 271,
        },
        { name: "Environmental engineers", ID: "1.2.2.10", size: 42 },
        {
          name: "Industrial engineers, including health and safety",
          ID: "1.2.2.11",
          size: 194,
        },
        {
          name: "Marine engineers and naval architects",
          ID: "1.2.2.12",
          size: 9,
        },
        { name: "Materials engineers", ID: "1.2.2.13", size: 35 },
        { name: "Mechanical engineers", ID: "1.2.2.14", size: 303 },
        {
          name:
            "Mining and geological engineers, including mining safety engineers",
          ID: "1.2.2.15",
          size: 15,
        },
        { name: "Nuclear engineers", ID: "1.2.2.16", size: 5 },
        { name: "Petroleum engineers", ID: "1.2.2.17", size: 37 },
        { name: "Engineers, all other", ID: "1.2.2.18", size: 406 },
        { name: "Drafters", ID: "1.2.2.19", size: 138 },
        {
          name: "Engineering technicians, except drafters",
          ID: "1.2.2.20",
          size: 369,
        },
        { name: "Surveying and mapping technicians", ID: "1.2.2.21", size: 77 },
      ],
    },
  ],
};

import { defineComponent } from "vue";
import Nodes from "./nodes.vue";
import * as d3 from "d3";
import { ZoomView } from "d3";

export default defineComponent({
  el: "#app",
  name: "GlobalView",
  components: {
    Nodes,
  },
  props: {
    global: null,
  },
  data(): {
    dt: number;
    dragStartX: number;
    dragStartY: number;
    mouseDownB: boolean;
    canvas: any;
    hiddenCanvas: any;
    ease: any;
    duration: any;
    timeElapsed: any;
    interpolator: any;
    vOld: ZoomView;
    focus: any;
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
      dt: 0,
      dragStartX: 0,
      dragStartY: 0,
      mouseDownB: false,
      root: null,
      canvas: null,
      hiddenCanvas: null,
      ease: d3.easeCubicInOut,
      duration: 2000,
      timeElapsed: 0,
      interpolator: null,
      vOld: [0, 0, 1],
      focus: null,
      nodeCount: null,
      colToCircle: {},
      zoomInfo: {
        centerX: 0,
        centerY: 0,
        scale: 1,
      },
      nextCol: 1,
      colorCircle: d3
        .scaleOrdinal<number, string>()
        .domain([0, 1, 2, 3])
        .range(["#bfbfbf", "#838383", "#4c4c4c", "#1c1c1c"]),
      nodes: null,
      diameter: null,
      radius: null,
      hiddenContext: [],
      context: null,
    };
  },
  mounted() {
    // d3.json("data.json").then(function (data: any) {
    //   // this.drawAll;
    // });
    this.drawAll();
  },
  created() {},
  computed: {},
  methods: {
    drawAll: function () {
      //////////////////////////////////////////////////////////////
      ////////////////// Create Set-up variables  //////////////////
      //////////////////////////////////////////////////////////////

      //////////////////////////////////////////////////////////////
      /////////////////////// Create SVG  ///////////////////////
      //////////////////////////////////////////////////////////////

      //Create the visible canvas and context
      this.canvas = d3
        .select(".wrapper-globalview")
        .append("canvas")
        .attr("width", this.$el.clientWidth)
        .attr("height", this.$el.clientHeight)
        .attr("id", "canvas")
        .attr("class", "canvas-gv");

      this.context = this.canvas.node().getContext("2d");
      this.context.clearRect(0, 0, this.$el.clientWidth, this.$el.clientHeight);

      //Create a hidden canvas in which each circle will have a different color
      //We can use this to capture the clicked on circle
      this.hiddenCanvas = d3
        .select(".wrapper-globalview")
        .append("canvas")
        .attr("width", this.$el.clientWidth)
        .attr("height", this.$el.clientHeight)
        .attr("id", "hiddenCanvas")
        .attr("class", "canvas-gv")
        .style("display", "none");

      this.hiddenContext = this.hiddenCanvas.node().getContext("2d");
      this.hiddenContext.clearRect(
        0,
        0,
        this.$el.clientWidth,
        this.$el.clientHeight
      );

      //Create a custom element, that will not be attached to the DOM, to which we can bind the data
      var detachedContainer = document.createElement("custom");
      let dataContainer = d3.select(detachedContainer);

      //////////////////////////////////////////////////////////////
      /////////////////////// Create Scales  ///////////////////////
      //////////////////////////////////////////////////////////////

      (this.diameter = Math.min(this.$el.clientWidth, this.$el.clientHeight)),
        (this.radius = this.diameter / 2);

      //Dataset to swtich between color of a circle (in the hidden canvas) and the node data

      //////////////////////////////////////////////////////////////
      ////////////////// Create Circle Packing /////////////////////
      //////////////////////////////////////////////////////////////
      this.root = d3.hierarchy(data1);
      this.root
        .sum(function (d: any) {
          return d.size ? d.size : 0;
        })
        .sort(function (a: any) {
          return a.ID;
        });

      let pack = d3.pack().padding(1).size([this.diameter, this.diameter]);
      pack(this.root);

      this.nodes = this.root.descendants();
      this.focus = this.root;

      this.nodeCount = this.nodes.length;

      //Based on the generous help by Stephan Smola
      //http://bl.ocks.org/smoli/d7e4f9199c15d71258b5

      this.vOld = [this.focus.x, this.focus.y, this.focus.r * 2.05];

      //First zoom to get the circles to the right location
      this.zoomToCanvas(this.root);

      var thisInstance = this;

      d3.timer(function (elapsed: number) {
        thisInstance.interpolateZoom(elapsed - thisInstance.dt);
        thisInstance.dt = elapsed;
        thisInstance.drawCanvas(false);
      });
    },
    getNodes() {
      return this.$props.global.nodes;
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
      if (!this.mouseDownB) {
        return;
      }
      var xOffT = this.dragStartX - e.clientX;
      var yOffT = this.dragStartY - e.clientY;
      xOffT /= this.zoomInfo.scale;
      yOffT /= this.zoomInfo.scale;
      this.zoomInfo.centerX += xOffT;
      this.zoomInfo.centerY += yOffT;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      let v: ZoomView = [
        this.zoomInfo.centerX,
        this.zoomInfo.centerY,
        this.focus.r * 2.05,
      ];
      this.vOld = v; //Save the "viewport" of the next state as the next "old" state
    },
    dragMouseUp: function (e: MouseEvent) {
      // console.log("mouse dragMouseUp");
      this.mouseDownB = false;
    },
    dragMouseDown: function (e: MouseEvent) {
      // console.log("mouse dragMouseDown");
      this.mouseDownB = true;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
    },

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
    drawCanvas: function (hidden: boolean) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;

      let chosenContext = hidden ? this.hiddenContext : this.context;
      //Clear canvas
      chosenContext.fillStyle = "#fff";
      chosenContext.rect(0, 0, this.canvas.width, this.canvas.height);
      chosenContext.fill();

      //Select our dummy nodes and draw the data to canvas.
      var node = null;
      // It's slightly faster than nodes.forEach()
      for (var i = 0; i < this.nodeCount; i++) {
        node = this.nodes[i];

        //If the hidden canvas was send into this function and it does not yet have a color, generate a unique one
        if (true || hidden) {
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
          chosenContext.fillStyle = `rgba(10,10,10,${0.1 * (node.depth + 1)})`;
        } //else

        //Draw each circle
        var centerX = this.canvas.width / 2,
          centerY = this.canvas.height / 2;
        chosenContext.beginPath();
        chosenContext.arc(
          (node.x - this.zoomInfo.centerX) * this.zoomInfo.scale + centerX,
          (node.y - this.zoomInfo.centerY) * this.zoomInfo.scale + centerY,
          node.r * this.zoomInfo.scale,
          0,
          2 * Math.PI,
          true
        );

        chosenContext.fill();
      } //for i
    },
    canvasMouseClick: function (e: MouseEvent) {
      // We actually only need to draw the hidden canvas when there is an interaction.
      // This sketch can draw it on each loop, but that is only for demonstration.

      this.drawCanvas(true);

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
    zoomToCanvas: function (focusNode: any) {
      this.focus = focusNode;
      let v: ZoomView = [this.focus.x, this.focus.y, this.focus.r * 2.05]; //The center and width of the new "viewport"

      this.interpolator = d3.interpolateZoom(this.vOld, v); //Create interpolation between current and new "viewport"

      this.duration = this.interpolator.duration/4; //Interpolation gives back a suggested duration
      // this.duration = 0;
      console.log(this.vOld);
      console.log(v);
      console.log();

      this.timeElapsed = 0; //Set the time elapsed for the interpolateZoom function to 0
      this.vOld = v; //Save the "viewport" of the next state as the next "old" state
    },
    interpolateZoom: function (dt: any) {
      if (this.interpolator != null) {
        if (this.duration == 0) {
          this.zoomInfo.centerX = this.focus.x;
          this.zoomInfo.centerY = this.focus.y;
          this.zoomInfo.scale = this.diameter / (this.focus.r * 2);
          this.interpolator = null;
          return;
        }

        this.timeElapsed += dt;
        // var t = this.ease(this.timeElapsed / this.duration);
        var t = this.timeElapsed / this.duration;

        this.zoomInfo.centerX = this.interpolator(t)[0];
        this.zoomInfo.centerY = this.interpolator(t)[1];
        this.zoomInfo.scale = this.diameter / this.interpolator(t)[2];

        if (this.timeElapsed >= this.duration) this.interpolator = null;
      } //if
    }, //function zoomToCanvas
  },
});
</script>

 
<style scoped lang="scss">
.wrapper-globalview {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgb(53, 53, 53);
}
canvas {
  height: 100vh;
  width: 100vw;
  display: block;
}
</style>
