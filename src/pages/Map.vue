<template>
  <q-page class="flex">
    <div class="q-pa-md row items-start q-gutter-md" v-if="map">
      <q-card class="my-card" flat bordered>
        <q-card-section :style="{ height: '100px', overflow: 'hidden' }">
          <img :src="map.thumbnail" :style="{ width: '100px' }" />
        </q-card-section>

        <canvas ref="editor" width="800px" height="800px" />

        <q-card-section >
          <div class="text-h5 q-mt-sm q-mb-xs">
            {{ map.title }}
          </div>

          <div class="text-caption text-grey">
            Move the mouse and see which spawns are actual candidates blah blah
            blah
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import MapsService from "src/services/maps";

import CanvasHelper from "src/utils/canvas";
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export default {
  name: "Map",
  data() {
    return {
      map: null,
      helper: null,
      mouse: {
        x: 0,
        y: 0
      }
    };
  },
   async mounted () {
    const maps = await MapsService.getMaps();
    this.map = maps.find(m => m.title === this.$route.params.title);

    await sleep(1000);

    const canvas = this.getCanvas();
    this.helper = new CanvasHelper(canvas);

    canvas.addEventListener("mousemove", event => {
      const { x, y } = this.helper.getMousePosition(event);
      this.mouse.x = x;
      this.mouse.y = y;
    });

    requestAnimationFrame(this.refresh.bind(this));
  },
  methods: {
    refresh() {
      if (!this.map) return;

      this.applyImage();

      // draw spawns
      this.drawSpawns()

      requestAnimationFrame(this.refresh.bind(this));
    },
    drawSpawns(){
        const spawns = []

        for (const spawn of this.map.spawns){
            spawns.push({...spawn, distance: this.helper.computeDistance(this.mouse, spawn)});

        }

    },

    getCanvas() {
      return this.$refs.editor;
    },
    getCtx() {
      return this.getCanvas().getContext("2d");
    },
    applyImage() {
      if (!this.map.image) return;

      const image = new Image();
      image.addEventListener(
        "load",
        () => {
          const editor = this.getCanvas();
          const ctx = this.getCtx();

          ctx.drawImage(image, 0, 0, editor.width, editor.height);
        },
        false
      );

      image.src = this.map.image;
    }
  }
};
</script>

<style></style>
