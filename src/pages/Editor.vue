<template>
  <q-page class="flex">
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="my-card" flat bordered>
        <q-card-section :style="{ height: '100px', overflow: 'hidden' }">
          <img
            :src="thumbnail"
            alt="click to add thumbnail"
            @click="browseThumbnail"
            :style="{ width: '100px', border: '1px solid black' }"
          />

          <input
            type="file"
            ref="thumbnailInput"
            @change="processThumbnail"
            class="hidden"
          />
        </q-card-section>
        <canvas ref="editor" width="800px" height="800px" />

        <q-card-section>
          <div class="text-h5 q-mt-sm q-mb-xs">
            {{ title }}
            <q-popup-edit v-model="title" title="Edit the title">
              <q-input v-model="title" dense autofocus counter />
            </q-popup-edit>
          </div>

          <div class="text-caption text-grey">
            Select your map image. It can be found in the diabotical system
            directory. Click to add or remove spawn point.
          </div>
        </q-card-section>

        <q-card-actions>
          <div>
            <q-btn flat color="dark" label="Share" @click="share" />
            <q-btn
              flat
              color="primary"
              label="Choose Map (background)"
              @click="browseMap"
            />
          </div>
          <div>
            <q-input v-model="code" filled borderless>
              <q-btn
                round
                icon="get_app"
                flat
                color="primary"
                @click="loadCode"
              />
            </q-input>
          </div>
          <input
            type="file"
            ref="mapInput"
            @change="processMap"
            class="hidden"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import CanvasHelper from "../utils/canvas";
import { v4 as uuidv4 } from "uuid";
import { copyToClipboard } from "quasar";

export default {
  name: "Editor",
  data() {
    return {
      title: "Default title",
      thumbnail: null,
      image: null,
      spawns: [],
      code: "",
      helper: null,
      mouse: {
        x: 0,
        y: 0
      }
    };
  },
  mounted() {
    const canvas = this.getCanvas();

    this.helper = new CanvasHelper(canvas);

    this.helper.writeMessage("Load an image first");

    canvas.addEventListener(
      "mousemove",
      event => {
        const { x, y } = this.helper.getMousePosition(event);
        this.mouse.x = x;
        this.mouse.y = y;
      },
      false
    );

    canvas.addEventListener(
      "click",
      event => {
        const { x, y } = this.helper.getMousePosition(event);
        this.mouse.x = x;
        this.mouse.y = y;

        this.addSpawn();
      },
      false
    );

    requestAnimationFrame(this.refresh.bind(this));
  },
  methods: {
    addSpawn() {
      const { x, y } = this.mouse;

      let toRemove = [];

      for (const spawn of this.spawns) {
        if (this.helper.collide(spawn, { x, y })) {
          toRemove.push(spawn.uuid);
        }
      }

      if (toRemove.length) {
        for (const uuid of toRemove) {
          this.spawns = this.spawns.filter(i => i.uuid !== uuid);
        }
        return;
      }

      const uuid = uuidv4();

      this.spawns.push({
        uuid,
        x,
        y
      });
    },
    refresh() {
      this.applyImage();

      if (this.image) {
        this.helper.drawCursor(this.mouse.x, this.mouse.y);

        for (const spawn of this.spawns) {
          const { x, y } = spawn;
          this.helper.drawSpawnPoint(x, y);
        }
      }

      requestAnimationFrame(this.refresh.bind(this));
    },
    getCanvas() {
      return this.$refs.editor;
    },
    getCtx() {
      return this.getCanvas().getContext("2d");
    },
    loadCode() {
      try {
        const { spawns, title, image, thumbnail } = JSON.parse(this.code);

        this.spawns = spawns;
        this.title = title;
        this.image = image;
        this.thumbnail = thumbnail;

        this.code = "";
      } catch (e) {
        this.$q.notify({
          type: "negative",
          message: `Invalid code provided`
        });
      }
    },
    share() {
      const { spawns, image, title, thumbnail } = this;
      const uuid = uuidv4();

      const share = JSON.stringify({
        spawns,
        image,
        thumbnail,
        uuid,
        title
      });

      copyToClipboard(share)
        .then(() => {
          this.$q.notify({
            type: "positive",
            message: `Copied code to clipboard`
          });
        })
        .catch(() => {
          this.$q.dialog({
            title: "Copy yourself !",
            message: `<textarea>${share}</textarea>`,
            html: true
          });
        });
    },
    browseMap() {
      const { mapInput } = this.$refs;
      mapInput.click();
    },
    browseThumbnail() {
      const { thumbnailInput } = this.$refs;
      thumbnailInput.click();
    },
    applyImage() {
      if (!this.image) return;

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

      image.src = this.image;
    },
    processMap(ev) {
      const file = ev.target.files[0];
      this.processFile(file, "image");
    },
    processThumbnail(ev) {
      const file = ev.target.files[0];
      this.processFile(file, "thumbnail");
    },
    processFile(file, type) {
      if (type === "thumbnail") {
        this.thumbnail = null;
      } else {
        this.image = null;
      }

      if (!file) {
        this.$q.notify({
          type: "negative",
          message: `Invalid file specified`
        });
      }

      const reader = new FileReader();

      reader.onload = e => {
        const content = e.target.result;

        if (type === "thumbnail") {
          this.thumbnail = content;
        } else {
          this.image = content;
          this.applyImage();
        }
      };

      reader.readAsDataURL(file);
    }
  }
};
</script>

<style>
canvas {
  width: 100%;
  height: 100%;
  border: 1px solid black;
}

.hidden {
  display: none;
}
</style>
