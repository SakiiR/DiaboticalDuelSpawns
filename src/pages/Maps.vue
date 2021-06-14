<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section>
        <div class="text-h6">Maps</div>
      </q-card-section>
      <q-card-section>
        <q-list padding>
          <q-item
            clickable
            v-for="map in maps"
            :key="map.uuid"
            @click="clickMap(map.title)"
          >
            <q-item-section top thumbnail class="q-ml-none">
              <img :src="map.thumbnail" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ map.title }}</q-item-label>
              <q-item-label caption>{{ map.uuid }} ( click 2 use )</q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label caption>
                <q-btn
                  color="primary"
                  round
                  icon="content_paste"
                  @click.stop.prevent="clipboardCopyCode(map.code)"
                />
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { copyToClipboard } from "quasar";
import MapsService from "../services/maps";

export default {
  name: "Maps",
  data() {
    return {
      maps: []
    };
  },
  async mounted() {
    this.maps = await MapsService.getMaps();
  },
  methods: {
    clickMap(title) {
      this.$router.push({ name: "map", params: { title } });
    },
    clipboardCopyCode(code) {
      copyToClipboard(code)
        .then(() => {
          this.$q.notify({
            type: "positive",
            message: `Copied code to clipboard`
          });
        })
        .catch(() => {
          this.$q.dialog({
            title: "Copy yourself !",
            message: `<textarea>${code}</textarea>`,
            html: true
          });
        });
    }
  }
};
</script>

<style></style>
